// Todos los textos visibles de la web y del PDF en español.
// Para añadir otro idioma: copiar este archivo (p. ej. en.js) y traducir los valores.
const es = {
  app: {
    titulo: 'CV Gratis',
  },
  personal: {
    titulo: 'Datos personales',
    foto: 'Foto',
    quitarFoto: 'Quitar foto',
    elegirFoto: 'Elegir foto',
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    puesto: 'Puesto de trabajo deseado',
    email: 'Correo electrónico',
    telefono: 'Teléfono',
    direccion: 'Dirección',
    codigoPostal: 'Código postal',
    localidad: 'Localidad',
    fechaNacimiento: 'Fecha de nacimiento',
    lugarNacimiento: 'Lugar de nacimiento',
    carne: 'Carné de conducir',
    genero: 'Género',
    nacionalidad: 'Nacionalidad',
    estadoCivil: 'Estado civil',
    web: 'Página web',
    linkedin: 'LinkedIn',
  },
  personalizados: {
    etiqueta: 'Nombre del campo (p. ej. Disponibilidad)',
    valor: 'Valor (p. ej. Inmediata)',
    // Botón "+" de Datos personales
    boton: 'Campo personalizado',
  },
  perfil: {
    titulo: 'Perfil',
    ayuda: 'Dos o tres frases sobre tu perfil y lo que buscas.',
  },
  logros: {
    titulo: 'Logros',
    ayuda: 'Escribe tus logros, uno por línea.',
  },
  // Textos que usan varias secciones
  comun: {
    quitar: 'Quitar',
    descripcion: 'Descripción',
    plegar: 'Plegar o desplegar la sección',
    presente: 'Presente',
    mes: 'Mes',
    anio: 'Año',
    meses: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ],
    elegir: 'Elige…',
    // El número (1–5) es lo que se guarda
    nivelesHabilidad: {
      1: 'Principiante',
      2: 'Básico',
      3: 'Intermedio',
      4: 'Avanzado',
      5: 'Experto',
    },
    // El código de la izquierda es lo que se guarda
    nivelesIdioma: {
      nativo: 'Nativo',
      C2: 'C2 – Maestría',
      C1: 'C1 – Avanzado',
      B2: 'B2 – Intermedio alto',
      B1: 'B1 – Intermedio',
      A2: 'A2 – Básico',
      A1: 'A1 – Principiante',
    },
  },
  // Etiquetas de campos que se repiten en varias secciones.
  // Una sección puede poner la suya propia con el mismo nombre.
  campos: {
    puesto: 'Puesto',
    empleador: 'Empleador',
    localidad: 'Localidad',
    inicio: 'Inicio',
    fin: 'Fin',
    descripcion: 'Descripción',
  },
  formacion: {
    titulo: 'Formación',
    formacion: 'Formación',
    centro: 'Centro de estudios',
    anadir: '+ Añadir formación',
  },
  experiencia: {
    titulo: 'Experiencia',
    descripcion: 'Qué hacías y qué lograste',
    anadir: '+ Añadir experiencia',
  },
  habilidades: {
    titulo: 'Habilidades',
    habilidad: 'Habilidad',
    nivel: 'Nivel',
    anadir: '+ Añadir habilidad',
  },
  idiomas: {
    titulo: 'Idiomas',
    idioma: 'Idioma',
    nivel: 'Nivel',
    anadir: '+ Añadir idioma',
  },
  aficiones: {
    titulo: 'Aficiones e intereses',
    interes: 'Interés',
    anadir: '+ Añadir interés',
  },
  cursos: {
    titulo: 'Cursos',
    curso: 'Curso',
    anadir: '+ Añadir curso',
  },
  practicas: {
    titulo: 'Prácticas',
    anadir: '+ Añadir prácticas',
  },
  actividades: {
    titulo: 'Actividades extracurriculares',
    anadir: '+ Añadir actividad',
  },
  certificados: {
    titulo: 'Certificados',
    certificado: 'Certificado',
    anadir: '+ Añadir certificado',
  },
  aptitudes: {
    titulo: 'Aptitudes',
    aptitud: 'Aptitud',
    anadir: '+ Añadir aptitud',
  },
  vistaPrevia: {
    cargando: 'Cargando vista previa…',
  },
  descargar: {
    boton: 'Descargar',
    generando: 'Generando PDF…',
    error: 'No se ha podido generar el PDF. Inténtalo de nuevo.',
    nombreArchivo: 'CV',
  },
  herramientas: {
    plantillas: 'Plantillas',
    fuente: 'Fuente',
    espaciado: 'Espaciado',
    colores: 'Colores',
    pantallaCompleta: 'Pantalla completa',
    salirPantallaCompleta: 'Salir de pantalla completa (Esc)',
    proximamente: 'Próximamente',
    tamanoFuente: 'Tamaño de fuente',
    altoLinea: 'Alto de línea',
    espaciadoParrafos: 'Espaciado entre párrafos',
    espaciadoSecciones: 'Espaciado entre secciones',
    margenes: 'Márgenes de página',
    // "Arimo (tipo Arial)": fuente libre parecida a una de pago
    tipo: 'tipo',
    // Pasos de los deslizadores, del 1 al 5
    pasos: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // Nombres de las combinaciones de colores (los ids están en src/datos/diseno.js)
  nombresColores: {
    'azul': 'Azul marino',
    'verde-azulado': 'Verde azulado',
    'rojo': 'Rojo',
    'verde': 'Verde',
    'ocre': 'Ocre',
    'morado': 'Morado',
    'salmon-oscuro': 'Salmón sobre negro',
    'celeste-oscuro': 'Celeste sobre negro',
    'propio': 'Color personalizado',
  },
  plantillas: {
    clasica: 'Clásica',
    moderna: 'Moderna',
    // Títulos que solo usa alguna plantilla
    contacto: 'Contacto',
  },
  archivo: {
    nombre: 'Nombre del archivo',
    importar: 'Importar',
    exportar: 'Exportar',
    confirmarImportar: 'Se sustituirá el CV actual por el del archivo. ¿Continuar?',
    errorNoValido: 'Este archivo no es un CV de CV Gratis.',
    errorVersion: 'Este archivo es de una versión de CV Gratis que no se puede abrir.',
  },
  guardado: {
    aviso: 'Tus datos se guardan solo en este navegador y no se envían a ningún servidor. Con «Exportar» puedes guardar una copia en tu equipo.',
  },
}

export default es
