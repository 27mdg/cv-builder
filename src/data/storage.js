import initialCv from './initialCv.js'

// Only in localStorage: the data never leaves the browser (GDPR).

const storageKey = 'cv-gratis'
// Bump it when the shape of the data changes, to recognise (and convert) old CVs.
// Exported files use it too.
export const version = 2

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
