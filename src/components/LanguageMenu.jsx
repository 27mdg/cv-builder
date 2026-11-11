import texts, { cvLanguages } from '../locales/index.js'

// The CV's language: only the PDF's fixed texts change (titles, «Presente», months, levels); what
// the user writes stays as written. It stays open, so languages can be tried on the preview.
function LanguageMenu({ value, onChange }) {
  return (
    <div className="design-menu language-menu">
      <p className="menu-subtitle">{texts.tools.cvLanguage}</p>
      <p className="menu-note">{texts.tools.cvLanguageNote}</p>
      <div className="option-list">
        {cvLanguages.map(({ code, name }) => (
          <button key={code} type="button" lang={code} className={code === value ? 'selected' : undefined}
            aria-pressed={code === value} onClick={() => onChange(code)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageMenu
