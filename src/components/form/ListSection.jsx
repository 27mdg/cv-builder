import { useState } from 'react'
import texts from '../../locales/es.js'
import Animated from '../Animated.jsx'
import { useLeaving } from '../useLeaving.js'
import DateField from './DateField.jsx'
import Select from './Select.jsx'
import { EyeIcon, EyeOffIcon, PlusIcon } from '../Icons.jsx'

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

function Field({ sectionKey, field, item, onChange }) {
  const label = labelFor(sectionKey, field.name)
  const value = item[field.name]

  if (field.type === 'longText') {
    return (
      <label>
        {label}
        <textarea rows={4} value={value} onChange={(e) => onChange(field.name, e.target.value)}/>
      </label>
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
        <label className="current">
          <input
            type="checkbox"
            checked={item.current}
            onChange={(e) => onChange('current', e.target.checked)}
          />
          {texts.common.current}
        </label>
      </DateField>
    )
  }
  if (field.type === 'skillLevel' || field.type === 'languageLevel') {
    const options = field.type === 'skillLevel' ? texts.common.skillLevels : texts.common.languageLevels
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
      <input value={value} onChange={(e) => onChange(field.name, e.target.value)}/>
    </label>
  )
}

function ListSection({ sectionKey, fields, list, onChange }) {
  // Items added in this visit: only these grow in, so nothing animates on page load
  const [added, setAdded] = useState([])
  const { isLeaving, leave, left } = useLeaving()

  function add() {
    const item = emptyItem(fields)
    setAdded([...added, item.id])
    onChange([...list, item])
  }

  function remove(id) {
    leave(id, () => onChange((current) => current.filter((item) => item.id !== id)))
  }

  function change(id, name, value) {
    onChange(list.map((item) => (item.id === id ? { ...item, [name]: value } : item)))
  }

  return (
    <>
      {list.map((item) => (
        <Animated
          key={item.id}
          appear={added.includes(item.id)}
          leaving={isLeaving(item.id)}
          onLeft={() => left(item.id)}
        >
          <div className={item.hidden ? 'item is-hidden' : 'item'}>
            {item.hidden && <p className="section-badge item-badge">{texts.visibility.hidden}</p>}
            {fields.map((field) => (
              <Field
                key={field.name}
                sectionKey={sectionKey}
                field={field}
                item={item}
                onChange={(name, value) => change(item.id, name, value)}
              />
            ))}
            <div className="item-actions">
              <button type="button" className="chip" onClick={() => remove(item.id)}>{texts.common.remove}</button>
              <button type="button" className="chip" aria-pressed={Boolean(item.hidden)}
                onClick={() => change(item.id, 'hidden', !item.hidden)}>
                {item.hidden ? <EyeOffIcon/> : <EyeIcon/>}
                {item.hidden ? texts.visibility.showItem : texts.visibility.hideItem}
              </button>
            </div>
          </div>
        </Animated>
      ))}
      <button type="button" className="chip" onClick={add}><PlusIcon/>{texts[sectionKey].add}</button>
    </>
  )
}

export default ListSection
