import { useRef, useState } from 'react'
import texts from '../../locales/es.js'
import { ArrowIcon, CheckIcon, CloseIcon, PencilIcon, VisibilityIcon } from '../Icons.jsx'

// <details> folds and unfolds without JavaScript or state.
// `handle`: the drag handle of sections that can be reordered (see SortableSections.jsx).
// `onRemove`: shows a × to remove an optional section.
// `icon`: the section's icon component; `summary`: what it holds, shown while closed;
// `done`: it has content (a tick next to the title).
// `hidden` + `onToggleHidden`: an eye button that leaves the section out of the PDF without deleting it.
// `customTitle` + `onRename`: a pencil button to give the section another title in the CV;
// `startRenaming` shows the title field from the start (new custom sections).
function Section({
  title, icon: Icon, summary, done, hidden, onToggleHidden, customTitle, onRename, startRenaming,
  open, handle, onRemove, children,
}) {
  const [renaming, setRenaming] = useState(Boolean(startRenaming))
  const [draft, setDraft] = useState(null)
  // The pencil scribbles once each time it is clicked (App.css)
  const [scribbling, setScribbling] = useState(false)
  const details = useRef(null)
  const shownTitle = customTitle?.trim() || title

  return (
    <details ref={details} className={hidden ? 'section is-hidden' : 'section'} open={open}>
      <summary>
        {handle}
        {Icon && <span className="section-icon"><Icon/></span>}
        <div className="section-heading">
          <h2>
            {shownTitle}
            {done && <span className="section-done" role="img" aria-label={texts.summary.done}><CheckIcon/></span>}
            {hidden && <span className="section-badge">{texts.visibility.hidden}</span>}
          </h2>
          {summary && <p className="section-summary">{summary}</p>}
        </div>
        {onRename && (
          <button
            type="button"
            className={scribbling ? 'section-action rename-button scribbling' : 'section-action rename-button'}
            title={texts.rename.button}
            aria-label={`${texts.rename.button}: ${shownTitle}`}
            aria-expanded={renaming}
            onClick={(e) => {
              e.preventDefault()
              // The title field lives inside the section, so it must be open to show it
              details.current.open = true
              setRenaming(!renaming)
              setScribbling(true)
            }}
            onAnimationEnd={() => setScribbling(false)}
          >
            <PencilIcon/>
          </button>
        )}
        {onToggleHidden && (
          <button
            type="button"
            className="section-action"
            title={hidden ? texts.visibility.show : texts.visibility.hide}
            aria-label={`${hidden ? texts.visibility.show : texts.visibility.hide}: ${title}`}
            aria-pressed={hidden}
            onClick={(e) => {
              e.preventDefault()
              onToggleHidden()
            }}
          >
            <VisibilityIcon hidden={hidden}/>
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            className="section-remove"
            title={texts.extraSections.remove}
            aria-label={`${texts.extraSections.remove}: ${title}`}
            onClick={(e) => {
              // Inside <summary>, a click would also fold or unfold the section
              e.preventDefault()
              onRemove()
            }}
          >
            <CloseIcon/>
          </button>
        )}
        <span className="section-arrow" title={texts.common.toggle}><ArrowIcon/></span>
      </summary>
      <div className="section-content">
        {renaming && (
          <label className="rename-field">
            {texts.rename.label}
            <input
              // While typing it shows exactly what was typed (even empty); on leaving the field
              // it shows the title in use, so an emptied field gets the usual title back
              value={draft ?? shownTitle}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                setDraft(e.target.value)
                onRename(e.target.value.trim() === title ? '' : e.target.value)
              }}
              onBlur={() => setDraft(null)}
              onKeyDown={(e) => e.key === 'Enter' && setRenaming(false)}
            />
            <span className="field-hint">{texts.rename.hint(title)}</span>
          </label>
        )}
        {children}
      </div>
    </details>
  )
}

export default Section
