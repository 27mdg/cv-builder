// Secciones del formulario que son listas (con botones Añadir / Quitar).
// clave: nombre de la sección en cvInicial.js y en el archivo de idioma.
// campos: los campos de cada elemento, en orden. Tipos:
//   'texto'      una línea
//   'textoLargo' varias líneas
//   'fecha'      mes (opcional) + año
//   'fechaFin'   mes + año con interruptor "Presente" (se guarda en `presente`)
const secciones = [
  {
    clave: 'experiencia',
    campos: [
      { nombre: 'puesto', tipo: 'texto' },
      { nombre: 'empleador', tipo: 'texto' },
      { nombre: 'localidad', tipo: 'texto' },
      { nombre: 'inicio', tipo: 'fecha' },
      { nombre: 'fin', tipo: 'fechaFin' },
      { nombre: 'descripcion', tipo: 'textoLargo' },
    ],
  },
]

export default secciones
