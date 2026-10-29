import { useState } from 'react'
import texts from '../../locales/es.js'
import Animated from '../Animated.jsx'
import { useLeaving } from '../useLeaving.js'
import { insertAt, useUndo } from '../undo.js'
import DateField from './DateField.jsx'
import RichTextEditor from './RichTextEditor.jsx'
import Select from './Select.jsx'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CloseIcon, GripIcon, PlusIcon, VisibilityIcon } from '../Icons.jsx'
import { useDragSensors } from './useDragSensors.js'

function labelFor(sectionKey, name) {
  return texts[sectionKey][name] ?? texts.fields[name]
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

function Field({ sectionKey, field, item, onChange, autoFocus }) {
  const label = labelFor(sectionKey, field.name)
  const value = item[field.name]

  if (field.type === 'longText') {
    return <RichTextEditor label={label} value={value} onChange={(text) => onChange(field.name, text)}/>
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
            className="switch"
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
  return (
    <label>
      {label}
      <input value={value} autoFocus={autoFocus} onChange={(e) => onChange(field.name, e.target.value)}/>
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

// An item that can be dragged by its handle. children(handle) draws the item with the handle
// inside; with a single item there is nothing to reorder, so no handle.
function SortableItem({ id, draggable, children }) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({ id })

  const handle = draggable && (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="drag-handle item-handle"
      title={texts.reorderItems.handle}
      aria-label={texts.reorderItems.handle}
      {...attributes}
      {...listeners}
    >
      <GripIcon/>
    </button>
  )

  return (
    <div
      ref={setNodeRef}
      className={isDragging ? 'sortable-item dragging' : 'sortable-item'}
      // Translate, not Transform: items have different heights and would be stretched
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      {children(handle)}
    </div>
  )
}

function ListSection({ sectionKey, fields, list, onChange }) {
  // Items added in this visit: only these grow in, so nothing animates on page load
  const [added, setAdded] = useState([])
  // Optional fields (the link) opened in this visit, as 'itemId:fieldName'
  const [openedOptional, setOpenedOptional] = useState([])
  const { isLeaving, leave, left } = useLeaving()
  const offerUndo = useUndo()
  const optionalKey = (item, field) => `${item.id}:${field.name}`
  const shows = (item, field) => !field.optional || Boolean(item[field.name])
    || openedOptional.includes(optionalKey(item, field))

  function add() {
    const item = emptyItem(fields)
    setAdded([...added, item.id])
    onChange([...list, item])
  }

  function remove(id) {
    const index = list.findIndex((item) => item.id === id)
    const item = list[index]
    leave(id, () => {
      onChange((current) => current.filter((other) => other.id !== id))
      // An empty item is not worth a notice
      if (Object.entries(item).some(([name, value]) => name !== 'id' && value)) {
        offerUndo(texts.undo.item, () => onChange((current) => insertAt(current, index, item)))
      }
    })
  }

  function change(id, name, value) {
    onChange(list.map((item) => (item.id === id ? { ...item, [name]: value } : item)))
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
            <SortableItem key={item.id} id={item.id} draggable={list.length > 1}>
              {(handle) => (
                <Animated
                  appear={added.includes(item.id)}
                  leaving={isLeaving(item.id)}
                  onLeft={() => left(item.id)}
                >
                  <div className={item.hidden ? 'item is-hidden' : 'item'}>
                    {handle}
                    {item.hidden && <p className="section-badge item-badge">{texts.visibility.hidden}</p>}
                    {groupPairs(fields.filter((field) => shows(item, field))).map((group) => {
                      const rendered = group.map((field) => {
                        const input = (
                          <Field
                            key={field.name}
                            sectionKey={sectionKey}
                            field={field}
                            item={item}
                            onChange={(name, value) => change(item.id, name, value)}
                            autoFocus={field.optional && openedOptional.includes(optionalKey(item, field))}
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
                              title={texts.common.remove}
                              aria-label={`${texts.common.remove}: ${labelFor(sectionKey, field.name)}`}
                              onClick={() => {
                                change(item.id, field.name, '')
                                setOpenedOptional(openedOptional.filter((key) => key !== optionalKey(item, field)))
                              }}
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
                      <button type="button" className="chip" onClick={() => remove(item.id)}>{texts.common.remove}</button>
                      {fields.filter((field) => !shows(item, field)).map((field) => (
                        <button type="button" className="chip" key={field.name}
                          onClick={() => setOpenedOptional([...openedOptional, optionalKey(item, field)])}>
                          <PlusIcon/>{labelFor(sectionKey, field.name)}
                        </button>
                      ))}
                      <button type="button" className="chip" aria-pressed={Boolean(item.hidden)}
                        onClick={() => change(item.id, 'hidden', !item.hidden)}>
                        <VisibilityIcon hidden={item.hidden}/>
                        {item.hidden ? texts.visibility.showItem : texts.visibility.hideItem}
                      </button>
                    </div>
                  </div>
                </Animated>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="chip" onClick={add}><PlusIcon/>{texts[sectionKey].add}</button>
    </>
  )
}

export default ListSection
