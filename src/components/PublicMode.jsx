import { useLayoutEffect, useRef, useState } from 'react'
import texts from '../locales/es.js'
import { ComputerIcon } from './Icons.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import Tooltip from './Tooltip.jsx'
import { prefersReducedMotion } from './useLeaving.js'

const t = texts.publicMode

/**
 * Top bar button that turns public computer mode on. It shrinks away when `leaving` (then
 * onLeft) and grows back when `appear`.
 */
export function PublicModeButton({ appear, leaving, onLeft, onTurnOn }) {
  const [appearing, setAppearing] = useState(() => Boolean(appear) && !prefersReducedMotion())
  // The glare on its screen: started by the mouse, ended by the animation itself, so it is
  // never cut short when the mouse leaves
  const [glaring, setGlaring] = useState(false)

  function handleAnimationEnd(e) {
    if (e.target !== e.currentTarget) return
    if (leaving) onLeft()
    else setAppearing(false)
  }

  const classes = ['public-button-slot', appearing && 'appearing', leaving && 'leaving'].filter(Boolean)
  return (
    <span className={classes.join(' ')} inert={leaving} onAnimationEnd={handleAnimationEnd}>
      <Tooltip id="public-tooltip" text={t.tooltip}>
        <button
          type="button"
          className={glaring ? 'secondary-button icon-button glaring' : 'secondary-button icon-button'}
          aria-label={t.button}
          aria-describedby="public-tooltip"
          onClick={onTurnOn}
          onMouseEnter={() => setGlaring(!prefersReducedMotion())}
          onAnimationEnd={(e) => e.animationName === 'glare' && setGlaring(false)}
        >
          <ComputerIcon/>
        </button>
      </Tooltip>
    </span>
  )
}

/**
 * Strip under the top bar while the mode is on, so the user never forgets to finish. It comes
 * out from under the top bar when `appear` and goes back when `leaving` (then onLeft).
 */
export function PublicModeBar({ appear, leaving, onLeft, onFinish, onTurnOff }) {
  const [confirming, setConfirming] = useState(false)
  const [appearing, setAppearing] = useState(() => Boolean(appear) && !prefersReducedMotion())
  const bar = useRef(null)

  // The animations pull the strip up by its own height (CSS margin, so the form follows it with
  // no gap). Measured, as it wraps onto more lines on narrow screens.
  useLayoutEffect(() => {
    bar.current.style.setProperty('--bar-height', `${bar.current.offsetHeight}px`)
  }, [appearing, leaving])

  function handleAnimationEnd(e) {
    if (e.target !== e.currentTarget) return
    if (leaving) onLeft()
    else setAppearing(false)
  }

  const classes = ['public-bar', appearing && 'appearing', leaving && 'leaving'].filter(Boolean)
  return (
    <div className="public-slot">
      <div ref={bar} className={classes.join(' ')} role="status" inert={leaving} onAnimationEnd={handleAnimationEnd}>
        <ComputerIcon/>
        <span>{t.notice}</span>
        <button type="button" className="public-finish" onClick={() => setConfirming(true)}>{t.finish}</button>
        <button type="button" className="public-off" onClick={onTurnOff}>{t.turnOff}</button>
        <ConfirmDialog
          open={confirming}
          title={t.confirmTitle}
          message={t.confirmMessage}
          cancelLabel={t.cancel}
          confirmLabel={t.confirm}
          onConfirm={() => {
            onFinish()
            setConfirming(false)
          }}
          onCancel={() => setConfirming(false)}
        />
      </div>
    </div>
  )
}
