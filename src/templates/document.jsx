import Classic from './Classic.jsx'
import Modern from './Modern.jsx'
import templates from './list.js'
import './fonts.js'

// To add a template: create its file, add it here, in list.js and in es.js.
const components = {
  classic: Classic,
  modern: Modern,
}

// Shared by preview and download, so the downloaded PDF matches what is shown
export function cvDocument(cv) {
  const Template = components[cv.template] ?? components[templates[0]]
  return <Template cv={cv}/>
}
