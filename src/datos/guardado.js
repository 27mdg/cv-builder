import cvInicial from './cvInicial.js'

// Guarda el CV en el localStorage del navegador: un "cajón" de textos que sigue ahí
// aunque se cierre la web. Solo lo ve este navegador; nada se envía a ningún servidor.

// Nombre del cajón
const clave = 'cv-gratis'
// Si algún día cambia la forma de los datos, se sube este número para reconocer
// (y convertir) los CV guardados con la forma antigua
const version = 1

// Devuelve el CV guardado, o uno vacío si no hay nada o está estropeado
export function cargarCv() {
  try {
    const texto = localStorage.getItem(clave)
    if (!texto) return cvInicial
    const guardado = JSON.parse(texto)
    if (guardado.version !== version) return cvInicial
    // Se mezcla con cvInicial: si añadimos campos nuevos en el futuro,
    // los CV guardados antes los tendrán (vacíos) y no se romperá nada
    return {
      ...cvInicial,
      ...guardado.cv,
      personal: { ...cvInicial.personal, ...guardado.cv.personal },
    }
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
