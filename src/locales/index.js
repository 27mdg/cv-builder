import es from './es.js'
import sampleCvEs from './sampleCv.es.js'
import enGB from './en-GB.js'

// Every language is bundled with the site (a text file is a few KB once compressed), so any of
// them is at hand at once: the site's, and a CV's own language (roadmap item 44).
// To add one: copy es.js and sampleCv.es.js (e.g. fr.js, sampleCv.fr.js) and list them here.
// `name`: in its own language, as the CV language menu shows it; `short`: the toolbar's label.
// `cvOnly`: it has only the PDF's texts so far (the site is not translated yet, stage J): CVs can
// use it, the site cannot.
const languages = {
  es: { name: 'Español', short: 'ES', texts: es, sampleCv: sampleCvEs },
  'en-GB': { name: 'English', short: 'EN', texts: enGB, sampleCv: sampleCvEs, cvOnly: true },
}

/** The languages a CV can be written in: [{ code, name, short }], in the menu's order. */
export const cvLanguages = Object.entries(languages).map(([code, { name, short }]) => ({ code, name, short }))

// CVs saved while other codes existed: English was plain 'en' before it became British
const renamed = { en: 'en-GB' }

/** A saved CV's language as it is now: renamed if needed, '' (the site's) if it no longer exists. */
export function knownCvLanguage(code) {
  const current = renamed[code] ?? code
  return languages[current] ? current : ''
}

const fallbackLanguage = 'es'

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// A translation over the Spanish texts: whatever it lacks shows in Spanish instead of breaking
// the site. `missing` collects the paths of those texts, to warn while developing.
function withFallback(own, base, path, missing) {
  const result = {}
  for (const [key, baseValue] of Object.entries(base)) {
    const value = own?.[key]
    const where = path ? `${path}.${key}` : key
    if (value === undefined) {
      missing.push(where)
      result[key] = baseValue
    } else {
      result[key] = isPlainObject(baseValue) && isPlainObject(value)
        ? withFallback(value, baseValue, where, missing)
        : value
    }
  }
  return result
}

// A translation may list its section titles together (`sectionTitles: { education: '…' }`, easier
// to translate); they go where es.js has them, `education.title`
function withSectionTitles({ sectionTitles = {}, ...own }) {
  const result = { ...own }
  for (const [key, title] of Object.entries(sectionTitles)) result[key] = { ...own[key], title }
  return result
}

const prepared = new Map()

/** The texts of a language (its code, e.g. 'es'), completed with Spanish where it lacks any. */
export function textsFor(code) {
  if (!languages[code]) code = fallbackLanguage
  if (!prepared.has(code)) {
    const missing = []
    prepared.set(code, code === fallbackLanguage ? es : withFallback(withSectionTitles(languages[code].texts), es, '', missing))
    if (import.meta.env.DEV && missing.length && !languages[code].cvOnly) {
      console.warn(`Language "${code}" lacks ${missing.length} texts, shown in Spanish:`, missing)
    }
  }
  return prepared.get(code)
}

/** The sample CV of a language (template thumbnails), Spanish if it has none. */
export function sampleCvFor(code) {
  return (languages[code] ?? languages[fallbackLanguage]).sampleCv
}

// The page's own language (`<html lang>`, which each language's address will set). While
// developing, `?lang=en-GB` in the address tries another one. The PDF worker has no page: it is
// told the language with each request (switchLanguage).
function pageLanguage() {
  if (typeof document === 'undefined') return fallbackLanguage
  const isSiteLanguage = (code) => languages[code] && !languages[code].cvOnly
  const asked = import.meta.env.DEV && new URLSearchParams(location.search).get('lang')
  const code = isSiteLanguage(asked) ? asked : document.documentElement.lang
  return isSiteLanguage(code) ? code : fallbackLanguage
}

export let language = pageLanguage()

// One object shared by every file that imports it, so switchLanguage can refill it in place
const texts = { ...textsFor(language) }

/** Switches the texts every file sees to another language (the PDF worker, per request). */
export function switchLanguage(code) {
  if (!languages[code] || code === language) return
  language = code
  for (const key of Object.keys(texts)) delete texts[key]
  Object.assign(texts, textsFor(code))
}

if (typeof document !== 'undefined') {
  // Spellcheck and screen readers follow the page's language
  document.documentElement.lang = language
}

export default texts
