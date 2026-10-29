import texts from '../../locales/es.js'
import { hasText, join, itemSummary, itemsWithContent, formatBirthDate, plainText } from '../../templates/format.js'

// Sections whose items are a single field instead of a title built by itemSummary
const simpleField = { skills: 'skill', languages: 'language', hobbies: 'interest', qualities: 'quality' }
// In characters: a closed section shows one line, so long texts are cut
const maxLength = 70

function shorten(text) {
  // Without the formatting marks (**bold**, links…)
  const line = plainText(text).trim().split('\n')[0]
  return line.length > maxLength ? line.slice(0, maxLength).trimEnd() + '…' : line
}

/**
 * One line telling what a closed section holds, e.g. 'Diseñadora — Estudio X +1 más',
 * or '' if it is empty.
 */
export function sectionSummary(key, cv) {
  if (key === 'personal') {
    const p = cv.personal
    return join([join([p.firstName, p.lastName], ' '), p.email])
  }
  if (key === 'signature') {
    const { image, place, date } = cv.signature
    return join([place, formatBirthDate(date)], ', ') || (image ? texts.signature.added : '')
  }
  if (key === 'references' && cv.referencesOnRequest) return texts.references.onRequestText
  if (!Array.isArray(cv[key])) return hasText(cv[key]) ? shorten(cv[key]) : ''

  const items = itemsWithContent(cv[key])
  if (items.length === 0) return ''
  const first = items[0]
  const title = simpleField[key] ? first[simpleField[key]] : itemSummary(key, first)[0]
  if (!hasText(title)) return texts.summary.items(items.length)
  return items.length > 1 ? `${title} ${texts.summary.more(items.length - 1)}` : title
}
