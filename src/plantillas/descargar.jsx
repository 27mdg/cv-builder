import { pdf } from '@react-pdf/renderer'
import textos from '../idiomas/es.js'
import Clasica from './Clasica.jsx'
import { unir, tieneTexto } from './formato.js'

// Este archivo importa la librería de PDF (pesa mucho), así que la web
// lo carga solo cuando el usuario pulsa "Descargar".

// 'CV - Ana García López.pdf', o 'CV.pdf' si no hay nombre
export function nombreArchivo(cv) {
  const nombre = unir([cv.personal.nombre, cv.personal.apellidos], ' ')
    // Quita los caracteres que no se permiten en nombres de archivo
    .replace(/[\\/:*?"<>|]/g, '')
    // Junta los espacios repetidos que puedan quedar
    .replace(/\s+/g, ' ')
    .trim()
  const base = textos.descargar.nombreArchivo
  return (tieneTexto(nombre) ? `${base} - ${nombre}` : base) + '.pdf'
}

// Genera el PDF con los datos actuales y lo descarga
export async function descargarPdf(cv) {
  // Blob: el PDF como un "archivo en memoria"
  const blob = await pdf(<Clasica cv={cv}/>).toBlob()
  // Dirección temporal para ese archivo y un enlace que se pulsa por código
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo(cv)
  enlace.click()
  // Libera la memoria cuando el navegador ya ha empezado la descarga
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
