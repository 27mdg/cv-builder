import texts from '../locales/es.js'

// Shared by every template, so each one only deals with layout.

/**
 * { month: '3', year: '2024' } → '03/2024' ('numeric'), 'mar 2024' ('short') or 'marzo 2024' ('long').
 * No month → '2024'. No year → ''.
 */
export function formatDate(date, dateFormat) {
  // Some sections have a single date and no end
  if (!date?.year) return ''
  if (!date.month) return date.year
  const names = texts.common.dateMonths[dateFormat]
  if (!names) return date.month.padStart(2, '0') + '/' + date.year
  return `${names[date.month - 1]} ${date.year}`
}

// '03/2021 – Presente', '2019 – 2023', just one of them, or ''
function dateRange(item, dateFormat) {
  const start = formatDate(item.start, dateFormat)
  const end = item.current ? texts.common.current : formatDate(item.end, dateFormat)
  return [start, end].filter(Boolean).join(' – ')
}

// '1995-04-12' → '12/04/1995'
export function formatBirthDate(date) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

/** The title a section has in the CV: the one the user wrote, or the usual one. */
export function sectionTitle(cv, key) {
  const custom = cv.sectionSettings?.[key]?.title
  return hasText(custom) ? custom.trim() : texts[key].title
}

// true if the text has more than whitespace
export function hasText(text) {
  return typeof text === 'string' && text.trim() !== ''
}

// join(['ana@mail.com', '', 'Madrid']) → 'ana@mail.com · Madrid'
export function join(parts, separator = ' · ') {
  return parts.filter(hasText).join(separator)
}

// Which fields of each section's items are the title and the subtitle; the rest use
// position + employer (experience, internships, activities…)
const itemTitles = {
  education: ['degree', 'school'],
  courses: ['course'],
  certificates: ['certificate'],
  projects: ['project', 'role'],
  awards: ['award', 'issuer'],
  publications: ['publication', 'publisher'],
  // Several fields: joined with commas ('Jefa de equipo, Estudio X')
  references: ['referee', ['position', 'employer']],
}

/**
 * An item split into the pieces templates place: { title, subtitle, date, place }.
 * `place` is the city, or else the link (projects) or the contact (references).
 */
export function itemParts(key, item) {
  const [title, subtitle] = itemTitles[key] ?? ['position', 'employer']
  return {
    title: item[title] ?? '',
    subtitle: Array.isArray(subtitle) ? join(subtitle.map((name) => item[name]), ', ') : (subtitle && item[subtitle]) ?? '',
    date: item.dates ?? '',
    // References have no place: their contact goes there
    place: item.city || item.link || join([item.email, item.phone]),
  }
}

// Title and detail of an item in two lines, e.g. ['Designer — Studio X', '03/2021 – Presente · Madrid']
export function itemSummary(key, item) {
  const { title, subtitle, date, place } = itemParts(key, item)
  return [join([title, subtitle], ' — '), join([date, place])]
}

// { fullName, contact: [{ type, text }], otherDetails: ['Label: value'] }, without empty ones.
// `type` (phone, email, website, address, linkedin) lets templates pick an icon.
export function personalDetails(personal) {
  const p = personal
  const address = join([p.address, join([p.postalCode, p.city], ' ')], ', ')
  const otherDetails = [
    [texts.personal.birthDate, formatBirthDate(p.birthDate)],
    [texts.personal.birthPlace, p.birthPlace],
    [texts.personal.nationality, p.nationality],
    [texts.personal.drivingLicense, p.drivingLicense],
    [texts.personal.gender, p.gender],
    [texts.personal.maritalStatus, p.maritalStatus],
    ...itemsWithContent(p.customFields).map((field) => [field.label, field.value]),
  ]
    .filter(([, value]) => hasText(value))
    .map(([label, value]) => (hasText(label) ? `${label}: ${value}` : value))

  return {
    fullName: join([p.firstName, p.lastName], ' '),
    contact: [
      { type: 'phone', text: p.phone },
      { type: 'email', text: p.email },
      { type: 'website', text: p.website },
      { type: 'linkedin', text: p.linkedin },
      { type: 'address', text: address },
    ].filter((c) => hasText(c.text)),
    otherDetails,
  }
}

// The sections that have something to show, in the user's order:
// [{ key, text }] for profile and achievements, [{ key, list }] for the rest. Sections the user
// hid (sectionSettings) are left out, and so are hidden items (`item.hidden`).
// Each dated item gets its dates already written (`dates`) in the chosen format, so the
// templates do not need to know about it.
export function filledSections(cv) {
  const withDates = (item) => (item.start ? { ...item, dates: dateRange(item, cv.design.dateFormat) } : item)
  return cv.sectionOrder
    .filter((key) => !cv.sectionSettings?.[key]?.hidden)
    .map((key) => {
      if (key === 'references' && cv.referencesOnRequest) return { key, text: texts.references.onRequestText }
      return Array.isArray(cv[key])
        ? { key, list: itemsWithContent(cv[key]).filter((item) => !item.hidden).map(withDates) }
        : { key, text: cv[key] }
    })
    .filter((section) => (section.list ? section.list.length > 0 : hasText(section.text)))
}

function hasContent(item) {
  return Object.entries(item).some(([name, value]) => {
    // `hidden` is a setting, not something the user wrote
    if (name === 'id' || name === 'hidden') return false
    if (typeof value === 'string') return hasText(value)
    if (typeof value === 'object') return value.year !== '' // a date without a year is not shown
    return Boolean(value) // `current` or a numeric level
  })
}

// Removes the items the user added but left empty
export function itemsWithContent(list) {
  return list.filter(hasContent)
}
