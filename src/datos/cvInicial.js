// Forma de los datos de un CV vacío.
// Las listas empiezan vacías y se rellenan con los botones "Añadir".
const cvInicial = {
  personal: {
    foto: '', // imagen ya reducida, como texto (data URL)
    nombre: '',
    apellidos: '',
    puesto: '',
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
    localidad: '',
    fechaNacimiento: '', // formato 'AAAA-MM-DD'
    lugarNacimiento: '',
    carne: '',
    genero: '',
    nacionalidad: '',
    estadoCivil: '',
    web: '',
    linkedin: '',
    // Cada elemento: { id, etiqueta, valor }
    personalizados: [],
  },
  perfil: '',
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
  logros: '',
}

export default cvInicial
