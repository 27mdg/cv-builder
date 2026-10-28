import { useRef } from 'react'
import texts from '../locales/es.js'
import { TrashIcon } from './Icons.jsx'

// <dialog> with showModal() centres itself, dims the page, traps the focus and closes with Esc
// without any extra code.
function ClearButton({ onClear }) {
  const dialog = useRef(null)

  function confirm() {
    onClear()
    dialog.current.close()
  }

  return (
    <>
      <span className="has-tooltip">
        <button
          type="button"
          className="secondary-button icon-button"
          aria-label={texts.clear.button}
          aria-describedby="clear-tooltip"
          onClick={() => dialog.current.showModal()}
        >
          <TrashIcon/>
        </button>
        <span className="tooltip" id="clear-tooltip" role="tooltip">{texts.clear.tooltip}</span>
      </span>

      <dialog
        ref={dialog}
        className="confirm-dialog"
        aria-labelledby="clear-title"
        // A click on the dimmed area outside the box lands on the <dialog> itself
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
      >
        <h2 id="clear-title">{texts.clear.title}</h2>
        <p>{texts.clear.message}</p>
        <div className="confirm-actions">
          <button type="button" className="cancel-button" onClick={() => dialog.current.close()} autoFocus>
            {texts.clear.cancel}
          </button>
          <button type="button" className="danger-button" onClick={confirm}>
            {texts.clear.confirm}
          </button>
        </div>
      </dialog>
    </>
  )
}

export default ClearButton
