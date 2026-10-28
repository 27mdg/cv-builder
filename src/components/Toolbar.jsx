import texts from '../locales/es.js'
import templates from '../templates/list.js'
import { fontOf } from '../data/design.js'
import ToolMenu from './ToolMenu.jsx'
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
  return (
    <div className="toolbar">
      <ToolMenu icon={<TemplatesIcon/>} label={texts.tools.templates}>
        {(close) => templates.map((id) => (
          <button
            key={id}
            type="button"
            className={id === template ? 'selected' : ''}
            aria-pressed={id === template}
            onClick={() => {
              onTemplateChange(id)
              close()
            }}
          >
            {texts.templates[id]}
          </button>
        ))}
      </ToolMenu>
      <ToolMenu icon={<FontIcon/>} label={fontOf(design).name}>
        {() => <FontMenu design={design} onChange={onDesignChange}/>}
      </ToolMenu>
      <ToolMenu icon={<SpacingIcon/>} label={texts.tools.spacing}>
        {() => <SpacingMenu design={design} onChange={onDesignChange}/>}
      </ToolMenu>
      <ToolMenu icon={<ColorsIcon/>} label={texts.tools.colors} alignRight>
        {() => <ColorMenu design={design} template={template} onChange={onDesignChange}/>}
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
