import { useEffect, useRef, useState } from 'react'
import texts from '../locales/index.js'
import { listCvs } from '../data/library.js'
import { ArrowIcon, CheckIcon, ClockIcon, CopyIcon, PlusIcon, TrashIcon } from './Icons.jsx'

const t = texts.myCvs
const h = texts.history

// Splits a moment into what the labels need: whether it was today or yesterday, and its parts
function moment(time) {
  const date = new Date(time)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return {
    today: date.toDateString() === now.toDateString(),
    yesterday: date.toDateString() === yesterday.toDateString(),
    thisYear: date.getFullYear() === now.getFullYear(),
    day: date.getDate(),
    month: texts.common.dateMonths.short[date.getMonth()],
    year: date.getFullYear(),
    clock: `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`,
  }
}

// 'Editado hoy, 12:30', 'Editado ayer', 'Editado el 3 nov' (with the year if it is not this
// one); nothing for a CV not saved yet
function editedLabel(time) {
  if (!time) return ''
  const m = moment(time)
  if (m.today) return t.editedToday(m.clock)
  if (m.yesterday) return t.editedYesterday
  return m.thisYear ? t.editedOn(m.day, m.month) : t.editedOnYear(m.day, m.month, m.year)
}

// 'Hoy, 12:30', 'Ayer, 19:42', '3 nov, 17:10'
function versionLabel(time) {
  const m = moment(time)
  if (m.today) return h.today(m.clock)
  if (m.yesterday) return h.yesterday(m.clock)
  return m.thisYear ? h.day(m.day, m.month, m.clock) : h.dayOfYear(m.day, m.month, m.year, m.clock)
}

/**
 * «Mis CV»: the saved CVs, to open, duplicate or delete one, or start a new one; and the open
 * CV's history, to go back to an older version. `openName` is the open CV's name as it is now
 * (the saved list may be a moment behind). `readVersions()` gives the history to show.
 */
function MyCvs({ openId, openName, onOpen, onNew, onDuplicate, onRemove, onRestore, readVersions }) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState([])
  // 'list' (the CVs) or 'history' (the open CV's versions)
  const [view, setView] = useState('list')
  const box = useRef(null)

  function toggle() {
    // Read when it opens, so it always shows what is saved now
    if (!open) {
      setList(listCvs())
      setView('list')
    }
    setOpen(!open)
  }

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (!box.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    // Another tab added, renamed or deleted a CV
    function handleStorage() {
      setList(listCvs())
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('storage', handleStorage)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('storage', handleStorage)
    }
  }, [open])

  // Read on every redraw while shown: a restore changes what counts as "now"
  const versions = open && view === 'history' ? readVersions() : []

  // The open CV is always listed, even before its first save
  const rows = list.some((entry) => entry.id === openId) ? list : [...list, { id: openId, updated: null }]

  // The menu stays open, so the result shows at once (which CV is open now, the copy, the gap
  // left by a deleted one). The changes are already saved, so the list reads them back.
  function choose(action) {
    action()
    setList(listCvs())
  }

  return (
    <span className="my-cvs" ref={box}>
      <button type="button" className="btn btn-ghost my-cvs-button" aria-expanded={open} onClick={toggle}>
        {t.button}<ArrowIcon/>
      </button>
      {open && view === 'history' && (
        <div className="my-cvs-menu frost" role="dialog" aria-label={h.title(openName)}>
          <button type="button" className="my-cvs-back" onClick={() => setView('list')}>
            <ArrowIcon/>{h.back}
          </button>
          <span className="menu-subtitle">{h.title(openName)}</span>
          <ul className="my-cvs-list">
            <li className="my-cvs-version current">
              <span className="my-cvs-text">
                <span className="my-cvs-name">{h.now}</span>
                <span className="my-cvs-date">{h.nowHint}</span>
              </span>
            </li>

            {versions.map((entry) => {
              const when = versionLabel(entry.time)
              return (
                <li key={entry.time} className="my-cvs-version">
                  <span className="my-cvs-text"><span className="my-cvs-name">{when}</span></span>
                  <button type="button" className="btn btn-secondary btn-small" aria-label={h.restoreLabel(when)}
                    onClick={() => onRestore(entry.time, when)}>
                    {h.restore}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="my-cvs-note">{versions.length ? h.note : h.empty}</p>
        </div>
      )}
      {open && view === 'list' && (
        <div className="my-cvs-menu frost" role="dialog" aria-label={t.title}>
          <span className="menu-subtitle">{t.title}</span>
          <ul className="my-cvs-list">
            {rows.map((entry) => {
              const current = entry.id === openId
              const name = current ? openName : (entry.name || texts.download.fileName)
              return (
                <li key={entry.id} className={current ? 'my-cvs-row current' : 'my-cvs-row'}>
                  <button type="button" className="my-cvs-open" aria-current={current || undefined}
                    aria-label={t.open(name)} onClick={() => choose(() => !current && onOpen(entry.id))}>
                    <span className="my-cvs-check">{current && <CheckIcon/>}</span>
                    <span className="my-cvs-text">
                      <span className="my-cvs-name">{name}</span>
                      <span className="my-cvs-date">{editedLabel(entry.updated)}</span>
                    </span>
                  </button>
                  <span className="my-cvs-actions">
                    <button type="button" className="btn btn-ghost btn-icon btn-small copy-chip" data-hint={t.duplicate}
                      aria-label={`${t.duplicate} «${name}»`} onClick={() => choose(() => onDuplicate(entry.id))}>
                      <CopyIcon/>
                    </button>
                    <button type="button" className="btn btn-ghost btn-icon btn-small" data-hint={t.remove}
                      aria-label={`${t.remove} «${name}»`} onClick={() => choose(() => onRemove(entry.id, name))}>
                      <TrashIcon/>
                    </button>
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="my-cvs-divider"/>
          <button type="button" className="my-cvs-new" onClick={() => setView('history')}>
            <ClockIcon/>{h.open}
          </button>
          <button type="button" className="my-cvs-new my-cvs-add" onClick={() => choose(onNew)}>
            <PlusIcon/>{t.newCv}
          </button>
        </div>
      )}
    </span>
  )
}

export default MyCvs
