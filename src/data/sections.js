// Rarely used sections: hidden until the user adds them, so the form starts short
export const optionalSections = [
  'hobbies', 'courses', 'internships', 'activities', 'certificates', 'qualities', 'achievements',
  'projects',
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
]

export default sections
