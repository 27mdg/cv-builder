import { Font } from '@react-pdf/renderer'
import { fonts } from '../data/design.js'

// The files come from @fontsource (OFL) and are served from our own site, never from
// Google Fonts (GDPR). react-pdf only downloads a font when a PDF uses it.

// Latin subset only: languages outside Western Europe will need another one.
// `?url` makes Vite return the file's address instead of its content.
const files = import.meta.glob('/node_modules/@fontsource/*/files/*-latin-{400,700}-normal.woff', {
  query: '?url',
  import: 'default',
  eager: true,
})

function file(id, weight) {
  return files[`/node_modules/@fontsource/${id}/files/${id}-latin-${weight}-normal.woff`]
}

for (const font of fonts) {
  // Helvetica is built into every PDF reader
  if (font.id === 'helvetica') continue
  Font.register({
    family: font.family,
    fonts: [
      { src: file(font.id, 400) },
      { src: file(font.id, 700), fontWeight: 'bold' },
    ],
  })
}
