import { useState } from 'react'
import texts from '../../locales/es.js'
import PhotoField from './PhotoField.jsx'
import DatePicker from './DatePicker.jsx'
import { CloseIcon, PlusIcon } from '../Icons.jsx'
import Animated from '../Animated.jsx'
import { useLeaving } from '../useLeaving.js'

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
  // Custom fields added in this visit: they grow in, and the last one gets the cursor
  const [addedCustom, setAddedCustom] = useState([])
  const { isLeaving, leave, left } = useLeaving()

  const visible = extraFields.filter((f) => data[f.name] !== '' || opened.includes(f.name))
  const hidden = extraFields.filter((f) => !visible.includes(f))

  function removeExtra(name) {
    leave(name, () => {
      onChange(name, '')
      setOpened((names) => names.filter((n) => n !== name))
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

  function removeCustom(id) {
    leave(id, () => onChange('customFields', (current) => current.filter((f) => f.id !== id)))
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
            <Field field={field} data={data} onChange={onChange} autoFocus={opened.includes(field.name)}>
              <RemoveButton onClick={() => removeExtra(field.name)}/>
            </Field>
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
              <RemoveButton onClick={() => removeCustom(f.id)}/>
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
        <button type="button" className="chip" onClick={addCustom}>
          <PlusIcon/>{texts.customFields.button}
        </button>
      </div>
    </>
  )
}

export default PersonalDetails
