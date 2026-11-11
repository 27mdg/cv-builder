import texts from '../locales/index.js'
import { dateFormats } from '../data/design.js'
import { formatDate } from '../templates/format.js'
import Segmented from './Segmented.jsx'

// The examples use this month, so the user sees a real date in each format
const today = new Date()
const example = { month: String(today.getMonth() + 1), year: String(today.getFullYear()) }

// It stays open after a choice, so the formats can be tried one after another on the preview
function DateMenu({ design, onChange }) {
  return (
    <div className="design-menu date-menu">
      <p className="menu-subtitle">{texts.tools.dateFormat}</p>
      <Segmented
        label={texts.tools.dateFormat}
        options={dateFormats.map((format) => ({ value: format, label: formatDate(example, format) }))}
        value={design.dateFormat}
        onChange={(format) => onChange('dateFormat', format)}
      />
    </div>
  )
}

export default DateMenu
