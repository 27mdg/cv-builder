import { useRef, useState } from 'react'
import texts from '../locales/es.js'
import initialCv from '../data/initialCv.js'
import { readFile } from '../data/file.js'
import Tooltip from './Tooltip.jsx'

// Having chosen a template or a design does not count as data that could be lost
function hasData(cv) {
  const onlyContent = { ...cv, template: initialCv.template, design: initialCv.design }
  return JSON.stringify(onlyContent) !== JSON.stringify(initialCv)
}

function ImportButton({ currentCv, onImport }) {
  const picker = useRef(null)
  const [error, setError] = useState('')

  async function handleChange(e) {
    const file = e.target.files[0]
    // Reset the picker so the same file can be chosen again
    e.target.value = ''
    if (!file) return
    setError('')
    try {
      const cv = await readFile(file)
      if (hasData(currentCv) && !window.confirm(texts.file.confirmImport)) return
      onImport(cv)
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
          className="secondary-button"
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
