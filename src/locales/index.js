import es from './es.js'
import sampleCvEs from './sampleCv.es.js'
import ca from './ca.js'
import de from './de.js'
import en from './en.js'
import eu from './eu.js'
import fr from './fr.js'
import gl from './gl.js'
import it from './it.js'
import nl from './nl.js'
import pl from './pl.js'
import ptBR from './pt-BR.js'
import ptPT from './pt-PT.js'
import ro from './ro.js'

// Every language is bundled with the site (a text file is a few KB once compressed), so any of
// them is at hand at once: the site's, and later a CV's own language (roadmap item 44).
// To add one: copy es.js and sampleCv.es.js (e.g. en.js, sampleCv.en.js) and list them here.
// `name`: in its own language, as the CV language menu shows it. `cvOnly`: it has only the PDF's
// texts so far (the site is not translated yet, stage J): CVs can use it, the site cannot.
// The CV-only translations are first drafts: a native speaker should review them before launch.
const cvOnly = (name, texts) => ({ name, texts, sampleCv: sampleCvEs, cvOnly: true })
const languages = {
  es: { name: 'Español', texts: es, sampleCv: sampleCvEs },
  en: cvOnly('English', en),
  fr: cvOnly('Français', fr),
  de: cvOnly('Deutsch', de),
  it: cvOnly('Italiano', it),
  'pt-BR': cvOnly('Português (Brasil)', ptBR),
  'pt-PT': cvOnly('Português (Portugal)', ptPT),
  nl: cvOnly('Nederlands', nl),
  pl: cvOnly('Polski', pl),
  ro: cvOnly('Română', ro),
  ca: cvOnly('Català', ca),
  eu: cvOnly('Euskara', eu),
  gl: cvOnly('Galego', gl),
}

/** The languages a CV can be written in: [{ code, name }], in the menu's order. */
export const cvLanguages = Object.entries(languages).map(([code, { name }]) => ({ code, name }))

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
// developing, `?lang=en` in the address tries another one. The PDF worker has no page: it is
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
