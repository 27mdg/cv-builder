import textos from '../idiomas/es.js'

// Común a todas las plantillas, para que cada una solo se ocupe del diseño.

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

// Título y detalle de un elemento de las secciones con fechas, p. ej.
// ['Diseñadora — Estudio X', '03/2021 – Presente · Madrid']
export function resumenElemento(clave, item) {
  if (clave === 'formacion') {
    return [unir([item.formacion, item.centro], ' — '), unir([rangoFechas(item), item.localidad])]
  }
  if (clave === 'cursos') return [item.curso, rangoFechas(item)]
  if (clave === 'certificados') return [item.certificado, rangoFechas(item)]
  return [unir([item.puesto, item.empleador], ' — '), unir([rangoFechas(item), item.localidad])]
}

// { nombreCompleto, contacto: [textos], otrosDatos: ['Etiqueta: valor'] }, sin vacíos
export function datosPersonales(personal) {
  const p = personal
  const direccion = unir([p.direccion, unir([p.codigoPostal, p.localidad], ' ')], ', ')
  const otrosDatos = [
    [textos.personal.fechaNacimiento, formatearNacimiento(p.fechaNacimiento)],
    [textos.personal.lugarNacimiento, p.lugarNacimiento],
    [textos.personal.nacionalidad, p.nacionalidad],
    [textos.personal.carne, p.carne],
    [textos.personal.genero, p.genero],
    [textos.personal.estadoCivil, p.estadoCivil],
    ...elementosConContenido(p.personalizados).map((campo) => [campo.etiqueta, campo.valor]),
  ]
    .filter(([, valor]) => tieneTexto(valor))
    .map(([etiqueta, valor]) => (tieneTexto(etiqueta) ? `${etiqueta}: ${valor}` : valor))

  return {
    nombreCompleto: unir([p.nombre, p.apellidos], ' '),
    contacto: [p.email, p.telefono, direccion, p.web, p.linkedin].filter(tieneTexto),
    otrosDatos,
  }
}

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
