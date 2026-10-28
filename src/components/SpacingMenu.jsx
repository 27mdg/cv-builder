import texts from '../locales/es.js'
import { lineHeight } from '../data/design.js'
import Slider from './Slider.jsx'

function SpacingMenu({ design, onChange }) {
  const stepped = [
    { field: 'paragraphs', title: texts.tools.paragraphSpacing },
    { field: 'sections', title: texts.tools.sectionSpacing },
    { field: 'margins', title: texts.tools.margins },
  ]

  return (
    <div className="design-menu">
      <Slider
        title={texts.tools.lineHeight}
        label={design.lineHeight.toFixed(2)}
        value={design.lineHeight}
        min={lineHeight.min}
        max={lineHeight.max}
        step={lineHeight.step}
        onChange={(value) => onChange('lineHeight', value)}
      />
      {stepped.map(({ field, title }) => (
        <Slider
          key={field}
          title={title}
          label={texts.tools.steps[design[field] - 1]}
          value={design[field]}
          min={1}
          max={5}
          onChange={(value) => onChange(field, value)}
        />
      ))}
    </div>
  )
}

export default SpacingMenu
