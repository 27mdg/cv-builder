import texts from '../../locales/es.js'
import { ArrowIcon, CheckIcon, CloseIcon } from '../Icons.jsx'

// <details> folds and unfolds without JavaScript or state.
// `handle`: the drag handle of sections that can be reordered (see SortableSections.jsx).
// `onRemove`: shows a × to remove an optional section.
// `icon`: the section's icon component; `summary`: what it holds, shown while closed;
// `done`: it has content (a tick next to the title).
function Section({ title, icon: Icon, summary, done, open, handle, onRemove, children }) {
  return (
    <details className="section" open={open}>
      <summary>
        {handle}
        {Icon && <span className="section-icon"><Icon/></span>}
        <div className="section-heading">
          <h2>
            {title}
            {done && <span className="section-done" role="img" aria-label={texts.summary.done}><CheckIcon/></span>}
          </h2>
          {summary && <p className="section-summary">{summary}</p>}
        </div>
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
