import { pdf } from '@react-pdf/renderer'
import { documentoPdf } from './documento.jsx'
import { nombreBase, descargarBlob } from '../datos/archivo.js'

// La librería de PDF pesa mucho: este archivo se carga solo al pulsar "Descargar".

export async function descargarPdf(cv) {
  const blob = await pdf(documentoPdf(cv)).toBlob()
  descargarBlob(blob, nombreBase(cv) + '.pdf')
}
