import { useState } from 'react'
import texts from '../../locales/es.js'
import PhotoField from './PhotoField.jsx'
import { CloseIcon, PlusIcon } from '../Icons.jsx'

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
  { name: 'website', type: 'text' },
  { name: 'linkedin', type: 'text' },
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
  // To put the cursor in the custom field that was just added
  const [newCustomId, setNewCustomId] = useState(null)

  const visible = extraFields.filter((f) => data[f.name] !== '' || opened.includes(f.name))
  const hidden = extraFields.filter((f) => !visible.includes(f))

  function removeExtra(name) {
    onChange(name, '')
    setOpened(opened.filter((n) => n !== name))
  }

  function addCustom() {
    const field = { id: crypto.randomUUID(), label: '', value: '' }
    setNewCustomId(field.id)
    onChange('customFields', [...data.customFields, field])
  }

  function changeCustom(id, key, value) {
    onChange('customFields', data.customFields.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  }

  function removeCustom(id) {
    onChange('customFields', data.customFields.filter((f) => f.id !== id))
  }

  return (
    <>
      <div className="personal-header">
        <PhotoField value={data.photo} onChange={(photo) => onChange('photo', photo)}/>
        <div className="grid">
          <Field field={{ name: 'firstName', type: 'text' }} data={data} onChange={onChange}/>
          <Field field={{ name: 'lastName', type: 'text' }} data={data} onChange={onChange}/>
          <Field field={{ name: 'jobTitle', type: 'text', fullWidth: true }} data={data} onChange={onChange}/>
        </div>
      </div>

      <div className="grid">
        {fields.map((field) => (
          <Field key={field.name} field={field} data={data} onChange={onChange}/>
        ))}
        {visible.map((field) => (
          <Field key={field.name} field={field} data={data} onChange={onChange}
            autoFocus={opened.includes(field.name)}>
            <RemoveButton onClick={() => removeExtra(field.name)}/>
          </Field>
        ))}
        {data.customFields.map((f) => (
          <div className="field field-full custom-field" key={f.id}>
            <input
              aria-label={texts.customFields.label}
              placeholder={texts.customFields.label}
              value={f.label}
              autoFocus={f.id === newCustomId}
              onChange={(e) => changeCustom(f.id, 'label', e.target.value)}
            />
            <input
              aria-label={texts.customFields.value}
              placeholder={texts.customFields.value}
              value={f.value}
              onChange={(e) => changeCustom(f.id, 'value', e.target.value)}
            />
            <RemoveButton onClick={() => removeCustom(f.id)}/>
          </div>
        ))}
      </div>

      <div className="chips">
        {hidden.map((field) => (
          <button type="button" className="chip" key={field.name}
            onClick={() => setOpened([...opened, field.name])}>
            <PlusIcon/>{texts.personal[field.name]}
          </button>
        ))}
        <button type="button" className="chip" onClick={addCustom}>
          <PlusIcon/>{texts.customFields.button}
        </button>
      </div>
    </>
  )
}

export default PersonalDetails
