import cvInicial from './cvInicial.js'

// Guarda el CV en el localStorage del navegador: un "cajón" de textos que sigue ahí
// aunque se cierre la web. Solo lo ve este navegador; nada se envía a ningún servidor.

// Nombre del cajón
const clave = 'cv-gratis'
// Si algún día cambia la forma de los datos, se sube este número para reconocer
// (y convertir) los CV guardados con la forma antigua. Lo usan también los archivos exportados.
export const version = 1

// Revisa unos datos guardados ({ version, cv }) y devuelve un CV completo,
// o null si no valen. Se usa al cargar del navegador y al importar un archivo.
export function cvDesdeDatos(datos) {
  if (datos?.version !== version || typeof datos.cv?.personal !== 'object') return null
  // Se mezcla con cvInicial: si añadimos campos nuevos en el futuro,
  // los CV guardados antes los tendrán (vacíos) y no se romperá nada
  const cv = {
    ...cvInicial,
    ...datos.cv,
    personal: { ...cvInicial.personal, ...datos.cv.personal },
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

// Devuelve el CV guardado, o uno vacío si no hay nada o está estropeado
export function cargarCv() {
  try {
    const texto = localStorage.getItem(clave)
    if (!texto) return cvInicial
    return cvDesdeDatos(JSON.parse(texto)) ?? cvInicial
  } catch {
    // Texto estropeado o navegador que no deja usar el cajón
    return cvInicial
  }
}

// Guarda el CV como texto (JSON)
export function guardarCv(cv) {
  try {
    localStorage.setItem(clave, JSON.stringify({ version, cv }))
  } catch {
    // Modo incógnito o cajón lleno: la web sigue funcionando, solo que sin guardar
  }
}
