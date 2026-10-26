// Forma de los datos de un CV vacío.
// Las listas empiezan vacías y se rellenan con los botones "Añadir".
const cvInicial = {
  personal: {
    nombre: '',
    puesto: '',
    email: '',
    telefono: '',
    ciudad: '',
  },
  resumen: '',
  // Listas: los campos de cada elemento están en secciones.js
  experiencia: [],
  // Cada elemento: { titulo, centro, inicio, fin }
  educacion: [],
  // Cada elemento: un texto, por ejemplo 'JavaScript'
  habilidades: [],
  // Cada elemento: { idioma, nivel }
  idiomas: [],
}

export default cvInicial
