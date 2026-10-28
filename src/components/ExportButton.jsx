import texts from '../locales/es.js'
import { exportCv } from '../data/file.js'

function ExportButton({ cv }) {
  return (
    <button type="button" className="secondary-button" onClick={() => exportCv(cv)}>
      {texts.file.export}
    </button>
  )
}

export default ExportButton
