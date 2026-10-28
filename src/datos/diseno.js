// Este archivo no importa la librería de PDF, así los menús cargan rápido.

// Solo fuentes libres, servidas desde nuestra web (RGPD). `pista`: la fuente de pago a la
// que se parece, para el menú ("Arimo (tipo Arial)").
// Para añadir una: `npm install @fontsource/<id>`, añadirla aquí y su CSS en MenuFuente.jsx.
export const fuentes = [
  // Helvetica viene dentro de todos los lectores de PDF: no hay que añadir ningún archivo
  { id: 'helvetica', nombre: 'Helvetica', familia: 'Helvetica', css: 'Helvetica, Arial, sans-serif' },
  { id: 'arimo', nombre: 'Arimo', pista: 'Arial', familia: 'Arimo', css: "'Arimo', sans-serif" },
  { id: 'carlito', nombre: 'Carlito', pista: 'Calibri', familia: 'Carlito', css: "'Carlito', sans-serif" },
  { id: 'cousine', nombre: 'Cousine', pista: 'Courier New', familia: 'Cousine', css: "'Cousine', monospace" },
  { id: 'eb-garamond', nombre: 'EB Garamond', familia: 'EB Garamond', css: "'EB Garamond', serif" },
  { id: 'gelasio', nombre: 'Gelasio', pista: 'Georgia', familia: 'Gelasio', css: "'Gelasio', serif" },
  { id: 'lato', nombre: 'Lato', familia: 'Lato', css: "'Lato', sans-serif" },
  { id: 'noto-sans', nombre: 'Noto Sans', familia: 'Noto Sans', css: "'Noto Sans', sans-serif" },
  { id: 'noto-serif', nombre: 'Noto Serif', familia: 'Noto Serif', css: "'Noto Serif', serif" },
  { id: 'open-sans', nombre: 'Open Sans', familia: 'Open Sans', css: "'Open Sans', sans-serif" },
  { id: 'poppins', nombre: 'Poppins', familia: 'Poppins', css: "'Poppins', sans-serif" },
  { id: 'roboto', nombre: 'Roboto', familia: 'Roboto', css: "'Roboto', sans-serif" },
  { id: 'tinos', nombre: 'Tinos', pista: 'Times New Roman', familia: 'Tinos', css: "'Tinos', serif" },
]

// La fuente elegida en el CV (si no existe, la primera)
export function fuenteDe(diseno) {
  return fuentes.find((f) => f.id === diseno.fuente) ?? fuentes[0]
}

// Multiplicadores de los pasos 1–5 (el 3 es el normal); cada plantilla los aplica a sus medidas
export const pasos = {
  tamano: [0.85, 0.92, 1, 1.08, 1.16],
  parrafos: [0.35, 0.65, 1, 1.5, 2],
  secciones: [0.4, 0.7, 1, 1.4, 1.8],
  margenes: [0.5, 0.75, 1, 1.3, 1.6],
}

export const altoLinea = { minimo: 1, maximo: 2, salto: 0.05 }

// `oscuro`: el lateral es oscuro y su texto tiene que ir en claro para que se lea
export const colores = [
  { id: 'azul', principal: '#1f4e79', lateral: '#e6edf4' },
  { id: 'verde-azulado', principal: '#2c5f5d', lateral: '#e8f0ef' },
  { id: 'rojo', principal: '#a33b3b', lateral: '#f6e8e8' },
  { id: 'verde', principal: '#2f6b41', lateral: '#e6f1e9' },
  { id: 'ocre', principal: '#b06d27', lateral: '#f7eee3' },
  { id: 'morado', principal: '#5b4a8b', lateral: '#ece9f4' },
  { id: 'salmon-oscuro', principal: '#e08a6c', lateral: '#232323', oscuro: true },
  { id: 'celeste-oscuro', principal: '#8bb8de', lateral: '#1f2633', oscuro: true },
]

// Mezcla un color con blanco: cantidad 0 = el mismo color, 1 = blanco
export function aclarar(hex, cantidad) {
  const canales = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const claros = canales.map((c) => Math.round(c + (255 - c) * cantidad))
  return '#' + claros.map((c) => c.toString(16).padStart(2, '0')).join('')
}

function coloresDe(diseno, colorPorDefecto) {
  let combinacion
  if (diseno.color === 'propio' && /^#[0-9a-f]{6}$/i.test(diseno.colorPropio)) {
    combinacion = { principal: diseno.colorPropio, lateral: aclarar(diseno.colorPropio, 0.88) }
  } else {
    combinacion = colores.find((c) => c.id === diseno.color) ?? colores.find((c) => c.id === colorPorDefecto)
  }
  return {
    principal: combinacion.principal,
    lateral: combinacion.lateral,
    textoLateral: combinacion.oscuro ? '#f2f2f2' : '#222',
    textoSuaveLateral: combinacion.oscuro ? '#b8b8b8' : '#666',
  }
}

// Convierte cv.diseno en los números que usan las plantillas
export function valoresDiseno(diseno, colorPorDefecto) {
  const fuente = fuenteDe(diseno)
  // Un valor guardado no válido (archivo importado a mano) se trata como el normal
  const paso = (lista, n) => lista[n - 1] ?? 1
  return {
    fuente: fuente.familia,
    escala: paso(pasos.tamano, diseno.tamano),
    altoLinea: diseno.altoLinea,
    parrafos: paso(pasos.parrafos, diseno.parrafos),
    secciones: paso(pasos.secciones, diseno.secciones),
    margenes: paso(pasos.margenes, diseno.margenes),
    ...coloresDe(diseno, colorPorDefecto),
  }
}
