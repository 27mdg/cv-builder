import { useEffect, useId, useRef, useState } from 'react'
import texts from '../../locales/es.js'
import { escape, fromDom, toHtml } from './richTextHtml.js'
import { LinkIcon, ListIcon } from '../Icons.jsx'
import Animated from '../Animated.jsx'

const t = texts.richText

// The link the cursor is in, if it is inside this editor
function linkAtCursor(editorBox) {
  const node = window.getSelection().anchorNode
  const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node
  const link = element?.closest?.('a')
  return link && editorBox.contains(link) ? link : null
}

/** A description box that shows bullets, bold and links as they will look in the CV. */
function RichTextEditor({ label, value, placeholder, onChange }) {
  const editor = useRef(null)
  // The text this editor produced last: if `value` is the same, the editor already shows it,
  // and rewriting it would move the cursor to the start
  const lastValue = useRef(null)
  const savedRange = useRef(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  // What applies where the cursor is, so each button shows whether it is on
  const [active, setActive] = useState({ bold: false, list: false, link: false })
  const labelId = useId()

  // The browser tells the formatting at the cursor; asked again whenever the cursor moves
  useEffect(() => {
    function update() {
      const inside = editor.current?.contains(window.getSelection().anchorNode)
      setActive(inside
        ? { bold: document.queryCommandState('bold'), list: document.queryCommandState('insertUnorderedList'), link: Boolean(linkAtCursor(editor.current)) }
        : { bold: false, list: false, link: false })
    }
    document.addEventListener('selectionchange', update)
    return () => document.removeEventListener('selectionchange', update)
  }, [])

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
    // Turning bold on with nothing selected changes no text, so no selectionchange follows
    setActive((current) => ({ ...current, [command === 'bold' ? 'bold' : 'list']: document.queryCommandState(command) }))
    sync()
  }

  function openLink() {
    const selection = window.getSelection()
    if (selection.rangeCount && editor.current.contains(selection.anchorNode)) {
      savedRange.current = selection.getRangeAt(0).cloneRange()
    }
    setLinkUrl(linkAtCursor(editor.current)?.getAttribute('href') ?? '')
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
          <button type="button" className="rich-bold" title={t.bold} aria-label={t.bold} aria-pressed={active.bold}
            onMouseDown={(e) => e.preventDefault()} onClick={() => format('bold')}>B</button>
          <button type="button" title={t.list} aria-label={t.list} aria-pressed={active.list}
            onMouseDown={(e) => e.preventDefault()} onClick={() => format('insertUnorderedList')}><ListIcon/></button>
          <button type="button" title={t.link} aria-label={t.link} aria-expanded={linkOpen} aria-pressed={active.link}
            onMouseDown={(e) => e.preventDefault()} onClick={() => (linkOpen ? setLinkOpen(false) : openLink())}><LinkIcon/></button>
        </div>
        {linkOpen && (
          <Animated appear>
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
          </Animated>
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
