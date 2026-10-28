import texts from '../../locales/es.js'
import { ArrowIcon } from '../Icons.jsx'

// <details> folds and unfolds without JavaScript or state
function Section({ title, open, children }) {
  return (
    <details className="section" open={open}>
      <summary>
        <h2>{title}</h2>
        <span className="section-arrow" title={texts.common.toggle}><ArrowIcon/></span>
      </summary>
      <div className="section-content">{children}</div>
    </details>
  )
}

export default Section
