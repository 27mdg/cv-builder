import initialCv from './initialCv.js'
import { cvFromData, keyPrefix, libraryKeys, oldKey, store, version } from './storage.js'
import { baseName } from './file.js'

// Several CVs, each under its own key, so saving writes only the open one (as fast as with one):
//   cv-gratis:index      { version, current: id, list: [{ id, updated, name }] }  (list order = shown order)
//   cv-gratis:cv:<id>    { version, cv }
// Version 2 kept a single CV under 'cv-gratis'; it becomes the first CV of the list.

const indexKey = `${keyPrefix}index`
const cvKey = (id) => `${keyPrefix}cv:${id}`

function newId() {
  return crypto.randomUUID().slice(0, 8)
}

function read(key) {
  try {
    const text = store().getItem(key)
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

function isFull(error) {
  // Each browser names it its own way
  return error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || error?.code === 22 || error?.code === 1014
}

// 'ok', 'full' (the browser's space for this site has run out) or 'blocked' (no storage at all,
// e.g. some private windows: the site works, just without saving)
function write(key, value) {
  try {
    store().setItem(key, JSON.stringify(value))
    return 'ok'
  } catch (error) {
    return isFull(error) ? 'full' : 'blocked'
  }
}

function readIndex() {
  const index = read(indexKey)
  if (!Array.isArray(index?.list)) return null
  const list = index.list.filter((entry) => typeof entry?.id === 'string')
  return { current: index.current, list }
}

function writeIndex(index) {
  return write(indexKey, { version, ...index })
}

// The version 2 CV, written in the new way. The old key goes only once the new copy reads back
// exactly the same, so a failure (storage full, tab closed halfway) never loses it.
function migrate(cv) {
  const id = newId()
  if (write(cvKey(id), { version, cv }) !== 'ok') return { id, cv }
  if (writeIndex({ current: id, list: [entryFor(id, cv)] }) !== 'ok') return { id, cv }
  const back = cvFromData(read(cvKey(id)))
  if (back && JSON.stringify(back) === JSON.stringify(cv)) {
    try {
      store().removeItem(oldKey)
    } catch {
      // Kept: the index already points to the new copy, so the old one is never read again
    }
  }
  return { id, cv }
}

/**
 * The CV to open: the last one used, else the first one that reads well, else the version 2 CV
 * (converted), else a new empty one. Returns { id, cv }.
 */
export function loadLibrary() {
  const index = readIndex()
  if (index) {
    const ids = [index.current, ...index.list.map((entry) => entry.id)]
    for (const id of ids) {
      const cv = cvFromData(read(cvKey(id)))
      if (cv) return { id, cv }
    }
  }
  const old = cvFromData(read(oldKey))
  if (old) return migrate(old)
  return { id: newId(), cv: initialCv }
}

/** Deletes every saved CV from where they live now (public mode: this tab's sessionStorage). */
export function clearLibrary() {
  try {
    const storage = store()
    for (const key of libraryKeys(storage)) storage.removeItem(key)
  } catch {
    // Storage blocked: there was nothing saved
  }
}

// What the list shows of a CV, kept in the index so the list never reads every CV (photos)
function entryFor(id, cv) {
  return { id, updated: Date.now(), name: baseName(cv) }
}

/** Saves the open CV and marks it as the last one used. Returns 'ok', 'full' or 'blocked'. */
export function saveOpenCv(id, cv) {
  const saved = write(cvKey(id), { version, cv })
  if (saved !== 'ok') return saved
  const index = readIndex() ?? { list: [] }
  const entry = entryFor(id, cv)
  const list = index.list.some((other) => other.id === id)
    ? index.list.map((other) => (other.id === id ? entry : other))
    : [...index.list, entry]
  return writeIndex({ current: id, list })
}

/** The saved CVs as the «Mis CV» list shows them: [{ id, updated, name }]. */
export function listCvs() {
  return readIndex()?.list ?? []
}

/** A saved CV, complete and checked, or null. */
export function readCv(id) {
  return cvFromData(read(cvKey(id)))
}

/** Saves a new CV at the end of the list and makes it the open one. Returns { id, status }. */
export function createCv(cv) {
  const id = newId()
  return { id, status: saveOpenCv(id, cv) }
}

/** Deletes one CV; returns what restoreCv needs to bring it back («Deshacer»). */
export function deleteCv(id) {
  const index = readIndex() ?? { list: [] }
  const position = index.list.findIndex((entry) => entry.id === id)
  const removed = { entry: index.list[position], data: read(cvKey(id)), position }
  try {
    store().removeItem(cvKey(id))
  } catch {
    // Storage blocked: nothing to delete
  }
  writeIndex({ current: index.current, list: index.list.filter((entry) => entry.id !== id) })
  return removed
}

/** Puts a deleted CV back where it was in the list. */
export function restoreCv({ entry, data, position }) {
  if (!entry || !data) return
  write(cvKey(entry.id), data)
  const index = readIndex() ?? { list: [] }
  const list = index.list.filter((other) => other.id !== entry.id)
  list.splice(Math.max(position, 0), 0, entry)
  writeIndex({ current: index.current, list })
}
