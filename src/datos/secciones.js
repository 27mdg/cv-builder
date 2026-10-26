// Secciones del formulario que son listas (con botones Añadir / Quitar).
// clave: nombre de la sección en cvInicial.js y en el archivo de idioma.
// campos: los campos de cada elemento, en orden. Tipos:
//   'texto'      una línea
//   'textoLargo' varias líneas
//   'fecha'      mes (opcional) + año
//   'fechaFin'   mes + año con interruptor "Presente" (se guarda en `presente`)
//   'nivelHabilidad' desplegable 1–5 (se guarda el número)
//   'nivelIdioma'    desplegable Nativo, C2 … A1 (se guarda el código, p. ej. 'B2')

// Campos comunes a Experiencia, Prácticas y Actividades extracurriculares
const camposPuesto = [
  { nombre: 'puesto', tipo: 'texto' },
  { nombre: 'empleador', tipo: 'texto' },
  { nombre: 'localidad', tipo: 'texto' },
  { nombre: 'inicio', tipo: 'fecha' },
  { nombre: 'fin', tipo: 'fechaFin' },
  { nombre: 'descripcion', tipo: 'textoLargo' },
]

const secciones = [
  {
    clave: 'formacion',
    campos: [
      { nombre: 'formacion', tipo: 'texto' },
      { nombre: 'centro', tipo: 'texto' },
      { nombre: 'localidad', tipo: 'texto' },
      { nombre: 'inicio', tipo: 'fecha' },
      { nombre: 'fin', tipo: 'fechaFin' },
      { nombre: 'descripcion', tipo: 'textoLargo' },
    ],
  },
  { clave: 'experiencia', campos: camposPuesto },
  {
    clave: 'habilidades',
    campos: [
      { nombre: 'habilidad', tipo: 'texto' },
      { nombre: 'nivel', tipo: 'nivelHabilidad' },
    ],
  },
  {
    clave: 'idiomas',
    campos: [
      { nombre: 'idioma', tipo: 'texto' },
      { nombre: 'nivel', tipo: 'nivelIdioma' },
    ],
  },
  { clave: 'aficiones', campos: [{ nombre: 'interes', tipo: 'texto' }] },
  {
    clave: 'cursos',
    campos: [
      { nombre: 'curso', tipo: 'texto' },
      { nombre: 'inicio', tipo: 'fecha' },
      { nombre: 'fin', tipo: 'fechaFin' },
      { nombre: 'descripcion', tipo: 'textoLargo' },
    ],
  },
  { clave: 'practicas', campos: camposPuesto },
  { clave: 'actividades', campos: camposPuesto },
  {
    clave: 'certificados',
    campos: [
      { nombre: 'certificado', tipo: 'texto' },
      { nombre: 'inicio', tipo: 'fecha' },
      { nombre: 'fin', tipo: 'fechaFin' },
      { nombre: 'descripcion', tipo: 'textoLargo' },
    ],
  },
  { clave: 'aptitudes', campos: [{ nombre: 'aptitud', tipo: 'texto' }] },
]

export default secciones
