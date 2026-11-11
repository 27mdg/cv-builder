const initialCv = {
  template: 'arch',
  // Empty = automatic ('CV - First Last')
  fileName: '',
  design: {
    font: '', // '' = the template's own
    // size, paragraphs, sections and margins go from 1 to 5; 3 is normal
    size: 3,
    lineHeight: 1.4,
    paragraphs: 3,
    sections: 3,
    margins: 3,
    color: '', // '' = each template's own; 'custom' = customColor
    customColor: '',
    dateFormat: 'numeric', // 'numeric' (03/2024), 'short' (mar 2024) or 'long' (marzo 2024)
  },
  personal: {
    photo: '', // already resized, as a data URL
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    birthDate: '', // 'YYYY-MM-DD'
    birthPlace: '',
    drivingLicense: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    // Common in Spanish CVs
    availability: '',
    ownVehicle: '',
    workPermit: '',
    idNumber: '',
    travel: '',
    disability: '', // recognised disability, free text ('33 %'): each country measures it its own way
    links: [], // { id, type (see texts.links.types), url }
    customFields: [], // { id, label, value }
  },
  profile: '',
  // The fields of each item are in sections.js
  education: [],
  experience: [],
  skills: [],
  languages: [],
  hobbies: [],
  courses: [],
  internships: [],
  activities: [],
  certificates: [],
  qualities: [],
  projects: [],
  volunteering: [],
  awards: [],
  publications: [],
  references: [],
  // true: the CV only says that references are available on request, without the list
  referencesOnRequest: false,
  achievements: '',
  // Drawn or uploaded as a PNG data URL; `date` as 'YYYY-MM-DD'. Goes at the end of the CV.
  signature: { image: '', place: '', date: '' },
  // Small text at the bottom of every page (e.g. the data protection clause)
  footer: '',
  // Per section: { hidden: true } leaves it out of the PDF without deleting it.
  // Skill levels start hidden: the dots are drawings that CV-reading software cannot read, and
  // recruiters distrust self-ratings. Saved CVs keep their own settings (storage.js).
  sectionSettings: { skills: { hideLevel: true } },
  // Order of every section except the personal details, which always go first.
  // The user changes it by dragging the sections in the form; templates follow it.
  sectionOrder: [
    'profile', 'education', 'experience', 'skills', 'languages', 'hobbies',
    'courses', 'internships', 'activities', 'certificates', 'qualities', 'achievements',
    'projects', 'volunteering', 'awards', 'publications', 'references',
  ],
}

export default initialCv
