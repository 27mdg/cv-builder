import initialCv from '../data/initialCv.js'
import { profileOrder } from '../data/start.js'

// Made-up CV used to draw the template thumbnails and opened by «Ver un CV de ejemplo». It is
// visible text, so it lives with the locale; the photo is added at runtime (data/samplePhoto.js).
// It follows the form's own advice (descriptions start with a verb and give numbers), since
// people copy what they see.
const date = (month, year) => ({ month, year })

const sampleCv = {
  ...initialCv,
  // Eight years of work: her jobs go before her studies, as the start card advises
  sectionOrder: profileOrder('experienced', initialCv.sectionOrder),
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
  profile: 'Diseñadora gráfica con ocho años de experiencia en identidad de marca y diseño editorial. Convierto ideas complejas en piezas claras y cuidadas, y disfruto trabajando codo con codo con clientes y equipos.',
  experience: [
    {
      id: 'e1', position: 'Diseñadora sénior', employer: 'Estudio Lumen', city: 'Valencia',
      start: date('3', '2021'), end: date('', ''), current: true,
      description: '- Dirigí la identidad visual de **12 proyectos** para museos y festivales.\n- Coordino un equipo de 3 diseñadores y reviso cada entrega antes de enviarla.',
    },
    {
      id: 'e2', position: 'Diseñadora gráfica', employer: 'Editorial Brisa', city: 'Madrid',
      start: date('9', '2017'), end: date('2', '2021'), current: false,
      description: '- Maqueté más de 40 libros y 2 revistas mensuales.\n- Rediseñé las campañas digitales y subí un 25 % las visitas a la tienda en línea.',
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
    { id: 's4', skill: 'Tipografía', level: 5 },
    { id: 's5', skill: 'Diseño de interfaces', level: 4 },
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
