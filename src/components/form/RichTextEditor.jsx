import { useEffect, useId, useRef, useState } from 'react'
import texts from '../../locales/es.js'
import { escape, fromDom, toHtml } from './richTextHtml.js'
import { LinkIcon, ListIcon } from '../Icons.jsx'

const t = texts.richText

/** A description box that shows bullets, bold and links as they will look in the CV. */
function RichTextEditor({ label, value, placeholder, onChange }) {
  const editor = useRef(null)
  // The text this editor produced last: if `value` is the same, the editor already shows it,
  // and rewriting it would move the cursor to the start
  const lastValue = useRef(null)
  const savedRange = useRef(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const labelId = useId()

  useEffect(() => {
    if (value === lastValue.current) return
    lastValue.current = value
    editor.current.innerHTML = toHtml(value)
  }, [value])

  function sync() {
    const text = fromDom(editor.current)
    lastValue.current = text
    onChange(text)
  }

  function format(command) {
    editor.current.focus()
    document.execCommand(command)
    sync()
  }

  function linkAtCursor() {
    const node = window.getSelection().anchorNode
    const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node
    const link = element?.closest('a')
    return link && editor.current.contains(link) ? link : null
  }

  function openLink() {
    const selection = window.getSelection()
    if (selection.rangeCount && editor.current.contains(selection.anchorNode)) {
      savedRange.current = selection.getRangeAt(0).cloneRange()
    }
    setLinkUrl(linkAtCursor()?.getAttribute('href') ?? '')
    setLinkOpen(true)
  }

  function applyLink(remove) {
    editor.current.focus()
    if (savedRange.current) {
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(savedRange.current)
    }
    const url = linkUrl.trim()
    if (remove) {
      document.execCommand('unlink')
    } else if (url) {
      // With nothing selected, the address itself becomes the link's text
      if (window.getSelection().isCollapsed) document.execCommand('insertHTML', false, `<a href="${escape(url)}">${escape(url)}</a>`)
      else document.execCommand('createLink', false, url)
    }
    setLinkOpen(false)
    sync()
  }

  // Pasted text arrives without its formatting: colours and fonts from other pages would not fit
  function handlePaste(e) {
    e.preventDefault()
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
  }

  return (
    <div className="rich-field">
      <span className="label" id={labelId}>{label}</span>
      <div className="rich-editor">
        {/* onMouseDown + preventDefault: clicking a button must not take the selection away */}
        <div className="rich-toolbar">
          <button type="button" className="rich-bold" title={t.bold} aria-label={t.bold}
            onMouseDown={(e) => e.preventDefault()} onClick={() => format('bold')}>B</button>
          <button type="button" title={t.list} aria-label={t.list}
            onMouseDown={(e) => e.preventDefault()} onClick={() => format('insertUnorderedList')}><ListIcon/></button>
          <button type="button" title={t.link} aria-label={t.link} aria-expanded={linkOpen}
            onMouseDown={(e) => e.preventDefault()} onClick={() => (linkOpen ? setLinkOpen(false) : openLink())}><LinkIcon/></button>
        </div>
        {linkOpen && (
          <div className="rich-link">
            <input
              value={linkUrl}
              placeholder={t.linkPlaceholder}
              aria-label={t.link}
              autoFocus
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyLink(false)
                if (e.key === 'Escape') setLinkOpen(false)
              }}
            />
            <button type="button" className="chip" onClick={() => applyLink(false)}>{t.applyLink}</button>
            <button type="button" className="chip" onClick={() => applyLink(true)}>{t.removeLink}</button>
          </div>
        )}
        <div
          ref={editor}
          className={value ? 'rich-content' : 'rich-content is-empty'}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-labelledby={labelId}
          data-placeholder={placeholder}
          // New lines as <div>, the same in every browser
          onFocus={() => document.execCommand('defaultParagraphSeparator', false, 'div')}
          onInput={sync}
          onPaste={handlePaste}
        />
      </div>
    </div>
  )
}

export default RichTextEditor
