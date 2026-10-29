import initialCv from './initialCv.js'
import templates from '../templates/list.js'

// Only in localStorage: the data never leaves the browser (GDPR).

const storageKey = 'cv-gratis'
// Bump it when the shape of the data changes, to recognise (and convert) old CVs.
// Exported files use it too.
export const version = 2

// Keeps the saved order, drops unknown keys and adds sections that did not exist yet at the
// end, so older or hand-edited CVs never lose a section
function normalizeOrder(order) {
  const known = initialCv.sectionOrder
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
  cv.sectionOrder = normalizeOrder(cv.sectionOrder)
  if (typeof cv.sectionSettings !== 'object' || cv.sectionSettings === null || Array.isArray(cv.sectionSettings)) {
    cv.sectionSettings = {}
  }
  // Templates can be removed (e.g. the first 'classic' and 'modern')
  if (!templates.some((t) => t.id === cv.template)) {
    cv.template = initialCv.template
  }
  return cv
}

// The saved CV, or an empty one if there is none or it is broken
export function loadCv() {
  try {
    const text = localStorage.getItem(storageKey)
    if (!text) return initialCv
    return cvFromData(JSON.parse(text)) ?? initialCv
  } catch {
    // Broken text or a browser that does not allow localStorage
    return initialCv
  }
}

export function saveCv(cv) {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ version, cv }))
  } catch {
    // Private mode or storage full: the site keeps working, just without saving
  }
}
