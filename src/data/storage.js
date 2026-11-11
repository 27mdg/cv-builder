import initialCv from './initialCv.js'
import { isCustomKey } from './sections.js'
import templates from '../templates/list.js'
import { knownCvLanguage } from '../locales/index.js'

// Only in the browser (localStorage, or sessionStorage in public computer mode): the data never
// leaves it (GDPR).

// Every key of the saved CVs starts with it (library.js). Version 2 kept one CV under 'cv-gratis'
// itself; library.js converts it.
export const keyPrefix = 'cv-gratis:'
export const oldKey = 'cv-gratis'

// Bump it when the shape of the data changes, to recognise (and convert) old CVs.
// Exported files use it too. 3: several CVs, each with its language.
export const version = 3
// Versions whose CVs can still be read (saved or imported); 1 is ignored (user's decision)
const readable = [2, 3]

// Keeps the saved order, drops unknown keys and adds sections that did not exist yet at the
// end, so older or hand-edited CVs never lose a section. Custom sections count if they have content.
function normalizeOrder(order, cv) {
  const custom = Object.keys(cv).filter((key) => isCustomKey(key) && (Array.isArray(cv[key]) || typeof cv[key] === 'string'))
  const known = [...initialCv.sectionOrder, ...custom]
  const saved = Array.isArray(order) ? order.filter((key, i) => known.includes(key) && order.indexOf(key) === i) : []
  return [...saved, ...known.filter((key) => !saved.includes(key))]
}

// { version, cv } → complete CV, or null if invalid (localStorage or imported file)
export function cvFromData(data) {
  if (!readable.includes(data?.version) || typeof data.cv?.personal !== 'object') return null
  // Merged with initialCv so CVs saved before new fields existed get them (empty)
  const cv = {
    ...initialCv,
    ...data.cv,
    personal: { ...initialCv.personal, ...data.cv.personal },
    design: { ...initialCv.design, ...data.cv.design },
    signature: { ...initialCv.signature, ...data.cv.signature },
  }
  // In case the file was edited by hand: lists must be lists
  for (const name of Object.keys(initialCv)) {
    if (Array.isArray(initialCv[name]) && !Array.isArray(cv[name])) {
      cv[name] = []
    }
  }
  if (!Array.isArray(cv.personal.customFields)) {
    cv.personal.customFields = []
  }
  // CVs from before the list of links had two separate fields: website and LinkedIn. Checked on
  // the saved data, as the merge above already gave `cv` an empty list.
  if (!Array.isArray(data.cv.personal.links)) {
    cv.personal.links = [['portfolio', cv.personal.website], ['linkedin', cv.personal.linkedin]]
      .filter(([, url]) => typeof url === 'string' && url.trim() !== '')
      .map(([type, url]) => ({ id: crypto.randomUUID(), type, url }))
  }
  delete cv.personal.website
  delete cv.personal.linkedin
  cv.sectionOrder = normalizeOrder(cv.sectionOrder, cv)
  if (typeof cv.sectionSettings !== 'object' || cv.sectionSettings === null || Array.isArray(cv.sectionSettings)) {
    cv.sectionSettings = {}
  }
  // Templates can be removed (e.g. the first 'classic' and 'modern')
  if (!templates.some((t) => t.id === cv.template)) {
    cv.template = initialCv.template
  }
  cv.language = typeof cv.language === 'string' ? knownCvLanguage(cv.language) : initialCv.language
  cv.anonymous = cv.anonymous === true
  return cv
}

// Public computer mode (libraries, job centres…): the CV lives only in this tab's sessionStorage,
// which the browser clears when the tab closes, and nothing stays in localStorage.
const publicModeKey = 'cv-gratis-public'

/** Where the CVs live now: sessionStorage in public computer mode, else localStorage. */
export function store() {
  return isPublicMode() ? sessionStorage : localStorage
}

// The keys of the saved CVs in one storage (also the old version 2 one)
export function libraryKeys(storage) {
  const keys = []
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key === oldKey || key.startsWith(keyPrefix)) keys.push(key)
  }
  return keys
}

// All the CVs go along to the other storage, so turning the mode on or off loses none
function moveLibrary(from, to) {
  for (const key of libraryKeys(from)) {
    to.setItem(key, from.getItem(key))
    from.removeItem(key)
  }
}

export function isPublicMode() {
  try {
    return sessionStorage.getItem(publicModeKey) === 'on'
  } catch {
    return false
  }
}

/**
 * Turns public computer mode on or off, moving the saved CVs to where they now belong (this
 * tab's sessionStorage while it is on), so nothing stays behind in the other place.
 */
export function setPublicMode(on) {
  try {
    if (on) {
      sessionStorage.setItem(publicModeKey, 'on')
      moveLibrary(localStorage, sessionStorage)
    } else {
      sessionStorage.removeItem(publicModeKey)
      moveLibrary(sessionStorage, localStorage)
    }
  } catch {
    // Storage blocked or full: the open CV is saved again by App in its new place
  }
}

// Asks the browser not to clear the saved CV when space runs low or after weeks without visits.
// Called after a download, when the CV is worth keeping, because some browsers ask the user first.
export function keepSaved() {
  navigator.storage?.persist?.().catch(() => {})
}

