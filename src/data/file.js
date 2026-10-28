import texts from '../locales/es.js'
import { join, hasText } from '../templates/format.js'
import { cvFromData, version } from './storage.js'

// Everything happens in the browser: files never go through a server (GDPR).

// Marker to recognise our files on import
const app = 'cv-gratis'

function cleanName(text) {
  return text
    // The user may have typed the extension ('My CV.pdf'); it is added later
    .replace(/\.(pdf|json)$/i, '')
    // Characters Windows does not allow in file names
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Name without extension: the user's choice, or 'CV - First Last', or 'CV'
export function baseName(cv) {
  const chosen = cleanName(cv.fileName)
  if (hasText(chosen)) return chosen
  const name = cleanName(join([cv.personal.firstName, cv.personal.lastName], ' '))
  const base = texts.download.fileName
  return hasText(name) ? `${base} - ${name}` : base
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  // Revoking it straight away can cut the download short in some browsers
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Copy of the CV as .json, photo included, to restore with Import
export function exportCv(cv) {
  const text = JSON.stringify({ app, version, cv }, null, 2)
  downloadBlob(new Blob([text], { type: 'application/json' }), baseName(cv) + '.json')
}

// Returns the CV in the file; if invalid, throws an Error with the message for the user
export async function readFile(file) {
  let data
  try {
    data = JSON.parse(await file.text())
  } catch {
    throw new Error(texts.file.errorInvalid)
  }
  if (data?.app !== app) {
    throw new Error(texts.file.errorInvalid)
  }
  const cv = cvFromData(data)
  if (!cv) {
    throw new Error(texts.file.errorVersion)
  }
  return cv
}
