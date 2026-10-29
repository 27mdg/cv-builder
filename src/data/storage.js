import initialCv from './initialCv.js'
import { isCustomKey } from './sections.js'
import templates from '../templates/list.js'

// Only in the browser (localStorage, or sessionStorage in public computer mode): the data never
// leaves it (GDPR).

const storageKey = 'cv-gratis'
// Bump it when the shape of the data changes, to recognise (and convert) old CVs.
// Exported files use it too.
export const version = 2

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
  if (data?.version !== version || typeof data.cv?.personal !== 'object') return null
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
  return cv
}

// Public computer mode (libraries, job centres…): the CV lives only in this tab's sessionStorage,
// which the browser clears when the tab closes, and nothing stays in localStorage.
const publicModeKey = 'cv-gratis-public'

function store() {
  return isPublicMode() ? sessionStorage : localStorage
}

export function isPublicMode() {
  try {
    return sessionStorage.getItem(publicModeKey) === 'on'
  } catch {
    return false
  }
}

/**
 * Turns public computer mode on or off and deletes the copy in the other place. The next
 * saveCv() writes the CV where it now belongs.
 */
export function setPublicMode(on) {
  try {
    if (on) {
      sessionStorage.setItem(publicModeKey, 'on')
      localStorage.removeItem(storageKey)
    } else {
      sessionStorage.removeItem(publicModeKey)
      sessionStorage.removeItem(storageKey)
    }
  } catch {
    // Storage blocked: nothing was saved anyway
  }
}

// The saved CV, or an empty one if there is none or it is broken
export function loadCv() {
  try {
    const text = store().getItem(storageKey)
    if (!text) return initialCv
    return cvFromData(JSON.parse(text)) ?? initialCv
  } catch {
    // Broken text or a browser that does not allow localStorage
    return initialCv
  }
}

// Asks the browser not to clear the saved CV when space runs low or after weeks without visits.
// Called after a download, when the CV is worth keeping, because some browsers ask the user first.
export function keepSaved() {
  navigator.storage?.persist?.().catch(() => {})
}

export function saveCv(cv) {
  try {
    store().setItem(storageKey, JSON.stringify({ version, cv }))
  } catch {
    // Private mode or storage full: the site keeps working, just without saving
  }
}
