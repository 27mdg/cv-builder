import { useEffect, useRef, useState } from 'react'
import texts from '../locales/es.js'
import { ArrowIcon } from './Icons.jsx'

// children is a function that receives `close`, so the menu can close after a choice.
// alignRight: for the tools on the right edge, whose menu would overflow the panel.
function ToolMenu({ icon, label, disabled, alignRight, children }) {
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
    <span className="tool" ref={box} title={disabled ? texts.tools.comingSoon : undefined}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {icon}
        {label}
        <ArrowIcon/>
      </button>
      {open && (
        <div className={alignRight ? 'tool-menu align-right' : 'tool-menu'}>
          {children(() => setOpen(false))}
        </div>
      )}
    </span>
  )
}

export default ToolMenu
