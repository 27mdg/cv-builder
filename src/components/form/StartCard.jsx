import texts from '../../locales/index.js'
import { profiles } from '../../data/start.js'
import { BriefcaseIcon, CapIcon, CheckIcon, CloseIcon, ForkIcon } from '../Icons.jsx'

const t = texts.start
const icons = { student: CapIcon, experienced: BriefcaseIcon, careerChange: ForkIcon }

/**
 * «¿Cómo empiezas?»: shown on an empty CV. Choosing a profile orders the sections for it
 * (`onChoose(id)`); `chosen` is the one picked in this visit, which can still be changed.
 */
function StartCard({ chosen, onChoose, onClose }) {
  return (
    <section className="start-card" aria-labelledby="start-title">
      <div className="start-head">
        <h2 id="start-title" className="start-title">{t.title}</h2>
        <button type="button" className="btn btn-ghost btn-icon btn-small section-remove"
          aria-label={t.close} data-hint={t.close} onClick={onClose}>
          <CloseIcon/>
        </button>
      </div>
      <p className="start-hint">{t.hint}</p>
      <div className="start-choices">
        {Object.keys(profiles).map((id) => {
          const Icon = icons[id]
          const selected = id === chosen
          return (
            <button key={id} type="button" className="library-card card-lift start-choice" aria-pressed={selected}
              onClick={() => onChoose(id)}>
              <span className="library-icon"><Icon/></span>
              <span className="library-text">
                <span className="library-title">{t.profiles[id].title}</span>
                <span className="library-hint">{t.profiles[id].hint}</span>
              </span>
              {selected && <span className="start-check"><CheckIcon/></span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default StartCard
