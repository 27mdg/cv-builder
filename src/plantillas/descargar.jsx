import { pdf } from '@react-pdf/renderer'
import { documentoPdf } from './documento.jsx'
import { nombreBase, descargarBlob } from '../datos/archivo.js'

// Este archivo importa la librería de PDF (pesa mucho), así que la web
// lo carga solo cuando el usuario pulsa "Descargar".

// Genera el PDF con los datos actuales y lo descarga
export async function descargarPdf(cv) {
  // Blob: el PDF como un "archivo en memoria"
  const blob = await pdf(documentoPdf(cv)).toBlob()
  descargarBlob(blob, nombreBase(cv) + '.pdf')
}
