const cvInicial = {
  plantilla: 'clasica',
  // Vacío = automático ('CV - Nombre Apellidos')
  nombreArchivo: '',
  diseno: {
    fuente: 'helvetica',
    // tamano, parrafos, secciones y margenes van de 1 a 5; el 3 es el normal
    tamano: 3,
    altoLinea: 1.4,
    parrafos: 3,
    secciones: 3,
    margenes: 3,
    color: '', // '' = el de cada plantilla; 'propio' = colorPropio
    colorPropio: '',
  },
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
    personalizados: [], // { id, etiqueta, valor }
  },
  perfil: '',
  // Los campos de cada elemento están en secciones.js
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
