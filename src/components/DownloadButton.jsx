import { useState } from 'react'
import texts from '../locales/es.js'
import Tooltip from './Tooltip.jsx'

function DownloadButton({ cv }) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(false)

  async function download() {
    setGenerating(true)
    setError(false)
    try {
      // import(): the PDF library is heavy and only loads on click
      const { downloadPdf } = await import('../templates/download.jsx')
      await downloadPdf(cv)
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
        <button type="button" aria-describedby="download-tooltip" onClick={download} disabled={generating}>
          {generating ? texts.download.generating : texts.download.button}
        </button>
      </Tooltip>
    </div>
  )
}

export default DownloadButton
