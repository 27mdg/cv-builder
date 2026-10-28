import texts from '../locales/es.js'
import templates, { templateInfo } from './list.js'
import './fonts.js'

// Every file in designs/ is a template whose id is its file name, so adding one
// does not require importing it here.
const files = import.meta.glob('./designs/*.jsx', { eager: true, import: 'default' })
const components = Object.fromEntries(
  Object.entries(files).map(([path, component]) => [path.match(/([^/]+)\.jsx$/)[1], component]),
)

if (import.meta.env.DEV) {
  for (const { id } of templates) {
    if (!components[id]) console.warn(`Template "${id}" is in list.js but has no file in designs/`)
    if (!texts.templates[id]) console.warn(`Template "${id}" has no name in es.js (texts.templates)`)
  }
}

// Shared by preview, download and thumbnails, so they always match
export function cvDocument(cv) {
  const template = templateInfo(cv.template)
  const Template = components[template.id]
  return <Template cv={cv} template={template}/>
}
