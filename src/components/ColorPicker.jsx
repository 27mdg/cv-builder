import { useState } from 'react'
import texts from '../locales/es.js'

// Our own colour picker for the custom colour, instead of the system's colour window, which
// cannot be styled: a square for saturation (across) and brightness (up), a hue slider and the
// hex code. It keeps hue, saturation and brightness itself, because the hex code alone loses the
// hue of a grey and the knob would jump.

function hsvToHex({ h, s, v }) {
  const channel = (n) => {
    const k = (n + h / 60) % 6
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255)
  }
  return '#' + [channel(5), channel(3), channel(1)].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToHsv(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const range = max - Math.min(r, g, b)
  let h = 0
  if (range) {
    if (max === r) h = ((g - b) / range) % 6
    else if (max === g) h = (b - r) / range + 2
    else h = (r - g) / range + 4
    h = (h * 60 + 360) % 360
  }
  return { h, s: max ? range / max : 0, v: max }
}

// "#3f5b4c", "3F5B4C" or "#35c" → "#3F5B4C"; anything else → null
function normalHex(text) {
  let hex = text.trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(hex)) hex = [...hex].map((c) => c + c).join('')
  return /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : null
}

const clamp = (n) => Math.min(Math.max(n, 0), 1)

function ColorPicker({ value, onChange }) {
  const [hsv, setHsv] = useState(() => hexToHsv(normalHex(value) ?? '#3F5B4C'))
  // What is being typed in the hex field, until it is a whole colour
  const [draft, setDraft] = useState(null)
  const t = texts.colorPicker
  const hex = hsvToHex(hsv)

  function change(next) {
    setHsv(next)
    onChange(hsvToHex(next))
  }

  function pickAt(e) {
    const box = e.currentTarget.getBoundingClientRect()
    change({ ...hsv, s: clamp((e.clientX - box.left) / box.width), v: clamp(1 - (e.clientY - box.top) / box.height) })
  }

  function handleAreaKey(e) {
    const step = e.shiftKey ? 0.1 : 0.01
    const moves = { ArrowLeft: ['s', -step], ArrowRight: ['s', step], ArrowDown: ['v', -step], ArrowUp: ['v', step] }
    const move = moves[e.key]
    if (!move) return
    e.preventDefault()
    change({ ...hsv, [move[0]]: clamp(hsv[move[0]] + move[1]) })
  }

  function handleHexType(text) {
    setDraft(text)
    const typed = normalHex(text)
    if (typed) change(hexToHsv(typed))
  }

  return (
    <div className="color-picker">
      <div
        className="color-area"
        style={{ '--hue': hsv.h }}
        role="slider"
        tabIndex={0}
        aria-label={t.area}
        aria-valuetext={t.areaValue(Math.round(hsv.s * 100), Math.round(hsv.v * 100))}
        aria-valuenow={Math.round(hsv.s * 100)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          pickAt(e)
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && pickAt(e)}
        onKeyDown={handleAreaKey}
      >
        <span className="color-knob" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }}/>
      </div>
      <input
        type="range"
        className="range hue-range"
        aria-label={t.hue}
        min={0}
        max={359}
        value={Math.round(hsv.h)}
        onChange={(e) => change({ ...hsv, h: Number(e.target.value) })}
      />
      <div className="color-hex">
        <span className="color-preview" style={{ background: hex }}/>
        <input
          className="input"
          aria-label={t.hex}
          value={draft ?? hex}
          // Room for a pasted code with spaces around it
          maxLength={9}
          spellCheck={false}
          // Selected on entering, so typing or pasting a new code replaces the old one
          onFocus={(e) => e.target.select()}
          onChange={(e) => handleHexType(e.target.value)}
          onBlur={() => setDraft(null)}
        />
      </div>
    </div>
  )
}

export default ColorPicker
