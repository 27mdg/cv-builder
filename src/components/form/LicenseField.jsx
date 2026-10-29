import texts from '../../locales/es.js'

// The Spanish (and EU) driving licence categories, in their usual order
const categories = ['AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE']

// Stored as text ('A2, B'), like before: older CVs with a typed licence keep working, and
// anything typed that is not a category is kept at the end
function parse(value) {
  return value.split(',').map((part) => part.trim()).filter(Boolean)
}

/** Driving licence as buttons, one per category, that the user switches on and off. */
function LicenseField({ value, onChange, children }) {
  const chosen = parse(value)

  function toggle(category) {
    const next = chosen.includes(category) ? chosen.filter((c) => c !== category) : [...chosen, category]
    const known = categories.filter((c) => next.includes(c))
    const other = next.filter((c) => !categories.includes(c))
    onChange([...known, ...other].join(', '))
  }

  return (
    <div className="field field-full">
      <span className="label">{texts.personal.drivingLicense}</span>
      <div className="license-options" role="group" aria-label={texts.personal.drivingLicense}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="license-option"
            aria-pressed={chosen.includes(category)}
            onClick={() => toggle(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}

export default LicenseField
