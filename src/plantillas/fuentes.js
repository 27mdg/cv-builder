import { Font } from '@react-pdf/renderer'
import { fuentes } from '../datos/diseno.js'

// Los archivos salen de @fontsource (OFL) y se sirven desde nuestra web, nunca desde
// Google Fonts (RGPD). react-pdf solo descarga una fuente cuando un PDF la usa.

// Solo el subconjunto latino: idiomas fuera de Europa occidental necesitarán otro.
// `?url` hace que Vite devuelva la dirección del archivo en vez de su contenido.
const archivos = import.meta.glob('/node_modules/@fontsource/*/files/*-latin-{400,700}-normal.woff', {
  query: '?url',
  import: 'default',
  eager: true,
})

function archivo(id, grosor) {
  return archivos[`/node_modules/@fontsource/${id}/files/${id}-latin-${grosor}-normal.woff`]
}

for (const fuente of fuentes) {
  // Helvetica viene incluida en todos los lectores de PDF
  if (fuente.id === 'helvetica') continue
  Font.register({
    family: fuente.familia,
    fonts: [
      { src: archivo(fuente.id, 400) },
      { src: archivo(fuente.id, 700), fontWeight: 'bold' },
    ],
  })
}
