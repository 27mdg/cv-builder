import { useLayoutEffect, useRef } from 'react'

/**
 * A few choices side by side. The chosen one sits on a white pill that glides to the new
 * choice and takes its width. `options`: [{ value, label }].
 */
function Segmented({ label, options, value, onChange }) {
  const buttons = useRef({})
  const pill = useRef(null)

  // Moved by hand rather than through state: only the pill changes, nothing else re-renders
  useLayoutEffect(() => {
    const button = buttons.current[value]
    const box = pill.current
    if (!button) return
    box.style.width = `${button.offsetWidth}px`
    box.style.translate = `${button.offsetLeft}px 0`
    // It only glides once it is in place: on opening it must not fly in from the left edge
    if (!box.classList.contains('placed')) requestAnimationFrame(() => box.classList.add('placed'))
  }, [value])

  return (
    <div className="segmented" role="group" aria-label={label}>
      <span ref={pill} className="segmented-pill" aria-hidden="true"/>
      {options.map((option) => (
        <button
          key={option.value}
          ref={(element) => { buttons.current[option.value] = element }}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default Segmented
