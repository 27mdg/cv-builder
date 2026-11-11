import { useRef, useState } from 'react'
import texts from '../locales/index.js'
import { keepSaved } from '../data/storage.js'
import { exportCv } from '../data/file.js'
import Tooltip from './Tooltip.jsx'
import { CloseIcon, DownloadIcon } from './Icons.jsx'

// publicMode: nothing is kept in this browser, so there is nothing to protect or remind about.
// storageFull: saving failed for lack of space; the same bubble asks for a copy (once).
function DownloadButton({ cv, publicMode, storageFull }) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(false)
  const [reminder, setReminder] = useState(false)
  const [fullClosed, setFullClosed] = useState(false)
  const full = storageFull && !fullClosed
  function closeBubble() {
    if (full) setFullClosed(true)
    else setReminder(false)
  }
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
        <button type="button" className="btn btn-primary download-button" aria-describedby="download-tooltip" onClick={download} disabled={generating}>
          {!generating && <DownloadIcon/>}
          {generating ? texts.download.generating : texts.download.button}
        </button>
      </Tooltip>
      {(reminder || full) && (
        <div className="save-reminder frost" role={full ? 'alert' : 'status'}>
          <p>{full ? texts.storage.full : texts.download.reminder}</p>
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => {
              exportCv(cv)
              closeBubble()
            }}
          >
            {texts.download.reminderExport}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-small save-reminder-close"
            aria-label={texts.download.reminderClose}
            data-hint={texts.download.reminderClose}
            onClick={closeBubble}
          >
            <CloseIcon/>
          </button>
        </div>
      )}
    </div>
  )
}

export default DownloadButton
