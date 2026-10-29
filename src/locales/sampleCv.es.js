import initialCv from '../data/initialCv.js'

// Made-up CV used to draw the template thumbnails. It is visible text, so it lives with
// the locale; the photo is added at runtime (see TemplateThumbnail.jsx).
const date = (month, year) => ({ month, year })

const sampleCv = {
  ...initialCv,
  personal: {
    ...initialCv.personal,
    firstName: 'Lucía',
    lastName: 'Romero Vidal',
    jobTitle: 'Diseñadora gráfica',
    email: 'lucia.romero@correo.es',
    phone: '600 123 456',
    city: 'Valencia',
    links: [{ id: 'web', type: 'portfolio', url: 'luciaromero.es' }],
    birthDate: '1994-05-18',
    nationality: 'Española',
    drivingLicense: 'B',
  },
  profile: 'Diseñadora con ocho años de experiencia en identidad de marca y diseño editorial. Me gusta convertir ideas complejas en piezas claras y cuidadas.',
  experience: [
    {
      id: 'e1', position: 'Diseñadora sénior', employer: 'Estudio Lumen', city: 'Valencia',
      start: date('3', '2021'), end: date('', ''), current: true,
      description: 'Dirección de proyectos de identidad visual para clientes del sector cultural.',
    },
    {
      id: 'e2', position: 'Diseñadora gráfica', employer: 'Editorial Brisa', city: 'Madrid',
      start: date('9', '2017'), end: date('2', '2021'), current: false,
      description: 'Maquetación de revistas y libros, y diseño de campañas digitales.',
    },
  ],
  education: [
    {
      id: 'f1', degree: 'Grado en Bellas Artes', school: 'Universidad de Valencia', city: 'Valencia',
      start: date('', '2012'), end: date('', '2016'), current: false, description: '',
    },
  ],
  courses: [
    { id: 'c1', course: 'Tipografía aplicada', start: date('', '2019'), end: date('', ''), current: false, description: '' },
  ],
  skills: [
    { id: 's1', skill: 'Identidad de marca', level: 5 },
    { id: 's2', skill: 'Diseño editorial', level: 4 },
    { id: 's3', skill: 'Ilustración', level: 3 },
  ],
  languages: [
    { id: 'l1', language: 'Español', level: 'native' },
    { id: 'l2', language: 'Inglés', level: 'C1' },
  ],
  hobbies: [
    { id: 'h1', interest: 'Fotografía' },
    { id: 'h2', interest: 'Senderismo' },
  ],
  qualities: [
    { id: 'q1', quality: 'Creatividad' },
    { id: 'q2', quality: 'Trabajo en equipo' },
  ],
}

export default sampleCv
