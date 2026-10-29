import texts from '../../locales/es.js'
import { ArrowIcon, CheckIcon, CloseIcon, EyeIcon, EyeOffIcon } from '../Icons.jsx'

// <details> folds and unfolds without JavaScript or state.
// `handle`: the drag handle of sections that can be reordered (see SortableSections.jsx).
// `onRemove`: shows a × to remove an optional section.
// `icon`: the section's icon component; `summary`: what it holds, shown while closed;
// `done`: it has content (a tick next to the title).
// `hidden` + `onToggleHidden`: an eye button that leaves the section out of the PDF without deleting it.
function Section({
  title, icon: Icon, summary, done, hidden, onToggleHidden, open, handle, onRemove, children,
}) {
  return (
    <details className={hidden ? 'section is-hidden' : 'section'} open={open}>
      <summary>
        {handle}
        {Icon && <span className="section-icon"><Icon/></span>}
        <div className="section-heading">
          <h2>
            {title}
            {done && <span className="section-done" role="img" aria-label={texts.summary.done}><CheckIcon/></span>}
            {hidden && <span className="section-badge">{texts.visibility.hidden}</span>}
          </h2>
          {summary && <p className="section-summary">{summary}</p>}
        </div>
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
            {hidden ? <EyeOffIcon/> : <EyeIcon/>}
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
      <div className="section-content">{children}</div>
    </details>
  )
}

export default Section
