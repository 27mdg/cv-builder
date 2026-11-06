import { useState } from 'react'
import texts from '../locales/es.js'
import { colors } from '../data/design.js'
import Animated from './Animated.jsx'
import ColorPicker from './ColorPicker.jsx'

const startColor = '#3F5B4C'

function ColorMenu({ design, defaultColor, onChange }) {
  const current = design.color || defaultColor
  const custom = current === 'custom'
  // The picker shows while the custom colour is the chosen one; it grows open only when opened
  // here, not when the menu opens with it already chosen
  const [open, setOpen] = useState(custom)
  const [grown, setGrown] = useState(false)
  const [closing, setClosing] = useState(false)

  function chooseCustom() {
    if (open && !closing) {
      setClosing(true)
      return
    }
    setClosing(false)
    setGrown(true)
    setOpen(true)
    if (!design.customColor) onChange('customColor', startColor)
    onChange('color', 'custom')
  }

  function choosePreset(id) {
    onChange('color', id)
    if (open) setClosing(true)
  }

  return (
    <div className="color-menu">
      <div className="swatches">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            className={color.id === current ? 'swatch selected' : 'swatch'}
            style={{ backgroundColor: color.value }}
            aria-label={texts.colorNames[color.id]}
            data-hint={texts.colorNames[color.id]}
            aria-pressed={color.id === current}
            onClick={() => choosePreset(color.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className={custom ? 'custom-color selected' : 'custom-color'}
        aria-pressed={custom}
        aria-expanded={open && !closing}
        onClick={chooseCustom}
      >
        <span className="swatch swatch-rainbow"/>
        {texts.colorNames.custom}
      </button>
      {open && (
        <Animated
          appear={grown}
          leaving={closing}
          onLeft={() => {
            setOpen(false)
            setClosing(false)
          }}
        >
          <ColorPicker
            value={design.customColor || startColor}
            onChange={(hex) => {
              onChange('customColor', hex)
              if (!custom) onChange('color', 'custom')
            }}
          />
        </Animated>
      )}
    </div>
  )
}

export default ColorMenu
