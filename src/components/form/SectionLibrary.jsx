import { useState } from 'react'
import texts from '../../locales/es.js'
import sectionIcons from './sectionIcons.js'
import { LayersIcon, PlusIcon, TextIcon } from '../Icons.jsx'

const t = texts.extraSections

// A card that adds something to the CV: icon, name, one line of help and a +
function Card({ icon: Icon, title, hint, onClick, expanded }) {
  return (
    <button type="button" className="library-card" onClick={onClick} aria-expanded={expanded}>
      <span className="library-icon"><Icon/></span>
      <span className="library-text">
        <span className="library-title">{title}</span>
        <span className="library-hint">{hint}</span>
      </span>
      <span className="library-plus"><PlusIcon/></span>
    </button>
  )
}

/**
 * The cards under the form to add more sections. `keys` are the ones not in the form yet;
 * the custom section is always there and first asks which kind the user wants.
 */
function SectionLibrary({ keys, onAdd, onAddCustom }) {
  const [choosingCustom, setChoosingCustom] = useState(false)

  function addCustom(type) {
    setChoosingCustom(false)
    onAddCustom(type)
  }

  return (
    <div className="extra-sections">
      <p className="extra-sections-title">{t.title}</p>
      <div className="section-library">
        {keys.map((key) => (
          <Card key={key} icon={sectionIcons[key]} title={texts[key].title} hint={t.hints[key]} onClick={() => onAdd(key)}/>
        ))}
        {choosingCustom
          ? (
            <div className="library-card is-open">
              <button type="button" className="library-close" onClick={() => setChoosingCustom(false)} aria-expanded="true">
                <span className="library-icon"><LayersIcon/></span>
                <span className="library-title">{t.custom}</span>
              </button>
              <div className="library-choices">
                <Card icon={LayersIcon} title={t.customList} hint={t.customListHint} onClick={() => addCustom('list')}/>
                <Card icon={TextIcon} title={t.customText} hint={t.customTextHint} onClick={() => addCustom('text')}/>
              </div>
            </div>
          )
          : <Card icon={LayersIcon} title={t.custom} hint={t.hints.custom} onClick={() => setChoosingCustom(true)} expanded={false}/>}
      </div>
    </div>
  )
}

export default SectionLibrary
