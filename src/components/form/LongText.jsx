import texts from '../../locales/es.js'
import RichTextEditor from './RichTextEditor.jsx'

// Profile, achievements and free-text custom sections
function LongText({ value, hint, onChange }) {
  return <RichTextEditor label={texts.common.description} value={value} placeholder={hint} onChange={onChange}/>
}

export default LongText
