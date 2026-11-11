import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import texts from '../../locales/index.js'
import Animated from '../Animated.jsx'
import { prefersReducedMotion, useLeaving } from '../useLeaving.js'
import { insertAt, useUndo } from '../undo.js'
import DateField from './DateField.jsx'
import RichTextEditor from './RichTextEditor.jsx'
import Select from './Select.jsx'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CloseIcon, CopyIcon, GripIcon, PlusIcon, SortIcon, VisibilityIcon } from '../Icons.jsx'
import { useDragSensors } from './useDragSensors.js'

function labelFor(sectionKey, name) {
  return texts[sectionKey][name] ?? texts.fields[name]
}

function exampleFor(sectionKey, name) {
  return texts.examples[sectionKey]?.[name] ?? texts.examples.fields[name]
}

function emptyItem(fields) {
  // The index is not a valid key: when an item is removed, React would mix up another one's fields
  const item = { id: crypto.randomUUID() }
  for (const field of fields) {
    if (field.type === 'date' || field.type === 'endDate') {
      item[field.name] = { month: '', year: '' }
    } else {
      item[field.name] = ''
    }
    if (field.type === 'endDate') {
      item.current = false
    }
  }
  return item
}

// "Excel, Word", one per line or a column copied from a spreadsheet → ['Excel', 'Word'], without
// bullets or numbers in front. "y" does not split: "Trabajo en equipo y liderazgo" is one item.
function splitList(text) {
  return text
    .split(/[,;\n\r\t•·]+/)
    .map((piece) => piece.trim().replace(/^(?:[-*–—]\s*|\d{1,2}[.)]\s+)/, '').trim())
    .filter(Boolean)
}

// The first field (position, degree, skill…) names the entry in the undo notice, so several
// removals can be told apart. Shortened, so the notice stays on one line.
function nameOf(item, fields) {
  const name = fields[0].type === 'text' ? String(item[fields[0].name] ?? '').trim() : ''
  return name.length > 40 ? `${name.slice(0, 39).trim()}…` : name
}

