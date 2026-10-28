import { useEffect, useRef, useState } from 'react'
import texts from '../locales/es.js'
import { ArrowIcon } from './Icons.jsx'

// children is a function that receives `close`, so the menu can close after a choice.
// alignRight: for the tools on the right edge, whose menu would overflow the panel.
// wide: the menu spans the whole toolbar area instead of hanging from its button.
function ToolMenu({ icon, label, disabled, alignRight, wide, children }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)

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
        disabled={disabled}
        aria-expanded={open}
        // On a narrow preview only the icon shows: the title keeps the name for the mouse and screen readers
        title={label}
        onClick={() => setOpen(!open)}
      >
        {icon}
        <span className="tool-label">{label}</span>
        <ArrowIcon/>
      </button>
      {open && (
        <div className={['tool-menu', alignRight && 'align-right', wide && 'wide'].filter(Boolean).join(' ')}>
          {children(() => setOpen(false))}
        </div>
      )}
    </span>
  )
}

export default ToolMenu
