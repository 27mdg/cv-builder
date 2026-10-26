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
  formacion: [],
  experiencia: [],
  habilidades: [],
  idiomas: [],
  aficiones: [],
  cursos: [],
  practicas: [],
  actividades: [],
  certificados: [],
  aptitudes: [],
}

export default cvInicial
