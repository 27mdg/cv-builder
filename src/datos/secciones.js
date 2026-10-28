// `clave` debe coincidir con cvInicial.js y con el archivo de idioma.
// 'fechaFin' guarda el interruptor en `presente`; 'nivelHabilidad' guarda el número (1–5)
// y 'nivelIdioma' el código ('B2'), para que cada plantilla decida cómo pintarlos.
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
