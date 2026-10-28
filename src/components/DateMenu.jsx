import texts from '../locales/es.js'
import { dateFormats } from '../data/design.js'
import { formatDate } from '../templates/format.js'

// The examples use this month, so the user sees a real date in each format
const today = new Date()
const example = { month: String(today.getMonth() + 1), year: String(today.getFullYear()) }

function DateMenu({ design, onChange, onClose }) {
  return (
    <div className="design-menu">
      <p className="menu-subtitle">{texts.tools.dateFormat}</p>
      <div className="option-list">
        {dateFormats.map((format) => (
          <button
            key={format}
            type="button"
            className={format === design.dateFormat ? 'selected' : ''}
            aria-pressed={format === design.dateFormat}
            onClick={() => {
              onChange('dateFormat', format)
              onClose()
            }}
          >
            {formatDate(example, format)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateMenu
