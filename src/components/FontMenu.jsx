import texts from '../locales/es.js'
import { fonts, fontOf } from '../data/design.js'
import Slider from './Slider.jsx'
// So each name in the list shows in its own typeface. Served from our own site (GDPR)
// and the browser only downloads them when this menu opens.
import '@fontsource/arimo/400.css'
import '@fontsource/carlito/400.css'
import '@fontsource/cousine/400.css'
import '@fontsource/eb-garamond/400.css'
import '@fontsource/gelasio/400.css'
import '@fontsource/lato/400.css'
import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-serif/400.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/poppins/400.css'
import '@fontsource/raleway/400.css'
import '@fontsource/roboto/400.css'
import '@fontsource/tinos/400.css'

function FontMenu({ design, defaultFont, onChange }) {
  const current = fontOf(design, defaultFont).id

  return (
    <div className="design-menu">
      <Slider
        title={texts.tools.fontSize}
        label={texts.tools.steps[design.size - 1]}
        value={design.size}
        min={1}
        max={5}
        onChange={(value) => onChange('size', value)}
      />
      <p className="menu-subtitle">{texts.tools.font}</p>
      <div className="font-list">
        {fonts.map((font) => (
          <button
            key={font.id}
            type="button"
            className={font.id === current ? 'selected' : ''}
            aria-pressed={font.id === current}
            style={{ fontFamily: font.css }}
            onClick={() => onChange('font', font.id)}
          >
            {font.hint ? `${font.name} (${texts.tools.similarTo} ${font.hint})` : font.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FontMenu
