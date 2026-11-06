import { useEffect, useState } from 'react'
import texts from '../locales/es.js'
import { ArrowIcon, CloseIcon, UndoIcon } from './Icons.jsx'

// Long enough to read it and react, short enough not to stay in the way
const duration = 8000

// `undos`: the removals that can still be undone, oldest first; `shown`: the one on screen.
// With several, ‹ › go through them so any one can be brought back, not only the last.
function UndoToast({ undos, shown, onShow, onUndo, onClose }) {
  if (!undos.length) return null
  return <Notice undos={undos} shown={shown} onShow={onShow} onUndo={onUndo} onClose={onClose}/>
}

// Its own component so "paused" starts again with each new notice: otherwise a notice closed
// with the pointer still on it would leave the next one paused forever
function Notice({ undos, shown, onShow, onUndo, onClose }) {
  const [paused, setPaused] = useState(false)

  // Counted again after every removal or page change
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [undos, shown, paused, onClose])

  const undo = undos[shown]
  return (
    <div
      // Rises again when a new removal arrives, not when going through the pages
      key={undos[undos.length - 1].id}
      className="undo-toast frost toast"
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="toast-icon"><UndoIcon/></span>
      <span>{undo.message}</span>
      {undos.length > 1 && (
        <span className="undo-pages">
          <button type="button" className="btn btn-ghost btn-icon btn-small undo-page previous"
            aria-label={texts.undo.previous} data-hint={texts.undo.previous}
            disabled={shown === 0} onClick={() => onShow(shown - 1)}>
            <ArrowIcon/>
          </button>
          <span className="undo-count">{texts.undo.page(shown + 1, undos.length)}</span>
          <button type="button" className="btn btn-ghost btn-icon btn-small undo-page next"
            aria-label={texts.undo.next} data-hint={texts.undo.next}
            disabled={shown === undos.length - 1} onClick={() => onShow(shown + 1)}>
            <ArrowIcon/>
          </button>
        </span>
      )}
      <button type="button" className="btn btn-ghost btn-small undo-button" onClick={onUndo}>{texts.undo.button}</button>
      <button type="button" className="btn btn-ghost btn-icon btn-small" aria-label={texts.undo.close} data-hint={texts.undo.close} onClick={onClose}>
        <CloseIcon/>
      </button>
    </div>
  )
}

export default UndoToast
