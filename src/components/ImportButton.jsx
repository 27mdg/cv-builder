import { useRef, useState } from 'react'
import texts from '../locales/index.js'
import { readFile } from '../data/file.js'
import Tooltip from './Tooltip.jsx'

// The file's CV is added as a new one (onImport): nothing is overwritten, so nothing to confirm
function ImportButton({ onImport }) {
  const picker = useRef(null)
  const [error, setError] = useState('')

  async function handleChange(e) {
    const file = e.target.files[0]
    // Reset the picker so the same file can be chosen again
    e.target.value = ''
    if (!file) return
    setError('')
    try {
      onImport(await readFile(file))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="import">
      {error && <span className="error-message">{error}</span>}
      <Tooltip id="import-tooltip" text={texts.file.importTooltip}>
        <button
          type="button"
          className="btn btn-ghost"
          aria-describedby="import-tooltip"
          onClick={() => picker.current.click()}
        >
          {texts.file.import}
        </button>
      </Tooltip>
      <input ref={picker} type="file" accept=".json,application/json" hidden onChange={handleChange}/>
    </div>
  )
}

export default ImportButton
