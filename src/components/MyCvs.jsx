import { useEffect, useRef, useState } from 'react'
import texts from '../locales/index.js'
import { listCvs } from '../data/library.js'
import { ArrowIcon, CheckIcon, CopyIcon, PlusIcon, TrashIcon } from './Icons.jsx'

const t = texts.myCvs

// 'Editado hoy, 12:30', 'Editado ayer', 'Editado el 3 nov' (with the year if it is not this
// one); nothing for a CV not saved yet
function editedLabel(time) {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === now.toDateString()) {
    return t.editedToday(`${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`)
  }
  if (date.toDateString() === yesterday.toDateString()) return t.editedYesterday
  const month = texts.common.dateMonths.short[date.getMonth()]
  return date.getFullYear() === now.getFullYear()
    ? t.editedOn(date.getDate(), month)
    : t.editedOnYear(date.getDate(), month, date.getFullYear())
}

/**
 * «Mis CV»: the saved CVs, to open, duplicate or delete one, or start a new one.
 * `openName` is the open CV's name as it is now (the saved list may be a moment behind).
 */
function MyCvs({ openId, openName, onOpen, onNew, onDuplicate, onRemove }) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState([])
  const box = useRef(null)

  function toggle() {
    // Read when it opens, so it always shows what is saved now
    if (!open) setList(listCvs())
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
      {open && (
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
          <button type="button" className="my-cvs-new" onClick={() => choose(onNew)}>
            <PlusIcon/>{t.newCv}
          </button>
        </div>
      )}
    </span>
  )
}

export default MyCvs
