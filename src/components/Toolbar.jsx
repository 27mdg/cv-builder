import { memo } from 'react'
import texts from '../locales/index.js'
import { templateInfo } from '../templates/list.js'
import { fontOf } from '../data/design.js'
import ToolMenu from './ToolMenu.jsx'
import TemplatePicker from './TemplatePicker.jsx'
import FontMenu from './FontMenu.jsx'
import SpacingMenu from './SpacingMenu.jsx'
import ColorMenu from './ColorMenu.jsx'
import DateMenu from './DateMenu.jsx'
import {
  TemplatesIcon, FontIcon, SpacingIcon, CalendarIcon, ColorsIcon,
  FullScreenIcon,
} from './Icons.jsx'

function Toolbar({
  template, onTemplateChange, design, onDesignChange, fullScreen, onFullScreenChange,
}) {
  const info = templateInfo(template)

  return (
    // The round full-screen button sits beside the bar rather than in it: it changes the
    // whole view, not the CV
    <div className="toolbar-dock">
      <div className="toolbar frost-behind">
        <ToolMenu icon={<TemplatesIcon/>} label={texts.tools.templates} wide>
          {() => <TemplatePicker selected={info.id} onSelect={onTemplateChange}/>}
        </ToolMenu>
        <ToolMenu icon={<FontIcon/>} label={fontOf(design, info.defaultFont).name}>
          {() => <FontMenu design={design} defaultFont={info.defaultFont} onChange={onDesignChange}/>}
        </ToolMenu>
        <ToolMenu icon={<SpacingIcon/>} label={texts.tools.spacing}>
          {() => <SpacingMenu design={design} onChange={onDesignChange}/>}
        </ToolMenu>
        <ToolMenu icon={<CalendarIcon/>} label={texts.tools.date} alignRight>
          {() => <DateMenu design={design} onChange={onDesignChange}/>}
        </ToolMenu>
        <ToolMenu icon={<ColorsIcon/>} label={texts.tools.colors} alignRight>
          {() => <ColorMenu design={design} defaultColor={info.defaultColor} onChange={onDesignChange}/>}
        </ToolMenu>
      </div>
      <button
        type="button"
        className="btn full-screen-button frost"
        aria-label={fullScreen ? texts.tools.exitFullScreen : texts.tools.fullScreen}
        data-hint={fullScreen ? texts.tools.exitFullScreen : texts.tools.fullScreen}
        onClick={() => onFullScreenChange(!fullScreen)}
      >
        <FullScreenIcon exit={fullScreen}/>
      </button>
    </div>
  )
}

// memo: the CV changes on every keystroke, its design and template much less often
export default memo(Toolbar)
