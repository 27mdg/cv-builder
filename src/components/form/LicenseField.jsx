import { useState } from 'react'
import texts from '../../locales/es.js'
import { CloseIcon } from '../Icons.jsx'

const t = texts.licence
// Suggestions only (the EU categories): anything else can be typed, for other countries
const categories = ['AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE']

// Stored as text ('A2, B'), like before: older CVs with a typed licence keep working
function parse(value) {
  return value.split(',').map((part) => part.trim()).filter(Boolean)
}

/** Driving licence as small tags: picked from the usual categories or typed. */
function LicenseField({ value, onChange, children }) {
  const tags = parse(value)
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const suggestions = categories.filter((c) => !tags.includes(c) && c.startsWith(draft.trim().toUpperCase()))

  function save(next) {
    onChange(next.join(', '))
  }

  function add(tag) {
    const clean = tag.trim()
    if (clean && !tags.includes(clean)) save([...tags, clean])
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && draft === '' && tags.length) {
      save(tags.slice(0, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="field">
      <label>
        {texts.personal.drivingLicense}
        <span className="tags-input">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button type="button" aria-label={t.remove(tag)} onClick={() => save(tags.filter((other) => other !== tag))}>
                <CloseIcon/>
              </button>
            </span>
          ))}
          <input
            value={draft}
            placeholder={tags.length ? '' : t.placeholder}
            onChange={(e) => setDraft(e.target.value.replace(',', ''))}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            // What was typed is kept as a tag when leaving the field, so it is not lost
            onBlur={() => {
              add(draft)
              setOpen(false)
            }}
          />
        </span>
      </label>
      {open && suggestions.length > 0 && (
        <div className="tags-suggestions" role="group" aria-label={t.suggestions}>
          <span className="tags-suggestions-title">{t.suggestions}</span>
          {suggestions.map((category) => (
            // onMouseDown + preventDefault: picking one must not take the cursor out of the field
            <button key={category} type="button" className="tag-suggestion"
              onMouseDown={(e) => e.preventDefault()} onClick={() => add(category)}>
              {category}
            </button>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

export default LicenseField
