import { Children, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

// Our own dropdown instead of the browser's <select>, whose open list cannot be styled. Used like
// a <select>: <Select value onChange aria-label><option value>…</option></Select>, and onChange
// gets { target: { value } } with the value as text, as a <select> gives it.
// Keyboard as in a <select>: arrows, Home/End, Page Up/Down, Enter or Space, Esc, and typing
// jumps to the option that starts with what was typed ("20" → 2020). Screen readers hear a
// combobox with a listbox (the focus stays on the button; aria-activedescendant points to the
// option). Closed, only the button is drawn, not the options (a year list has about seventy).

// Typed letters within this time (ms) form one search ("20" + "1" + "5" → 2015)
const typeAheadPause = 600
const pageStep = 8

function optionsOf(children) {
  return Children.toArray(children)
    .filter((child) => child?.type === 'option')
    .map((child) => ({ value: String(child.props.value ?? ''), label: child.props.children }))
}

function Select({ value, onChange, children, ...rest }) {
  const options = optionsOf(children)
  const current = String(value ?? '')
  const chosenIndex = options.findIndex((option) => option.value === current)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const button = useRef(null)
  const list = useRef(null)
  const typed = useRef({ text: '', time: 0 })
  const id = useId()

  function choose(index) {
    const option = options[index]
    if (option && option.value !== current) onChange?.({ target: { value: option.value } })
  }

  function show() {
    setActive(Math.max(chosenIndex, 0))
    setOpen(true)
  }

  function hide(refocus) {
    setOpen(false)
    if (refocus) button.current?.focus()
  }

  // In the browser's top layer (popover), so no card can cut it off; placed by hand under the
  // button, or above it if there is no room below, like the calendar
  useLayoutEffect(() => {
    if (!open) return
    const listBox = list.current
    listBox.showPopover?.()
    const field = button.current.getBoundingClientRect()
    listBox.style.minWidth = `${field.width}px`
    const { offsetWidth: width, offsetHeight: height } = listBox
    const fitsBelow = field.bottom + 6 + height <= window.innerHeight - 8
    const top = fitsBelow || field.top - 6 - height < 8 ? field.bottom + 6 : field.top - 6 - height
    const left = Math.min(Math.max(field.left, 8), window.innerWidth - width - 8)
    listBox.style.top = `${top}px`
    listBox.style.left = `${left}px`
    // Opens on the chosen option, in the middle of the list
    const chosen = listBox.querySelector('[aria-selected="true"]')
    if (chosen) listBox.scrollTop = chosen.offsetTop - (listBox.clientHeight - chosen.offsetHeight) / 2
  }, [open])

  useEffect(() => {
    if (!open || active < 0) return
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e) {
      if (!button.current.contains(e.target) && !list.current?.contains(e.target)) hide(false)
    }
    // It is placed once: if the page moves, it closes instead of floating in the wrong place
    function handleMove(e) {
      if (e.target === window || !list.current?.contains(e.target)) hide(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('scroll', handleMove, true)
    window.addEventListener('resize', handleMove)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('scroll', handleMove, true)
      window.removeEventListener('resize', handleMove)
    }
  }, [open])

  // The option that starts with what was typed, looking forward from the current one
  function search(key) {
    const now = Date.now()
    const text = now - typed.current.time < typeAheadPause ? typed.current.text + key : key
    typed.current = { text, time: now }
    const from = open ? active : chosenIndex
    // A single letter looks from the next option, so pressing it again cycles through the options
    // with that letter, as in a <select>; a longer text may still match the current one
    const start = text.length > 1 ? Math.max(from, 0) : from + 1
    const matches = (i) => String(options[i].label).toLowerCase().startsWith(text.toLowerCase())
    const found = [...options.keys()].map((i) => (start + i) % options.length).find(matches)
    if (found === undefined) return
    if (open) setActive(found)
    else choose(found)
  }

  function handleKeyDown(e) {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        search(e.key)
      }
      return
    }
    const moves = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
      PageDown: Math.min(active + pageStep, last),
      PageUp: Math.max(active - pageStep, 0),
    }
    if (moves[e.key] !== undefined) {
      e.preventDefault()
      setActive(moves[e.key])
    } else if (e.key === 'Enter' || (e.key === ' ' && Date.now() - typed.current.time >= typeAheadPause)) {
      e.preventDefault()
      choose(active)
      hide(true)
    } else if (e.key === 'Escape') {
      // Also keeps a calendar around it from closing
      e.preventDefault()
      e.stopPropagation()
      hide(true)
    } else if (e.key === 'Tab') {
      hide(false)
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      search(e.key)
    }
  }

  const chosenLabel = chosenIndex >= 0 ? options[chosenIndex].label : ''
  return (
    <span className="select">
      <button
        ref={button}
        type="button"
        role="combobox"
        className={current === '' ? 'select-button is-empty' : 'select-button'}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open && active >= 0 ? `${id}-${active}` : undefined}
        {...rest}
        onClick={() => (open ? hide(true) : show())}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          if (!list.current?.contains(e.relatedTarget)) hide(false)
        }}
      >
        {chosenLabel}
      </button>
      {open && (
        <span
          ref={list}
          popover="manual"
          id={`${id}-list`}
          className="select-list"
          role="listbox"
          aria-label={rest['aria-label']}
          // The focus stays on the button, also when an option or the scrollbar is clicked
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((option, i) => (
            <span
              key={option.value}
              id={`${id}-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === chosenIndex}
              className={i === active ? 'select-option active' : 'select-option'}
              onPointerMove={() => i !== active && setActive(i)}
              onClick={() => {
                choose(i)
                hide(true)
              }}
            >
              {option.label}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}

export default Select
