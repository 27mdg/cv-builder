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
  habilidades: {
    titulo: 'Habilidades',
  },
  idiomas: {
    titulo: 'Idiomas',
  },
}

export default es
