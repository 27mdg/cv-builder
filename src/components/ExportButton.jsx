import texts from '../locales/es.js'
import { exportCv } from '../data/file.js'
import Tooltip from './Tooltip.jsx'

function ExportButton({ cv }) {
  return (
    <Tooltip id="export-tooltip" text={texts.file.exportTooltip}>
      <button
        type="button"
        className="secondary-button"
        aria-describedby="export-tooltip"
        onClick={() => exportCv(cv)}
      >
        {texts.file.export}
      </button>
    </Tooltip>
  )
}

export default ExportButton
