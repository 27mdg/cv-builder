import texts from '../../locales/es.js'
import Select from './Select.jsx'

// Includes future years for studies that have not finished yet
const currentYear = new Date().getFullYear()
const years = []
for (let year = currentYear + 6; year >= 1950; year--) {
  years.push(String(year))
}

function DateField({ label, value, onChange, hideDate, children }) {
  return (
    <div className="date-field">
      <span>{label}</span>
      {!hideDate && (
        <>
          <Select
            aria-label={texts.common.month}
            value={value.month}
            onChange={(e) => onChange({ ...value, month: e.target.value })}
          >
            <option value="">{texts.common.month}</option>
            {texts.common.months.map((name, i) => (
              <option key={name} value={String(i + 1)}>{name}</option>
            ))}
          </Select>
          <Select
            aria-label={texts.common.year}
            value={value.year}
            onChange={(e) => onChange({ ...value, year: e.target.value })}
          >
            <option value="">{texts.common.year}</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </>
      )}
      {children}
    </div>
  )
}

export default DateField
