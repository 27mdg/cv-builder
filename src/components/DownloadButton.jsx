import { useRef, useState } from 'react'
import texts from '../locales/es.js'
import { keepSaved } from '../data/storage.js'
import { exportCv } from '../data/file.js'
import Tooltip from './Tooltip.jsx'
import { CloseIcon, DownloadIcon } from './Icons.jsx'

// publicMode: nothing is kept in this browser, so there is nothing to protect or remind about
function DownloadButton({ cv, publicMode }) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(false)
  const [reminder, setReminder] = useState(false)
  // Once per visit: after that it would only get in the way
  const reminded = useRef(false)

  async function download() {
    setGenerating(true)
    setError(false)
    try {
      // import(): the PDF library is heavy and only loads on click
      const { downloadPdf } = await import('../templates/download.jsx')
      await downloadPdf(cv)
      if (!publicMode) keepSaved()
      if (!publicMode && !reminded.current) {
        reminded.current = true
        setReminder(true)
      }
    } catch (e) {
      console.error(e)
      setError(true)
    }
    setGenerating(false)
  }

  return (
    <div className="download">
      {error && <span className="download-error">{texts.download.error}</span>}
      <Tooltip id="download-tooltip" text={texts.download.tooltip} alignRight>
        <button type="button" className="download-button" aria-describedby="download-tooltip" onClick={download} disabled={generating}>
          {!generating && <DownloadIcon/>}
          {generating ? texts.download.generating : texts.download.button}
        </button>
      </Tooltip>
      {reminder && (
        <div className="save-reminder" role="status">
          <p>{texts.download.reminder}</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              exportCv(cv)
              setReminder(false)
            }}
          >
            {texts.download.reminderExport}
          </button>
          <button
            type="button"
            className="save-reminder-close"
            aria-label={texts.download.reminderClose}
            title={texts.download.reminderClose}
            onClick={() => setReminder(false)}
          >
            <CloseIcon/>
          </button>
        </div>
      )}
    </div>
  )
}

export default DownloadButton
