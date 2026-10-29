import { useEffect, useRef, useState } from 'react'
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
  const customBox = useRef(null)

  function addCustom(type) {
    setChoosingCustom(false)
    onAddCustom(type)
  }

  useEffect(() => {
    if (!choosingCustom) return
    function handlePointerDown(e) {
      if (!customBox.current.contains(e.target)) setChoosingCustom(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setChoosingCustom(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [choosingCustom])

  return (
    <div className="extra-sections">
      <p className="extra-sections-title">{t.title}</p>
      <div className="section-library">
        {keys.map((key) => (
          <Card key={key} icon={sectionIcons[key]} title={texts[key].title} hint={t.hints[key]} onClick={() => onAdd(key)}/>
        ))}
        {/* The two kinds open in a bubble above the card, so nothing grows down out of sight */}
        <div className="library-custom" ref={customBox}>
          <Card icon={LayersIcon} title={t.custom} hint={t.hints.custom}
            onClick={() => setChoosingCustom(!choosingCustom)} expanded={choosingCustom}/>
          {choosingCustom && (
            <div className="library-popover" role="dialog" aria-label={t.customQuestion}>
              <p className="library-question">{t.customQuestion}</p>
              <Card icon={LayersIcon} title={t.customList} hint={t.customListHint} onClick={() => addCustom('list')}/>
              <Card icon={TextIcon} title={t.customText} hint={t.customTextHint} onClick={() => addCustom('text')}/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SectionLibrary
