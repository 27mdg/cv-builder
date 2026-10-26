import textos from '../idiomas/es.js'

// Funciones que convierten los datos del CV en textos listos para el PDF.
// Las usan todas las plantillas, así cada plantilla solo se ocupa del diseño.

// { mes: '3', anio: '2024' } → '03/2024'. Sin mes → '2024'. Sin año → ''
export function formatearFecha(fecha) {
  if (!fecha.anio) return ''
  if (!fecha.mes) return fecha.anio
  return fecha.mes.padStart(2, '0') + '/' + fecha.anio
}

// Fechas de un elemento: '03/2021 – Presente', '2019 – 2023', solo una de las dos, o ''
export function rangoFechas(item) {
  const inicio = formatearFecha(item.inicio)
  const fin = item.presente ? textos.comun.presente : formatearFecha(item.fin)
  // filter(Boolean) quita los textos vacíos
  return [inicio, fin].filter(Boolean).join(' – ')
}

// '1995-04-12' → '12/04/1995'
export function formatearNacimiento(fecha) {
  if (!fecha) return ''
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}

// true si el texto tiene algo más que espacios
export function tieneTexto(texto) {
  return typeof texto === 'string' && texto.trim() !== ''
}

// Junta varios textos con un separador saltándose los vacíos:
// unir(['ana@mail.com', '', 'Madrid']) → 'ana@mail.com · Madrid'
export function unir(partes, separador = ' · ') {
  return partes.filter(tieneTexto).join(separador)
}

// Un elemento tiene contenido si algún campo tiene algo escrito o elegido
function tieneContenido(item) {
  return Object.entries(item).some(([nombre, valor]) => {
    if (nombre === 'id') return false
    if (typeof valor === 'string') return tieneTexto(valor)
    if (typeof valor === 'object') return valor.anio !== '' // una fecha sin año no se muestra
    return Boolean(valor) // `presente` o un nivel numérico
  })
}

// Quita de una lista los elementos que el usuario ha añadido pero dejado vacíos
export function elementosConContenido(lista) {
  return lista.filter(tieneContenido)
}
