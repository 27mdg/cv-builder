import initialCv from './initialCv.js'
import { isCustomKey } from './sections.js'

// Starting points of the «¿Cómo empiezas?» card. `order`: the sections that go first;
// `add`: optional sections opened for the user, since they matter most for that profile.
// Students and recent graduates lead with their studies, people with experience with their
// jobs, and career changers with what they can do and the training that backs it.
export const profiles = {
  student: {
    order: ['profile', 'education', 'internships', 'experience', 'skills', 'languages'],
    add: ['internships', 'courses', 'activities', 'volunteering'],
  },
  experienced: {
    order: ['profile', 'experience', 'education', 'skills', 'languages'],
    add: [],
  },
  careerChange: {
    order: ['profile', 'skills', 'experience', 'courses', 'certificates', 'education'],
    add: ['courses', 'certificates', 'projects'],
  },
}

/** The section order a profile gives: its own first, then the usual one, custom sections last. */
export function profileOrder(id, currentOrder) {
  const first = profiles[id].order
  return [
    ...first,
    ...initialCv.sectionOrder.filter((key) => !first.includes(key)),
    ...currentOrder.filter(isCustomKey),
  ]
}

// The look and settings of a CV, which say nothing about the person
const settings = ['template', 'language', 'fileName', 'design', 'sectionSettings', 'sectionOrder', 'anonymous']

function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim() === ''
  if (typeof value === 'object' && value !== null) return Object.values(value).every(isEmpty)
  return !value
}

/** Whether the user has not written anything in this CV yet (look and settings don't count). */
export function isBlankCv(cv) {
  return Object.entries(cv).every(([key, value]) => settings.includes(key) || isEmpty(value))
}
