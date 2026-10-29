// Rarely used sections: hidden until the user adds them, so the form starts short
export const optionalSections = [
  'hobbies', 'courses', 'internships', 'activities', 'certificates', 'qualities', 'achievements',
  'projects', 'volunteering', 'awards', 'publications', 'references',
]

// Sections the user creates, as many as they want. Each one is stored like any other section:
// its content in cv['custom:<id>'] (a list, or a text), its title in cv.sectionSettings.
const customPrefix = 'custom:'

export function isCustomKey(key) {
  return key.startsWith(customPrefix)
}

export function newCustomKey() {
  return customPrefix + crypto.randomUUID().slice(0, 8)
}

// The items of a custom list section
export const customFields = [
  { name: 'title', type: 'text' },
  { name: 'subtitle', type: 'text' },
  { name: 'city', type: 'text' },
  { name: 'start', type: 'date' },
  { name: 'end', type: 'endDate' },
  { name: 'description', type: 'longText' },
]

// `key` must match initialCv.js and the locale file.
// 'endDate' stores its switch in `current`; 'skillLevel' stores the number (1–5)
// and 'languageLevel' the code ('B2'), so each template decides how to draw them.
const jobFields = [
  { name: 'position', type: 'text' },
  { name: 'employer', type: 'text' },
  { name: 'city', type: 'text' },
  { name: 'start', type: 'date' },
  { name: 'end', type: 'endDate' },
  { name: 'description', type: 'longText' },
]

const sections = [
  {
    key: 'education',
    fields: [
      { name: 'degree', type: 'text' },
      { name: 'school', type: 'text' },
      { name: 'city', type: 'text' },
      { name: 'start', type: 'date' },
      { name: 'end', type: 'endDate' },
      { name: 'description', type: 'longText' },
    ],
  },
  { key: 'experience', fields: jobFields },
  {
    key: 'skills',
    fields: [
      { name: 'skill', type: 'text' },
      { name: 'level', type: 'skillLevel' },
    ],
  },
  {
    key: 'languages',
    fields: [
      { name: 'language', type: 'text' },
      { name: 'level', type: 'languageLevel' },
    ],
  },
  { key: 'hobbies', fields: [{ name: 'interest', type: 'text' }] },
  {
    key: 'courses',
    fields: [
      { name: 'course', type: 'text' },
      { name: 'start', type: 'date' },
      { name: 'end', type: 'endDate' },
      { name: 'description', type: 'longText' },
    ],
  },
  { key: 'internships', fields: jobFields },
  { key: 'activities', fields: jobFields },
  { key: 'volunteering', fields: jobFields },
  {
    key: 'awards',
    fields: [
      { name: 'award', type: 'text' },
      { name: 'issuer', type: 'text' },
      // A single date: no end and no "Presente"
      { name: 'start', type: 'date' },
      { name: 'description', type: 'longText' },
    ],
  },
  {
    key: 'certificates',
    fields: [
      { name: 'certificate', type: 'text' },
      { name: 'start', type: 'date' },
      { name: 'end', type: 'endDate' },
      { name: 'description', type: 'longText' },
    ],
  },
  { key: 'qualities', fields: [{ name: 'quality', type: 'text' }] },
  {
    key: 'projects',
    fields: [
      { name: 'project', type: 'text' },
      { name: 'role', type: 'text' },
      { name: 'start', type: 'date' },
      { name: 'end', type: 'endDate' },
      { name: 'link', type: 'text' },
      { name: 'description', type: 'longText' },
    ],
  },
  {
    key: 'publications',
    fields: [
      { name: 'publication', type: 'text' },
      { name: 'publisher', type: 'text' },
      { name: 'start', type: 'date' },
      { name: 'link', type: 'text' },
      { name: 'description', type: 'longText' },
    ],
  },
  {
    key: 'references',
    fields: [
      { name: 'referee', type: 'text' },
      { name: 'position', type: 'text' },
      { name: 'employer', type: 'text' },
      { name: 'email', type: 'text' },
      { name: 'phone', type: 'text' },
    ],
  },
]

export default sections
