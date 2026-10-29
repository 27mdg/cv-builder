import { useState } from 'react'
import texts from '../../locales/es.js'
import PhotoField from './PhotoField.jsx'
import DatePicker from './DatePicker.jsx'
import Select from './Select.jsx'
import LicenseField from './LicenseField.jsx'
import { CloseIcon, PlusIcon } from '../Icons.jsx'
import Animated from '../Animated.jsx'
import { useLeaving } from '../useLeaving.js'
import { insertAt, useUndo } from '../undo.js'

// `fullWidth`: spans both columns of the grid
const fields = [
  { name: 'email', type: 'email' },
  { name: 'phone', type: 'tel' },
  { name: 'address', type: 'text', fullWidth: true },
  { name: 'postalCode', type: 'text' },
  { name: 'city', type: 'text' },
  { name: 'birthDate', type: 'date', fullWidth: true },
]

// Rarely used: hidden behind a "+" button so the form stays short
const extraFields = [
  { name: 'birthPlace', type: 'text' },
  { name: 'drivingLicense', type: 'text' },
  { name: 'gender', type: 'text' },
  { name: 'nationality', type: 'text' },
  { name: 'maritalStatus', type: 'text' },
  { name: 'availability', type: 'text' },
  { name: 'ownVehicle', type: 'text' },
  { name: 'workPermit', type: 'text' },
  { name: 'idNumber', type: 'text' },
  { name: 'travel', type: 'text' },
]

function Field({ field, data, onChange, autoFocus, children }) {
  return (
    <div className={field.fullWidth ? 'field field-full' : 'field'}>
      <label>
        {texts.personal[field.name]}
        <input
          type={field.type}
          value={data[field.name]}
          autoFocus={autoFocus}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </label>
      {children}
    </div>
  )
}

function RemoveButton({ onClick }) {
  return (
    <button type="button" className="field-remove" title={texts.common.remove}
      aria-label={texts.common.remove} onClick={onClick}>
      <CloseIcon/>
    </button>
  )
}

