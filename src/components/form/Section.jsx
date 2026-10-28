import texts from '../../locales/es.js'
import { ArrowIcon, CloseIcon } from '../Icons.jsx'

// <details> folds and unfolds without JavaScript or state.
// `handle`: the drag handle of sections that can be reordered (see SortableSections.jsx).
// `onRemove`: shows a × to remove an optional section.
function Section({ title, open, handle, onRemove, children }) {
  return (
    <details className="section" open={open}>
      <summary>
        {handle}
        <h2>{title}</h2>
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
