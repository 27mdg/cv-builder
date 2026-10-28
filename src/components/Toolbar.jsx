import texts from '../locales/es.js'
import { templateInfo } from '../templates/list.js'
import { fontOf } from '../data/design.js'
import ToolMenu from './ToolMenu.jsx'
import TemplatePicker from './TemplatePicker.jsx'
import FontMenu from './FontMenu.jsx'
import SpacingMenu from './SpacingMenu.jsx'
import ColorMenu from './ColorMenu.jsx'
import {
  TemplatesIcon, FontIcon, SpacingIcon, ColorsIcon,
  FullScreenIcon, ExitFullScreenIcon,
} from './Icons.jsx'

function Toolbar({
  template, onTemplateChange, design, onDesignChange, fullScreen, onFullScreenChange,
}) {
  const info = templateInfo(template)

  return (
    <div className="toolbar">
      <ToolMenu icon={<TemplatesIcon/>} label={texts.tools.templates} wide>
        {() => <TemplatePicker selected={info.id} onSelect={onTemplateChange}/>}
      </ToolMenu>
      <ToolMenu icon={<FontIcon/>} label={fontOf(design, info.defaultFont).name}>
        {() => <FontMenu design={design} defaultFont={info.defaultFont} onChange={onDesignChange}/>}
      </ToolMenu>
      <ToolMenu icon={<SpacingIcon/>} label={texts.tools.spacing}>
        {() => <SpacingMenu design={design} onChange={onDesignChange}/>}
      </ToolMenu>
      <ToolMenu icon={<ColorsIcon/>} label={texts.tools.colors} alignRight>
        {() => <ColorMenu design={design} defaultColor={info.defaultColor} onChange={onDesignChange}/>}
      </ToolMenu>
      <button
        type="button"
        className="full-screen-button"
        aria-label={fullScreen ? texts.tools.exitFullScreen : texts.tools.fullScreen}
        title={fullScreen ? texts.tools.exitFullScreen : texts.tools.fullScreen}
        onClick={() => onFullScreenChange(!fullScreen)}
      >
        {fullScreen ? <ExitFullScreenIcon/> : <FullScreenIcon/>}
      </button>
    </div>
  )
}

export default Toolbar
