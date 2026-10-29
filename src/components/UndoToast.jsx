import { useEffect, useState } from 'react'
import texts from '../locales/es.js'
import { CloseIcon } from './Icons.jsx'

// Long enough to read it and react, short enough not to stay in the way
const duration = 8000

// `undo`: { id, message, restore } or null. The timer stops while the mouse or the keyboard
// is on the notice, so it never disappears under the user's pointer.
function UndoToast({ undo, onUndo, onClose }) {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!undo || paused) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [undo, paused, onClose])

  if (!undo) return null
  return (
    <div
      key={undo.id}
      className="undo-toast"
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span>{undo.message}</span>
      <button type="button" className="undo-button" onClick={onUndo}>{texts.undo.button}</button>
      <button type="button" className="undo-close" aria-label={texts.undo.close} title={texts.undo.close} onClick={onClose}>
        <CloseIcon/>
      </button>
    </div>
  )
}

export default UndoToast
