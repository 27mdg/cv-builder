// The only list of templates, in the order of the picker; the first one is the default.
// Separate from document.jsx so the toolbar does not load the PDF library.
// To add a template: create src/templates/designs/<id>.jsx, add a line here and its name in es.js.
// defaultColor: an id from `colors` and defaultFont: an id from `fonts` (src/data/design.js).
const templates = [
  { id: 'arch', defaultColor: 'taupe', defaultFont: 'arimo' },
  { id: 'banner', defaultColor: 'navy', defaultFont: 'poppins' },
]

export function templateInfo(id) {
  return templates.find((t) => t.id === id) ?? templates[0]
}

export default templates
