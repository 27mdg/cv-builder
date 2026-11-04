import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import texts from '../locales/es.js'
import { prefersReducedMotion } from './useLeaving.js'

// children is a function that receives `close`, so the menu can close after a choice.
// alignRight: for the tools on the right edge, whose menu would overflow the panel.
// wide: the menu spans the whole toolbar area instead of hanging from its button.
function ToolMenu({ icon, label, disabled, alignRight, wide, children }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  const labelBox = useRef(null)
  const labelWidth = useRef(0)

  // A new label (another font chosen) would make the toolbar jump to its new size: instead the
  // label's room grows or shrinks smoothly while the new name fades in. If it changes again
  // halfway, it carries on from the width it has at that moment.
  useLayoutEffect(() => {
    const span = labelBox.current
    const running = span.getAnimations()
    const from = running.length ? span.getBoundingClientRect().width : labelWidth.current
    running.forEach((animation) => animation.cancel())
    const to = span.getBoundingClientRect().width
    labelWidth.current = to
    // Width 0: only the icon shows on a narrow preview
    if (!from || !to || from === to || prefersReducedMotion()) return
    span.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: 350, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
    span.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' })
  }, [label])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (!box.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    // The "coming soon" hint goes on the span: disabled buttons do not show their title
    <span className={wide ? 'tool wide' : 'tool'} ref={box} title={disabled ? texts.tools.comingSoon : undefined}>
      <button
        type="button"
        className="btn btn-ghost"
        disabled={disabled}
        aria-expanded={open}
        // On a narrow preview only the icon shows: the title keeps the name for the mouse and screen readers
        title={label}
        onClick={() => setOpen(!open)}
      >
        {icon}
        <span ref={labelBox} className="tool-label">{label}</span>
      </button>
      {open && (
        <div className={['tool-menu frost', alignRight && 'align-right', wide && 'wide'].filter(Boolean).join(' ')}>
          {children(() => setOpen(false))}
        </div>
      )}
    </span>
  )
}

export default ToolMenu