function Field({ sectionKey, field, item, onChange, onPasteList, autoFocus }) {
  const label = labelFor(sectionKey, field.name)
  const value = item[field.name]

  if (field.type === 'longText') {
    return (
      <RichTextEditor label={label} value={value} tip={field.tip && texts.tips[field.tip]}
        onChange={(text) => onChange(field.name, text)}/>
    )
  }
  if (field.type === 'date') {
    return <DateField label={label} value={value} onChange={(date) => onChange(field.name, date)}/>
  }
  if (field.type === 'endDate') {
    return (
      <DateField
        label={label}
        value={value}
        onChange={(date) => onChange(field.name, date)}
        hideDate={item.current}
      >
        <label className="switch-label">
          <input
            type="checkbox"
            role="switch"
            className="toggle"
            checked={item.current}
            onChange={(e) => onChange('current', e.target.checked)}
          />
          {texts.common.current}
        </label>
      </DateField>
    )
  }
  if (field.type === 'skillLevel' || field.type === 'languageLevel' || field.type === 'choice') {
    const options = field.type === 'choice' ? texts.common[field.options]
      : field.type === 'skillLevel' ? texts.common.skillLevels : texts.common.languageLevels
    return (
      <label>
        {label}
        <Select
          value={value}
          onChange={(e) => {
            // A number, not text: each template decides how to draw it (e.g. dots)
            const chosen = e.target.value
            onChange(field.name, field.type === 'skillLevel' && chosen !== '' ? Number(chosen) : chosen)
          }}
        >
          <option value="">{texts.common.choose}</option>
          {Object.entries(options).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </Select>
      </label>
    )
  }
  function handlePaste(e) {
    const pieces = splitList(e.clipboardData.getData('text'))
    // A single thing is pasted as usual
    if (pieces.length < 2) return
    e.preventDefault()
    const input = e.target
    // Empty or all selected: the paste would replace what is there
    const replace = input.selectionStart === 0 && input.selectionEnd === input.value.length
    onPasteList(field.name, pieces, replace)
  }

  return (
    <label>
      {label}
      <input
        value={value}
        autoFocus={autoFocus}
        spellCheck={field.spellCheck}
        placeholder={field.pasteList ? texts.common.pasteListHint(exampleFor(sectionKey, field.name)) : exampleFor(sectionKey, field.name)}
        onPaste={field.pasteList ? handlePaste : undefined}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </label>
  )
}

// Fields that go in pairs side by side: start and end dates, and two menus in a row
const pairOf = (field) => ({ date: 'date', endDate: 'date', choice: 'choice' })[field.type]

// Consecutive fields of the same pair kind form one group (a row)
function groupPairs(fields) {
  const groups = []
  for (const field of fields) {
    const last = groups[groups.length - 1]
    if (pairOf(field) && last && pairOf(last[0]) === pairOf(field)) last.push(field)
    else groups.push([field])
  }
  return groups
}

// The rows of an entry, for App.css to guess its height before it is first drawn (entries off
// screen are skipped), so the form does not change height while scrolling
function itemSize(groups) {
  const rich = groups.filter((group) => group[0].type === 'longText').length
  return { '--item-rows': groups.length - rich, '--item-rich': rich }
}

// Months since year 0, to compare dates; null without a year. A date with no month counts as
// January, so "03/2024" goes before a plain "2024".
function dateValue(date) {
  const year = Number(date?.year)
  return year ? year * 12 + (Number(date.month) || 1) - 1 : null
}

// Bigger first; also right with Infinity, where a subtraction would give NaN
const descending = (a, b) => (a === b ? 0 : a < b ? 1 : -1)

// Newest first: what is still going on ("Presente"), then by end date, then by start date.
// Items with no dates go last, in the order they had (sort is stable).
function sortedByDate(list, fields) {
  const start = fields.find((field) => field.type === 'date')?.name
  const end = fields.find((field) => field.type === 'endDate')?.name
  const keyOf = (item) => {
    const from = dateValue(item[start]) ?? -Infinity
    if (end && item.current) return [Infinity, from]
    return [(end && dateValue(item[end])) ?? from, from]
  }
  return list
    .map((item) => ({ item, key: keyOf(item) }))
    .sort((a, b) => descending(a.key[0], b.key[0]) || descending(a.key[1], b.key[1]))
    .map(({ item }) => item)
}

// The draggable box of an entry. The drag library redraws every draggable box in the form on
// any keystroke (it reads its own context, which memo cannot stop), so the box stays cheap and
// the entry inside it (EntryBody, memo) is drawn again only when its own data changes.
// transitionName: only while sorting by date, so the browser can slide each entry to its new place.
function Entry({ transitionName, ...body }) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({ id: body.item.id })
  return (
    <div
      ref={setNodeRef}
      className={isDragging ? 'sortable-item dragging' : 'sortable-item'}
      // Translate, not Transform: items have different heights and would be stretched
      style={{ transform: CSS.Translate.toString(transform), transition, viewTransitionName: transitionName }}
    >
      <EntryBody {...body} handleAttributes={attributes} handleListeners={listeners} handleRef={setActivatorNodeRef}/>
    </div>
  )
}

// One entry of the list, with its drag handle (with a single entry there is nothing to reorder,
// so no handle). Everything it receives is a plain value or a function that never changes.
// opened: the optional fields opened in this visit, by name ("link").
const EntryBody = memo(function EntryBody({
  item, fields, sectionKey, draggable, appear, leaving, opened, handleAttributes, handleListeners, handleRef,
  onLeft, onChangeItem, onPasteList, onRemove, onDuplicate, onOpenOptional, onCloseOptional,
}) {
  const id = item.id
  const openedNames = opened ? opened.split(',') : []
  const shows = (field) => !field.optional || Boolean(item[field.name]) || openedNames.includes(field.name)
  const groups = groupPairs(fields.filter(shows))

  const handle = draggable && (
    <button
      type="button"
      ref={handleRef}
      className="drag-handle item-handle"
      data-hint={texts.reorderItems.handle}
      aria-label={texts.reorderItems.handle}
      {...handleAttributes}
      {...handleListeners}
    >
      <GripIcon/>
    </button>
  )

  return (
    <Animated appear={appear} leaving={leaving} onLeft={() => onLeft(id)}>
      <div className={item.hidden ? 'item is-hidden' : 'item'} style={itemSize(groups)}>
        {handle}
        {item.hidden && <p className="section-badge item-badge">{texts.visibility.hidden}</p>}
        {groups.map((group) => {
          const rendered = group.map((field) => {
            const input = (
              <Field
                key={field.name}
                sectionKey={sectionKey}
                field={field}
                item={item}
                onChange={(name, value) => onChangeItem(id, name, value)}
                onPasteList={(name, pieces, replace) => onPasteList(id, name, pieces, replace)}
                autoFocus={field.optional && openedNames.includes(field.name)}
              />
            )
            if (!field.optional) return input
            // An optional field can be taken away again with its ×, like the extra
            // personal details: it is emptied and its "+" button comes back
            return (
              <div className="field" key={field.name}>
                {input}
                <button
                  type="button"
                  className="field-remove"
                  data-hint={texts.common.remove}
                  aria-label={`${texts.common.remove}: ${labelFor(sectionKey, field.name)}`}
                  onClick={() => onCloseOptional(id, field.name)}
                >
                  <CloseIcon/>
                </button>
              </div>
            )
          })
          return pairOf(group[0])
            ? <div className="field-row" key={group[0].name}>{rendered}</div>
            : rendered
        })}
        <div className="item-actions">
          <button type="button" className="btn btn-ghost btn-small btn-remove" onClick={() => onRemove(id)}>{texts.common.remove}</button>
          <button type="button" className="btn btn-ghost btn-small copy-chip" onClick={() => onDuplicate(id)}>
            <CopyIcon/>{texts.common.duplicate}
          </button>
          {fields.filter((field) => !shows(field)).map((field) => (
            <button type="button" className="btn btn-ghost btn-small add-field" key={field.name}
              onClick={() => onOpenOptional(id, field.name)}>
              <PlusIcon/>{labelFor(sectionKey, field.name)}
            </button>
          ))}
          <button type="button" className="btn btn-ghost btn-small" aria-pressed={Boolean(item.hidden)}
            onClick={() => onChangeItem(id, 'hidden', !item.hidden)}>
            <VisibilityIcon hidden={item.hidden}/>
            {item.hidden ? texts.visibility.showItem : texts.visibility.hideItem}
          </button>
        </div>
      </div>
    </Animated>
  )
})

