import { useEffect, useRef } from 'react'
import texts from '../../locales/es.js'
import DatePicker from './DatePicker.jsx'

const t = texts.signature
// The ink: a signature is content of the CV, not part of the web's palette
const ink = '#222222'

// Draws an image file onto the canvas, scaled to fit, so an uploaded signature is stored
// the same way as a drawn one (a PNG of the canvas). Read in the browser: never uploaded.
function drawFile(canvas, file, onDone) {
  const image = new Image()
  const url = URL.createObjectURL(file)
  image.onload = () => {
    const context = canvas.getContext('2d')
    const scale = Math.min(canvas.width / image.width, canvas.height / image.height)
    const width = image.width * scale
    const height = image.height * scale
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    URL.revokeObjectURL(url)
    onDone()
  }
  image.onerror = () => URL.revokeObjectURL(url)
  image.src = url
}

/** Signature drawn with the mouse or a finger (or uploaded), plus place and date. */
function SignatureField({ value, onChange }) {
  const canvas = useRef(null)
  const drawing = useRef(false)
  // The image this canvas produced last, to tell it apart from one coming from outside (import)
  const lastSaved = useRef(null)

  function save() {
    const image = canvas.current.toDataURL('image/png')
    lastSaved.current = image
    onChange('image', image)
  }

  // Sized to its shown size × the screen's pixel ratio, or the strokes look blurry
  useEffect(() => {
    const box = canvas.current
    const ratio = window.devicePixelRatio || 1
    box.width = box.clientWidth * ratio
    box.height = box.clientHeight * ratio
  }, [])

  // Shows a saved or imported signature; one just drawn here is already on the canvas
  useEffect(() => {
    const box = canvas.current
    if (value.image === lastSaved.current) return
    const context = box.getContext('2d')
    context.clearRect(0, 0, box.width, box.height)
    lastSaved.current = value.image
    if (!value.image) return
    const image = new Image()
    image.onload = () => context.drawImage(image, 0, 0, box.width, box.height)
    image.src = value.image
  }, [value.image])

  function point(e) {
    const box = canvas.current.getBoundingClientRect()
    const ratio = canvas.current.width / box.width
    return [(e.clientX - box.left) * ratio, (e.clientY - box.top) * ratio]
  }

  function handlePointerDown(e) {
    canvas.current.setPointerCapture(e.pointerId)
    drawing.current = true
    const context = canvas.current.getContext('2d')
    context.strokeStyle = ink
    context.lineWidth = 2.5 * (window.devicePixelRatio || 1)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(...point(e))
  }

  function handlePointerMove(e) {
    if (!drawing.current) return
    const context = canvas.current.getContext('2d')
    context.lineTo(...point(e))
    context.stroke()
  }

  function handlePointerUp() {
    if (!drawing.current) return
    drawing.current = false
    save()
  }

  function clear() {
    const box = canvas.current
    box.getContext('2d').clearRect(0, 0, box.width, box.height)
    lastSaved.current = ''
    onChange('image', '')
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) drawFile(canvas.current, file, save)
    // Reset the picker so the same file can be chosen again
    e.target.value = ''
  }

  return (
    <>
      <div className="signature-pad">
        <canvas
          ref={canvas}
          aria-label={t.draw}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        {!value.image && <span className="signature-hint">{t.draw}</span>}
      </div>
      <div className="chips signature-actions">
        {value.image && <button type="button" className="chip" onClick={clear}>{t.clear}</button>}
        {/* <label> so the whole chip opens the hidden file picker */}
        <label className="chip">
          {t.upload}
          <input type="file" accept="image/*" onChange={handleFile}/>
        </label>
      </div>
      <div className="grid">
        <label>
          {t.place}
          <input value={value.place} onChange={(e) => onChange('place', e.target.value)}/>
        </label>
        <DatePicker label={t.date} value={value.date} onChange={(date) => onChange('date', date)}/>
      </div>
    </>
  )
}

export default SignatureField
