import { memo } from 'react'
import RichTextEditor from './RichTextEditor.jsx'

// Profile, achievements and free-text custom sections. The box is the whole section, so its
// label (the section's title) is only for screen readers: shown, it would repeat the title.
function LongText({ label, value, hint, onChange }) {
  return <RichTextEditor label={label} hideLabel value={value} placeholder={hint} onChange={onChange}/>
}

export default memo(LongText)
