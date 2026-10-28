import { useLayoutEffect, useRef, useState } from 'react'
import texts from '../locales/es.js'
import { ResizeIcon } from './Icons.jsx'

// Separate from the CV: it is a screen preference, so it is neither exported nor cleared
const storageKey = 'cv-gratis-split'
// Neither side may get narrower than the larger of these: the % on big screens, the px on small ones
const minShare = 25
const minWidth = 360
// In px: this close to the middle, the bar sticks to it
const snapDistance = 24
// In %, for the arrow keys. A divisor of 50, so the keys can land back on the middle.
const keyStep = 5
// In px: half the knob's height (App.css) plus a small gap, so it stops before the lane's ends
const knobHalfHeight = 30

function loadShare() {
  try {
    const saved = Number(localStorage.getItem(storageKey))
    return saved > 0 && saved < 100 ? saved : 50
  } catch {
    return 50
  }
}

/** Bar between the form and the preview that changes the form's share of the width (in %). */
function Splitter() {
  const [share, setShare] = useState(loadShare)
  const [dragging, setDragging] = useState(false)
  // In px from the middle of the lane
  const [knobOffset, setKnobOffset] = useState(0)
  const bar = useRef(null)

  // Written straight onto the parent instead of going through App: otherwise the whole form
  // would re-render on every pixel of the drag. Layout effect, so the saved width shows
  // without a jump on the first paint.
  useLayoutEffect(() => {
    bar.current.parentElement.style.setProperty('--form-share', `${share}%`)
    try {
      localStorage.setItem(storageKey, String(share))
    } catch {
      // Without localStorage the width just isn't remembered
    }
  }, [share])

  function limits() {
    const min = Math.max(minShare, (minWidth / bar.current.parentElement.getBoundingClientRect().width) * 100)
    return { min, max: 100 - min }
  }

  function clamp(value, { min, max }) {
    return Math.min(Math.max(value, min), max)
  }

  function moveTo(clientX) {
    const area = bar.current.parentElement.getBoundingClientRect()
    const x = clientX - area.left
    const value = Math.abs(x - area.width / 2) < snapDistance ? 50 : (x / area.width) * 100
    setShare(clamp(value, limits()))
  }

  // The knob follows the pointer up and down its lane while dragging, without leaving the lane
  function followPointer(clientY) {
    const lane = bar.current.getBoundingClientRect()
    const room = lane.height / 2 - knobHalfHeight
    setKnobOffset(Math.min(Math.max(clientY - lane.top - lane.height / 2, -room), room))
  }

  function handlePointerDown(e) {
    if (e.button !== 0) return
    e.preventDefault()
    bar.current.setPointerCapture(e.pointerId)
    setDragging(true)
    followPointer(e.clientY)
  }

  function handlePointerMove(e) {
    if (!dragging) return
    moveTo(e.clientX)
    followPointer(e.clientY)
  }

  function stopDragging() {
    setDragging(false)
    setKnobOffset(0)
  }

  function handleKeyDown(e) {
    const step = { ArrowLeft: -keyStep, ArrowRight: keyStep }[e.key]
    if (!step) return
    e.preventDefault()
    setShare((current) => clamp(Math.round((current + step) / keyStep) * keyStep, limits()))
  }

  return (
    <div
      ref={bar}
      className={dragging ? 'splitter dragging' : 'splitter'}
      role="separator"
      aria-orientation="vertical"
      aria-label={texts.splitter.label}
      aria-valuenow={Math.round(share)}
      aria-valuetext={texts.splitter.value(Math.round(share))}
      tabIndex={0}
      title={texts.splitter.hint}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onDoubleClick={() => setShare(50)}
      onKeyDown={handleKeyDown}
    >
      <span className="splitter-knob" style={{ translate: `0 ${knobOffset}px` }}><ResizeIcon/></span>
    </div>
  )
}

export default Splitter