// hiddenField: a field left out of the form for now (skill levels while the CV does not show
// them); its value stays saved, so it comes back as it was
function ListSection({ sectionKey, fields, hiddenField, list, onChange }) {
  const shownFields = useMemo(
    () => (hiddenField ? fields.filter((field) => field.name !== hiddenField) : fields),
    [fields, hiddenField],
  )
  // Items added in this visit: only these grow in, so nothing animates on page load
  const [added, setAdded] = useState([])
  // Optional fields (the link) opened in this visit, as 'itemId:fieldName'
  const [openedOptional, setOpenedOptional] = useState([])
  const { isLeaving, leave, left } = useLeaving()
  const offerUndo = useUndo()
  // The entries' functions must never change (see Entry), so instead of the `list` of the render
  // they were made in, they read the latest one from here when they run
  const latestList = useRef(list)
  useEffect(() => {
    latestList.current = list
  })

  function add() {
    const item = emptyItem(fields)
    setAdded([...added, item.id])
    onChange([...list, item])
  }

  const remove = useCallback((id) => {
    const index = latestList.current.findIndex((item) => item.id === id)
    const item = latestList.current[index]
    leave(id, () => {
      onChange((current) => current.filter((other) => other.id !== id))
      // An empty item is not worth a notice
      if (Object.entries(item).some(([name, value]) => name !== 'id' && value)) {
        offerUndo(texts.undo.item(nameOf(item, fields)), () => onChange((current) => insertAt(current, index, item)))
      }
    })
  }, [fields, leave, offerUndo, onChange])

  // E.g. two positions at the same company: the copy goes right below and only needs a few changes
  const duplicate = useCallback((id) => {
    const index = latestList.current.findIndex((item) => item.id === id)
    const copy = { ...latestList.current[index], id: crypto.randomUUID() }
    setAdded((ids) => [...ids, copy.id])
    onChange((current) => insertAt(current, index + 1, copy))
  }, [onChange])

  const changeItem = useCallback((id, name, value) => {
    onChange((current) => current.map((item) => (item.id === id ? { ...item, [name]: value } : item)))
  }, [onChange])

  // A pasted list: the first piece goes in the field if the paste replaces its text, the rest
  // become entries right below. Pieces already in the list are skipped. The entry's other text
  // fields (a skill's category) are shared by the new ones.
  const pasteList = useCallback((id, name, pieces, replace) => {
    const target = latestList.current.find((item) => item.id === id)
    const known = new Set(latestList.current
      .filter((item) => !(replace && item.id === id))
      .map((item) => String(item[name] ?? '').trim().toLowerCase()))
    const fresh = pieces.filter((piece) => {
      const key = piece.toLowerCase()
      if (known.has(key)) return false
      known.add(key)
      return true
    })
    if (!fresh.length) return

    const [first, ...rest] = replace ? fresh : [null, ...fresh]
    const shared = Object.fromEntries(fields
      .filter((field) => field.type === 'text' && field.name !== name && target[field.name])
      .map((field) => [field.name, target[field.name]]))
    const created = rest.map((piece) => ({ ...emptyItem(fields), ...shared, [name]: piece }))
    const createdIds = created.map((item) => item.id)
    const withFirst = (item, text) => (replace && item.id === id ? { ...item, [name]: text } : item)

    setAdded((ids) => [...ids, ...createdIds])
    onChange((current) => {
      const next = current.map((item) => withFirst(item, first))
      next.splice(next.findIndex((item) => item.id === id) + 1, 0, ...created)
      return next
    })
    offerUndo(texts.undo.pasted(fresh.length), () => onChange((current) => current
      .filter((item) => !createdIds.includes(item.id))
      .map((item) => withFirst(item, target[name]))))
  }, [fields, offerUndo, onChange])

  const openOptional = useCallback((id, name) => {
    setOpenedOptional((opened) => [...opened, `${id}:${name}`])
  }, [])

  const closeOptional = useCallback((id, name) => {
    changeItem(id, name, '')
    setOpenedOptional((opened) => opened.filter((key) => key !== `${id}:${name}`))
  }, [changeItem])

  // As one plain string per entry, so an entry whose fields did not change can skip redrawing
  const openedOf = (id) => openedOptional
    .filter((key) => key.startsWith(`${id}:`)).map((key) => key.slice(id.length + 1)).join(',')

  const hasDates = fields.some((field) => field.type === 'date')
  const [sorting, setSorting] = useState(false)
  // The arrow of its icon: started by the mouse, ended by the animation, so it is never cut short
  const [arrowDropping, setArrowDropping] = useState(false)

  function sortByDate() {
    const sorted = sortedByDate(list, fields)
    if (sorted.every((item, i) => item === list[i])) return
    const before = list.map((item) => item.id)
    const position = (item) => (before.includes(item.id) ? before.indexOf(item.id) : Infinity)
    offerUndo(texts.undo.sorted, () => onChange((current) => [...current].sort((a, b) => position(a) - position(b))))
    if (!document.startViewTransition || prefersReducedMotion()) {
      onChange(sorted)
      return
    }
    // Each item gets a name first; then the browser animates every named item from its old
    // place to its new one
    flushSync(() => setSorting(true))
    document.startViewTransition(() => flushSync(() => onChange(sorted)))
      .finished.finally(() => setSorting(false))
  }

  const sensors = useDragSensors()
  // Screen readers hear positions (1, 2, 3…): items have no fixed name
  const position = (id) => list.findIndex((item) => item.id === id) + 1
  const accessibility = {
    screenReaderInstructions: { draggable: texts.reorderItems.instructions },
    announcements: {
      onDragStart: ({ active }) => texts.reorderItems.picked(position(active.id)),
      onDragOver: ({ over }) => (over ? texts.reorderItems.over(position(over.id)) : ''),
      onDragEnd: ({ over }) => (over ? texts.reorderItems.dropped(position(over.id)) : ''),
      onDragCancel: () => texts.reorderItems.cancelled,
    },
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    onChange((current) => {
      const ids = current.map((item) => item.id)
      return arrayMove(current, ids.indexOf(active.id), ids.indexOf(over.id))
    })
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} accessibility={accessibility}>
        <SortableContext items={list.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {list.map((item) => (
            <Entry
              key={item.id}
              item={item}
              fields={shownFields}
              sectionKey={sectionKey}
              draggable={list.length > 1}
              transitionName={sorting ? `item-${item.id}` : undefined}
              appear={added.includes(item.id)}
              leaving={isLeaving(item.id)}
              opened={openedOf(item.id)}
              onLeft={left}
              onChangeItem={changeItem}
              onPasteList={pasteList}
              onRemove={remove}
              onDuplicate={duplicate}
              onOpenOptional={openOptional}
              onCloseOptional={closeOptional}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="list-actions">
        {/* Another entry of the same kind: a plain button like its neighbours. The pills are for
            fields that were not there before (personal details). */}
        <button type="button" className="btn btn-ghost btn-small add-field" onClick={add}><PlusIcon/>{texts[sectionKey].add}</button>
        {hasDates && list.length > 1 && (
          <button
            type="button"
            className={arrowDropping ? 'btn btn-ghost btn-small dropping' : 'btn btn-ghost btn-small'}
            onClick={sortByDate}
            onMouseEnter={() => setArrowDropping(!prefersReducedMotion())}
            onAnimationEnd={(e) => e.animationName === 'arrow-drop' && setArrowDropping(false)}
          >
            <SortIcon/>{texts.common.sortByDate}
          </button>
        )}
      </div>
    </>
  )
}

// memo: it only redraws when its own list changes, not on every keystroke elsewhere in the CV
export default memo(ListSection)
