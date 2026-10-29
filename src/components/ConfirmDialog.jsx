import { useEffect, useId, useRef } from 'react'

// Centred confirmation box for actions that delete data. <dialog> with showModal() dims the
// page, traps the focus and closes with Esc without extra code.
function ConfirmDialog({ open, title, message, cancelLabel, confirmLabel, onConfirm, onCancel }) {
  const dialog = useRef(null)
  // Several dialogs can be on the page at once, each needs its own id
  const titleId = useId()

  useEffect(() => {
    const box = dialog.current
    if (open && !box.open) box.showModal()
    if (!open && box.open) box.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      aria-labelledby={titleId}
      // Esc closes the dialog by itself; this keeps the parent's state in step
      onClose={onCancel}
      // A click on the dimmed area outside the box lands on the <dialog> itself
      onClick={(e) => e.target === dialog.current && onCancel()}
    >
      <h2 id={titleId}>{title}</h2>
      <p>{message}</p>
      <div className="confirm-actions">
        {/* Focused first, so a stray Enter does not delete anything */}
        <button type="button" className="cancel-button" onClick={onCancel} autoFocus>{cancelLabel}</button>
        <button type="button" className="danger-button" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
