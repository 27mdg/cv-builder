import textos from '../idiomas/es.js'
import { unir, tieneTexto } from '../plantillas/formato.js'
import { cvDesdeDatos, version } from './guardado.js'

// Archivos que el usuario se descarga (PDF y copia del CV) y la copia que importa.
// Todo ocurre en el navegador: los archivos nunca pasan por un servidor.

// Marca que llevan nuestros archivos, para reconocerlos al importar
const app = 'cv-gratis'

// Deja un texto listo para nombre de archivo
function limpiarNombre(texto) {
  return texto
    // Quita la extensión si el usuario la ha escrito (p. ej. 'Mi CV.pdf')
    .replace(/\.(pdf|json)$/i, '')
    // Quita los caracteres que no se permiten en nombres de archivo
    .replace(/[\\/:*?"<>|]/g, '')
    // Junta los espacios repetidos que puedan quedar
    .replace(/\s+/g, ' ')
    .trim()
}

// Nombre de los archivos, sin extensión: el que escribió el usuario en la barra superior,
// o si no hay, 'CV - Ana García López' (o 'CV' si tampoco hay nombre)
export function nombreBase(cv) {
  const elegido = limpiarNombre(cv.nombreArchivo)
  if (tieneTexto(elegido)) return elegido
  const nombre = limpiarNombre(unir([cv.personal.nombre, cv.personal.apellidos], ' '))
  const base = textos.descargar.nombreArchivo
  return tieneTexto(nombre) ? `${base} - ${nombre}` : base
}

// Descarga un Blob (un "archivo en memoria") con el nombre indicado
export function descargarBlob(blob, nombre) {
  // Dirección temporal para ese archivo y un enlace que se pulsa por código
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  enlace.click()
  // Libera la memoria cuando el navegador ya ha empezado la descarga
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Exportar: descarga una copia del CV en un archivo .json (foto incluida)
// para guardarla donde el usuario quiera y recuperarla después con Importar
export function exportarCv(cv) {
  const texto = JSON.stringify({ app, version, cv }, null, 2)
  descargarBlob(new Blob([texto], { type: 'application/json' }), nombreBase(cv) + '.json')
}

// Importar: lee el archivo .json elegido y devuelve el CV que contiene.
// Si el archivo no es nuestro o no se puede leer, lanza un error con un mensaje para el usuario.
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
