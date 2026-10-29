import { parseRichText } from '../../templates/format.js'

// The editor shows the formatting as it will look, but the CV keeps the text with simple marks
// ('- ' bullets, **bold**, [text](link), see parseRichText): these two functions translate.

export const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function segmentsHtml(segments) {
  return segments.map((s) => {
    if (s.href) return `<a href="${escape(s.href)}">${escape(s.text)}</a>`
    if (s.bold) return `<b>${escape(s.text)}</b>`
    return escape(s.text)
  }).join('')
}

export function toHtml(text) {
  if (!text) return ''
  let html = ''
  let inList = false
  for (const line of parseRichText(text)) {
    const content = segmentsHtml(line.segments) || '<br>'
    if (line.bullet && !inList) html += '<ul>'
    if (!line.bullet && inList) html += '</ul>'
    inList = line.bullet
    html += line.bullet ? `<li>${content}</li>` : `<div>${content}</div>`
  }
  return inList ? html + '</ul>' : html
}

function isBold(node) {
  const weight = node.style?.fontWeight
  return node.tagName === 'B' || node.tagName === 'STRONG' || weight === 'bold' || Number(weight) >= 600
}

// Formatting inside a line; anything else the browser adds (italics, colours…) is dropped
function inlineText(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\n/g, ' ')
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  if (node.tagName === 'BR') return '\n'
  const inner = [...node.childNodes].map(inlineText).join('')
  if (!inner.trim()) return inner
  if (node.tagName === 'A' && node.getAttribute('href')) return `[${inner}](${node.getAttribute('href')})`
  return isBold(node) ? `**${inner}**` : inner
}

export function fromDom(root) {
  const lines = []
  // Text sitting straight in the editor (its first line, in most browsers)
  let loose = null
  const flush = () => {
    if (loose !== null) lines.push(...loose.split('\n'))
    loose = null
  }
  for (const node of root.childNodes) {
    const tag = node.nodeType === Node.ELEMENT_NODE ? node.tagName : ''
    if (tag === 'UL' || tag === 'OL') {
      flush()
      for (const item of node.children) lines.push('- ' + inlineText(item).replace(/\n/g, ' ').trim())
    } else if (tag === 'DIV' || tag === 'P') {
      flush()
      lines.push(...fromDom(node).split('\n'))
    } else if (tag === 'BR') {
      lines.push(loose ?? '')
      loose = null
    } else {
      loose = (loose ?? '') + inlineText(node)
    }
  }
  flush()
  return lines.join('\n').replace(/\s+$/, '')
}
