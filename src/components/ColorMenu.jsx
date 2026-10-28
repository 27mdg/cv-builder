import texts from '../locales/es.js'
import { colors } from '../data/design.js'

function ColorMenu({ design, defaultColor, onChange }) {
  const current = design.color || defaultColor

  return (
    <div className="color-menu">
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          className={color.id === current ? 'swatch selected' : 'swatch'}
          style={{ backgroundColor: color.value }}
          aria-label={texts.colorNames[color.id]}
          title={texts.colorNames[color.id]}
          aria-pressed={color.id === current}
          onClick={() => onChange('color', color.id)}
        />
      ))}
      {/* <label> instead of a button: clicking it opens the browser's colour picker */}
      <label
        className={current === 'custom' ? 'swatch swatch-rainbow selected' : 'swatch swatch-rainbow'}
        title={texts.colorNames.custom}
      >
        <input
          type="color"
          aria-label={texts.colorNames.custom}
          value={design.customColor || '#1f4e79'}
          onChange={(e) => {
            onChange('customColor', e.target.value)
            onChange('color', 'custom')
          }}
        />
      </label>
    </div>
  )
}

export default ColorMenu