function PersonalDetails({ data, onChange }) {
  // Only the opened and still empty ones: those with content are always shown (see `visible`),
  // so this does not need to be saved in the CV
  const [opened, setOpened] = useState([])
  // Custom fields added in this visit: they grow in, and the last one gets the cursor
  const [addedCustom, setAddedCustom] = useState([])
  const { isLeaving, leave, left } = useLeaving()
  const offerUndo = useUndo()

  const visible = extraFields.filter((f) => data[f.name] !== '' || opened.includes(f.name))
  const hidden = extraFields.filter((f) => !visible.includes(f))

  function removeExtra(name) {
    const value = data[name]
    leave(name, () => {
      onChange(name, '')
      setOpened((names) => names.filter((n) => n !== name))
      if (value) offerUndo(texts.undo.field, () => onChange(name, value))
    })
  }

  // Removes a custom field or a link, offering to put it back if it had something written
  function removeRow(listName, id, message) {
    const index = data[listName].findIndex((row) => row.id === id)
    const row = data[listName][index]
    leave(id, () => {
      onChange(listName, (current) => current.filter((other) => other.id !== id))
      if (row.label || row.value || row.url) {
        offerUndo(message, () => onChange(listName, (current) => insertAt(current, index, row)))
      }
    })
  }

  function addCustom() {
    const field = { id: crypto.randomUUID(), label: '', value: '' }
    setAddedCustom([...addedCustom, field.id])
    onChange('customFields', [...data.customFields, field])
  }

  function changeCustom(id, key, value) {
    onChange('customFields', data.customFields.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  }


  // Links (LinkedIn, GitHub, a portfolio…), as many as the user wants; same pattern as custom fields
  const [addedLinks, setAddedLinks] = useState([])

  function addLink() {
    // LinkedIn first, as most people have it; then a website
    const type = data.links.some((link) => link.type === 'linkedin') ? 'portfolio' : 'linkedin'
    const link = { id: crypto.randomUUID(), type, url: '' }
    setAddedLinks([...addedLinks, link.id])
    onChange('links', [...data.links, link])
  }

  function changeLink(id, key, value) {
    onChange('links', data.links.map((link) => (link.id === id ? { ...link, [key]: value } : link)))
  }


  return (
    <>
      <div className="personal-header">
        <PhotoField
          value={data.photo}
          onChange={(photo) => {
            if (!photo && data.photo) {
              const removed = data.photo
              offerUndo(texts.undo.photo, () => onChange('photo', removed))
            }
            onChange('photo', photo)
          }}
        />
        <div className="grid">
          <Field field={{ name: 'firstName', type: 'text' }} data={data} onChange={onChange}/>
          <Field field={{ name: 'lastName', type: 'text' }} data={data} onChange={onChange}/>
          <Field field={{ name: 'jobTitle', type: 'text', fullWidth: true }} data={data} onChange={onChange}/>
        </div>
      </div>

      <div className="grid">
        {fields.map((field) => (field.type === 'date'
          ? (
            <DatePicker key={field.name} label={texts.personal[field.name]} value={data[field.name]}
              onChange={(value) => onChange(field.name, value)}/>
          )
          : <Field key={field.name} field={field} data={data} onChange={onChange}/>
        ))}
        {visible.map((field) => (
          <Animated
            key={field.name}
            appear={opened.includes(field.name)}
            leaving={isLeaving(field.name)}
            onLeft={() => left(field.name)}
          >
            {field.name === 'drivingLicense'
              ? (
                <LicenseField value={data.drivingLicense} onChange={(value) => onChange('drivingLicense', value)}>
                  <RemoveButton onClick={() => removeExtra(field.name)}/>
                </LicenseField>
              )
              : (
                <Field field={field} data={data} onChange={onChange} autoFocus={opened.includes(field.name)}>
                  <RemoveButton onClick={() => removeExtra(field.name)}/>
                </Field>
              )}
          </Animated>
        ))}
        {data.links.map((link) => (
          <Animated
            key={link.id}
            className="field-full"
            appear={addedLinks.includes(link.id)}
            leaving={isLeaving(link.id)}
            onLeft={() => left(link.id)}
          >
            <div className="field link-field">
              <Select aria-label={texts.links.type} value={link.type} onChange={(e) => changeLink(link.id, 'type', e.target.value)}>
                {Object.entries(texts.links.types).map(([type, name]) => <option key={type} value={type}>{name}</option>)}
              </Select>
              <input
                aria-label={`${texts.links.types[link.type] ?? ''} ${texts.links.url}`}
                placeholder={texts.links.placeholder}
                value={link.url}
                autoFocus={link.id === addedLinks.at(-1)}
                onChange={(e) => changeLink(link.id, 'url', e.target.value)}
              />
              <RemoveButton onClick={() => removeRow('links', link.id, texts.undo.link)}/>
            </div>
          </Animated>
        ))}
        {data.customFields.map((f) => (
          <Animated
            key={f.id}
            className="field-full"
            appear={addedCustom.includes(f.id)}
            leaving={isLeaving(f.id)}
            onLeft={() => left(f.id)}
          >
            <div className="field custom-field">
              <input
                aria-label={texts.customFields.label}
                placeholder={texts.customFields.label}
                value={f.label}
                autoFocus={f.id === addedCustom.at(-1)}
                onChange={(e) => changeCustom(f.id, 'label', e.target.value)}
              />
              <input
                aria-label={texts.customFields.value}
                placeholder={texts.customFields.value}
                value={f.value}
                onChange={(e) => changeCustom(f.id, 'value', e.target.value)}
              />
              <RemoveButton onClick={() => removeRow('customFields', f.id, texts.undo.field)}/>
            </div>
          </Animated>
        ))}
      </div>

      <div className="chips">
        {hidden.map((field) => (
          <button type="button" className="chip" key={field.name}
            onClick={() => setOpened([...opened, field.name])}>
            <PlusIcon/>{texts.personal[field.name]}
          </button>
        ))}
        <button type="button" className="chip" onClick={addLink}>
          <PlusIcon/>{texts.links.button}
        </button>
        <button type="button" className="chip" onClick={addCustom}>
          <PlusIcon/>{texts.customFields.button}
        </button>
      </div>
    </>
  )
}

export default PersonalDetails
