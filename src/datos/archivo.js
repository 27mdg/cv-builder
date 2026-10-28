import textos from '../idiomas/es.js'
import { unir, tieneTexto } from '../plantillas/formato.js'
import { cvDesdeDatos, version } from './guardado.js'

// Todo ocurre en el navegador: los archivos nunca pasan por un servidor (RGPD).

// Marca para reconocer nuestros archivos al importar
const app = 'cv-gratis'

function limpiarNombre(texto) {
  return texto
    // El usuario puede haber escrito la extensión ('Mi CV.pdf'); se añade después
    .replace(/\.(pdf|json)$/i, '')
    // Caracteres que Windows no permite en nombres de archivo
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Nombre sin extensión: el elegido por el usuario, o 'CV - Nombre Apellidos', o 'CV'
export function nombreBase(cv) {
  const elegido = limpiarNombre(cv.nombreArchivo)
  if (tieneTexto(elegido)) return elegido
  const nombre = limpiarNombre(unir([cv.personal.nombre, cv.personal.apellidos], ' '))
  const base = textos.descargar.nombreArchivo
  return tieneTexto(nombre) ? `${base} - ${nombre}` : base
}

export function descargarBlob(blob, nombre) {
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  enlace.click()
  // Revocarla en el acto puede cortar la descarga en algunos navegadores
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Copia del CV en .json, foto incluida, para recuperarla con Importar
export function exportarCv(cv) {
  const texto = JSON.stringify({ app, version, cv }, null, 2)
  descargarBlob(new Blob([texto], { type: 'application/json' }), nombreBase(cv) + '.json')
}

// Devuelve el CV del archivo; si no vale, lanza un Error con el mensaje para el usuario
export async function leerArchivo(archivo) {
  let datos
  try {
    datos = JSON.parse(await archivo.text())
  } catch {
    throw new Error(textos.archivo.errorNoValido)
  }
  if (datos?.app !== app) {
    throw new Error(textos.archivo.errorNoValido)
  }
  const cv = cvDesdeDatos(datos)
  if (!cv) {
    throw new Error(textos.archivo.errorVersion)
  }
  return cv
}
