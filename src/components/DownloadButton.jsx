import { useState } from 'react'
import texts from '../locales/es.js'

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
      <button type="button" onClick={download} disabled={generating}>
        {generating ? texts.download.generating : texts.download.button}
      </button>
    </div>
  )
}

export default DownloadButton
