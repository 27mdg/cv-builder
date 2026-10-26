import { Font } from '@react-pdf/renderer'
import { fuentes } from '../datos/diseno.js'

// Da de alta en react-pdf las fuentes de src/datos/diseno.js, para poder usarlas en el PDF.
// Los archivos vienen de los paquetes @fontsource (licencia libre OFL) y se sirven desde
// nuestra propia web: no se pide nada a Google ni a otros servidores.
// Solo se descarga una fuente cuando un PDF la usa.

// Direcciones de todos los archivos .woff (subconjunto latino: español y Europa occidental),
// normal (400) y negrita (700). `?url` le pide a Vite la dirección del archivo.
const archivos = import.meta.glob('/node_modules/@fontsource/*/files/*-latin-{400,700}-normal.woff', {
  query: '?url',
  import: 'default',
  eager: true,
})

// Busca la dirección de un archivo, p. ej. archivo('lato', 700)
function archivo(id, grosor) {
  return archivos[`/node_modules/@fontsource/${id}/files/${id}-latin-${grosor}-normal.woff`]
}

for (const fuente of fuentes) {
  // Helvetica ya viene dentro de todos los lectores de PDF
  if (fuente.id === 'helvetica') continue
  Font.register({
    family: fuente.familia,
    fonts: [
      { src: archivo(fuente.id, 400) },
      { src: archivo(fuente.id, 700), fontWeight: 'bold' },
    ],
  })
}
