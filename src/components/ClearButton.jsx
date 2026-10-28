import { useState } from 'react'
import texts from '../locales/es.js'
import { TrashIcon } from './Icons.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import Tooltip from './Tooltip.jsx'

function ClearButton({ onClear }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <Tooltip id="clear-tooltip" text={texts.clear.tooltip}>
        <button
          type="button"
          className="secondary-button icon-button"
          aria-label={texts.clear.button}
          aria-describedby="clear-tooltip"
          onClick={() => setConfirming(true)}
        >
          <TrashIcon/>
        </button>
      </Tooltip>

      <ConfirmDialog
        open={confirming}
        title={texts.clear.title}
        message={texts.clear.message}
        cancelLabel={texts.clear.cancel}
        confirmLabel={texts.clear.confirm}
        onConfirm={() => {
          onClear()
          setConfirming(false)
        }}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}

export default ClearButton
