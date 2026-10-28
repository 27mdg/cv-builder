import cvInicial from './cvInicial.js'

// Solo en localStorage: los datos no salen del navegador (RGPD).

const clave = 'cv-gratis'
// Subirlo si cambia la forma de los datos, para reconocer (y convertir) los CV antiguos.
// Lo usan también los archivos exportados.
export const version = 1

// { version, cv } → CV completo, o null si no vale (localStorage o archivo importado)
export function cvDesdeDatos(datos) {
  if (datos?.version !== version || typeof datos.cv?.personal !== 'object') return null
  // Se mezcla con cvInicial: si añadimos campos nuevos en el futuro,
  // los CV guardados antes los tendrán (vacíos) y no se romperá nada
  const cv = {
    ...cvInicial,
    ...datos.cv,
    personal: { ...cvInicial.personal, ...datos.cv.personal },
    diseno: { ...cvInicial.diseno, ...datos.cv.diseno },
  }
  // Por si el archivo se ha tocado a mano: las listas tienen que ser listas
  for (const nombre of Object.keys(cvInicial)) {
    if (Array.isArray(cvInicial[nombre]) && !Array.isArray(cv[nombre])) {
      cv[nombre] = []
    }
  }
  if (!Array.isArray(cv.personal.personalizados)) {
    cv.personal.personalizados = []
  }
  return cv
}

// El CV guardado, o uno vacío si no hay nada o está estropeado
export function cargarCv() {
  try {
    const texto = localStorage.getItem(clave)
    if (!texto) return cvInicial
    return cvDesdeDatos(JSON.parse(texto)) ?? cvInicial
  } catch {
    // Texto estropeado o navegador que no deja usar localStorage
    return cvInicial
  }
}

export function guardarCv(cv) {
  try {
    localStorage.setItem(clave, JSON.stringify({ version, cv }))
  } catch {
    // Modo incógnito o almacenamiento lleno: la web sigue funcionando, solo que sin guardar
  }
}
