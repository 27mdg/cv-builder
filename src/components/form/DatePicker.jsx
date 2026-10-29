import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import texts from '../../locales/es.js'
import Select from './Select.jsx'
import { ArrowIcon, CalendarIcon } from '../Icons.jsx'

const t = texts.datePicker
// It is used for the birth date: from this year back to 1930
const thisYear = new Date().getFullYear()
const years = []
for (let year = thisYear; year >= 1930; year--) {
  years.push(year)
}

// The CV stores dates as 'YYYY-MM-DD'; months here are 0–11, as in Date
function isoOf(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function fromIso(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function textOf(iso) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

// '12/4/1995' (also with - or .) → '1995-04-12', or null if it is not a real date
function parseText(text) {
  const match = text.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (!match) return null
  const [day, month, year] = match.slice(1).map(Number)
  const date = new Date(year, month - 1, day)
  return date.getMonth() === month - 1 && date.getDate() === day ? isoOf(date) : null
}

// Six full weeks starting on Monday, so the grid never changes height between months
function monthDays(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i))
}

const sameDay = (a, b) => isoOf(a) === isoOf(b)

/**
 * Date field with our own calendar in a bubble, because the browser's one cannot be styled.
 * The date can also be typed (dd/mm/aaaa).
 */
function DatePicker({ label, value, onChange }) {
  // What the user is typing, until it leaves the field; null = show the saved date
  const [draft, setDraft] = useState(null)
  const [open, setOpen] = useState(false)
  // The day with keyboard focus; its month is the one shown
  const [focused, setFocused] = useState(() => new Date())
  const box = useRef(null)
  const field = useRef(null)
  const button = useRef(null)
  const bubble = useRef(null)
  // Only arrow keys and opening move the focus to a day, not the month and year menus
  const focusDay = useRef(false)

  function openCalendar() {
    setFocused(value ? fromIso(value) : new Date())
    focusDay.current = true
    setOpen(true)
  }

  function close(returnFocus) {
    setOpen(false)
    if (returnFocus) button.current.focus()
  }

  function choose(iso) {
    onChange(iso)
    setDraft(null)
    close(true)
  }

  function handleType(text) {
    setDraft(text)
    const iso = parseText(text)
    if (iso) onChange(iso)
  }

  function handleBlur() {
    if (draft === null) return
    if (draft.trim() === '') onChange('')
    // A half-typed date goes back to the saved one
    setDraft(null)
  }

  // Drawn in the browser's top layer (popover), so the section card cannot cut it off;
  // that means placing it by hand under the field, or above it if there is no room below
  useLayoutEffect(() => {
    if (!open) return
    const bubbleBox = bubble.current
    bubbleBox.showPopover?.()
    const fieldBox = field.current.getBoundingClientRect()
    const buttonBox = button.current.getBoundingClientRect()
    const { offsetWidth: width, offsetHeight: height } = bubbleBox
    const fitsBelow = fieldBox.bottom + 12 + height <= window.innerHeight - 8
    const top = fitsBelow || fieldBox.top - 12 - height < 8 ? fieldBox.bottom + 12 : fieldBox.top - 12 - height
    const left = Math.min(Math.max(fieldBox.right - width, 8), window.innerWidth - width - 8)
    bubbleBox.style.top = `${top}px`
    bubbleBox.style.left = `${left}px`
    // The little arrow points at the calendar button
    bubbleBox.style.setProperty('--arrow-left', `${buttonBox.left + buttonBox.width / 2 - left - 6}px`)
    bubbleBox.classList.toggle('above', top < fieldBox.top)
  }, [open])

  useEffect(() => {
    if (!open || !focusDay.current) return
    focusDay.current = false
    bubble.current.querySelector(`[data-date="${isoOf(focused)}"]`)?.focus()
  }, [open, focused])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e) {
      if (!box.current.contains(e.target)) close(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') close(true)
    }
    // It is placed once: if the page moves, it closes instead of floating in the wrong place
    function handleMove(e) {
      if (!bubble.current.contains(e.target)) close(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('scroll', handleMove, true)
    window.addEventListener('resize', handleMove)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('scroll', handleMove, true)
      window.removeEventListener('resize', handleMove)
    }
  }, [open])

  function showMonth(year, month) {
    setFocused(new Date(year, month, 1))
  }

  function handleGridKeyDown(e) {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (steps[e.key] === undefined) return
    e.preventDefault()
    focusDay.current = true
    setFocused(new Date(focused.getFullYear(), focused.getMonth(), focused.getDate() + steps[e.key]))
  }

  const year = focused.getFullYear()
  const month = focused.getMonth()
  const selected = value ? fromIso(value) : null
  const today = new Date()

  return (
    <div className="field field-full" ref={box}>
      <label>
        {label}
        <span className="date-input" ref={field}>
          <input
            placeholder={t.placeholder}
            value={draft ?? textOf(value)}
            onChange={(e) => handleType(e.target.value)}
            onBlur={handleBlur}
          />
          <button
            type="button"
            className="date-button"
            ref={button}
            aria-label={t.open}
            title={t.open}
            aria-expanded={open}
            onClick={() => (open ? close(false) : openCalendar())}
          >
            <CalendarIcon/>
          </button>
        </span>
      </label>
      {open && (
        <div ref={bubble} popover="manual" className="date-popover" role="dialog" aria-label={t.calendar}>
          <div className="date-header">
            <button type="button" className="date-nav previous" aria-label={t.previous} title={t.previous}
              onClick={() => showMonth(year, month - 1)}>
              <ArrowIcon/>
            </button>
            <Select aria-label={texts.common.month} value={month}
              onChange={(e) => showMonth(year, Number(e.target.value))}>
              {texts.common.months.map((name, i) => <option key={name} value={i}>{name}</option>)}
            </Select>
            <Select aria-label={texts.common.year} value={year}
              onChange={(e) => showMonth(Number(e.target.value), month)}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
            <button type="button" className="date-nav next" aria-label={t.next} title={t.next}
              onClick={() => showMonth(year, month + 1)}>
              <ArrowIcon/>
            </button>
          </div>
          <div className="date-weekdays" aria-hidden="true">
            {t.weekdays.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="date-grid" onKeyDown={handleGridKeyDown}>
            {monthDays(year, month).map((day) => {
              const isSelected = selected && sameDay(day, selected)
              const classes = [
                'day',
                day.getMonth() !== month && 'outside',
                sameDay(day, today) && 'today',
                isSelected && 'selected',
              ].filter(Boolean)
              return (
                <button
                  key={isoOf(day)}
                  type="button"
                  className={classes.join(' ')}
                  data-date={isoOf(day)}
                  // Only one day can be reached with Tab; the arrows move between days
                  tabIndex={sameDay(day, focused) ? 0 : -1}
                  aria-pressed={Boolean(isSelected)}
                  aria-label={t.dayLabel(day.getDate(), texts.common.dateMonths.long[day.getMonth()], day.getFullYear())}
                  onClick={() => choose(isoOf(day))}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
          <div className="date-footer">
            <button type="button" className="date-clear" onClick={() => choose('')}>{t.clear}</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
