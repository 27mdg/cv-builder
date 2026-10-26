// Opciones de diseño del CV (barra de herramientas: Fuente, Espaciado y Colores)
// y su traducción a números que entienden las plantillas.
// Este archivo no importa la librería de PDF, así los menús cargan rápido.

// Fuentes disponibles. Todas con licencia libre y servidas desde nuestra propia web.
// id: lo que se guarda en el CV · nombre: lo que se ve en el menú
// pista: fuente de pago a la que se parece (se muestra "Arimo (tipo Arial)")
// familia: nombre de la fuente en el PDF · css: cómo se pinta su nombre en el menú
export const fuentes = [
  { id: 'helvetica', nombre: 'Helvetica', familia: 'Helvetica', css: 'Helvetica, Arial, sans-serif' },
]

// Valores de los pasos 1–5 de los deslizadores (XS, S, M, L, XL). El 3 (M) es el normal.
// Son multiplicadores: cada plantilla los aplica a sus propias medidas.
export const pasos = {
  tamano: [0.85, 0.92, 1, 1.08, 1.16],
  parrafos: [0.35, 0.65, 1, 1.5, 2],
  secciones: [0.4, 0.7, 1, 1.4, 1.8],
  margenes: [0.5, 0.75, 1, 1.3, 1.6],
}

// Alto de línea: mínimo, máximo y salto del deslizador
export const altoLinea = { minimo: 1, maximo: 2, salto: 0.05 }

// Combinaciones de colores.
// principal: títulos, rayas y puntitos · lateral: fondo del lateral (plantillas con lateral)
// oscuro: true si el lateral es oscuro (entonces su texto va en claro para que se lea)
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

// Mezcla un color con blanco: cantidad 0 = el mismo color, 1 = blanco.
// Sirve para sacar un fondo muy claro a partir de un color elegido a mano.
export function aclarar(hex, cantidad) {
  const canales = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const claros = canales.map((c) => Math.round(c + (255 - c) * cantidad))
  return '#' + claros.map((c) => c.toString(16).padStart(2, '0')).join('')
}

// Colores que usa la plantilla según lo elegido.
// colorPorDefecto: id de la combinación propia de cada plantilla (si el usuario no elige)
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

// Números concretos para las plantillas a partir de lo elegido en la barra de herramientas.
// diseno: cv.diseno · colorPorDefecto: ver coloresDe
export function valoresDiseno(diseno, colorPorDefecto) {
  const fuente = fuentes.find((f) => f.id === diseno.fuente) ?? fuentes[0]
  // Si un valor guardado no es válido, se usa el normal (1)
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
