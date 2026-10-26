// Forma de los datos de un CV vacío.
// Las listas empiezan vacías y se rellenan con los botones "Añadir".
const cvInicial = {
  // Plantilla elegida (ver src/plantillas/lista.js)
  plantilla: 'clasica',
  // Nombre de los archivos que se descargan; vacío = automático ('CV - Nombre Apellidos')
  nombreArchivo: '',
  // Diseño elegido en la barra de herramientas (ver src/datos/diseno.js)
  diseno: {
    fuente: 'helvetica',
    tamano: 3, // 1–5: XS, S, M, L, XL (3 = normal)
    altoLinea: 1.4,
    parrafos: 3, // espacio entre elementos, 1–5
    secciones: 3, // espacio entre secciones, 1–5
    margenes: 3, // márgenes de la página, 1–5
    color: '', // id de la combinación de colores; '' = la de cada plantilla; 'propio' = colorPropio
    colorPropio: '', // color elegido a mano, p. ej. '#c0392b'
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
