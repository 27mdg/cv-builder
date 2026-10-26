// Todos los textos visibles de la web y del PDF en español.
// Para añadir otro idioma: copiar este archivo (p. ej. en.js) y traducir los valores.
const es = {
  app: {
    titulo: 'CV Gratis',
  },
  personal: {
    titulo: 'Datos personales',
    nombre: 'Nombre',
    puesto: 'Puesto',
    email: 'Email',
    telefono: 'Teléfono',
    ciudad: 'Ciudad',
  },
  resumen: {
    titulo: 'Sobre mí',
    ayuda: 'Dos o tres frases sobre tu perfil y lo que buscas.',
  },
  // Textos que usan varias secciones
  comun: {
    quitar: 'Quitar',
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
}

export default es
