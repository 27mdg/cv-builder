// Basque. For now only the CV's own texts (the PDF); the site itself is translated later.

// Basque writes the year first, with -ko or -eko as the number is read aloud: 2020ko (hogei),
// 2021eko (hogeita bat), 2011ko (hamaika), 2015eko (hamabost), 2010eko (hamar).
function yearOf(year) {
  const n = Number(year) % 100
  const units = n % 10
  const tens = Math.floor(n / 10)
  const eko = n % 20 === 10 || units === 5 || (units === 1 && tens % 2 === 0)
  return `${year}${eko ? 'eko' : 'ko'}`
}

export default {
  sectionTitles: {
    profile: 'Profila',
    achievements: 'Lorpenak',
    education: 'Prestakuntza',
    experience: 'Lan-esperientzia',
    skills: 'Trebetasunak',
    languages: 'Hizkuntzak',
    hobbies: 'Zaletasunak eta interesak',
    courses: 'Ikastaroak',
    internships: 'Praktikak',
    activities: 'Eskolaz kanpoko jarduerak',
    certificates: 'Ziurtagiriak',
    qualities: 'Ezaugarri pertsonalak',
    projects: 'Proiektuak',
    volunteering: 'Boluntariotza',
    awards: 'Sariak',
    publications: 'Argitalpenak',
    references: 'Erreferentziak',
  },
  personal: {
    title: 'Datu pertsonalak',
    email: 'Helbide elektronikoa',
    phone: 'Telefonoa',
    address: 'Helbidea',
    city: 'Herria',
    birthDate: 'Jaiotze-data',
    birthPlace: 'Jaioterria',
    drivingLicense: 'Gidabaimena',
    gender: 'Generoa',
    nationality: 'Nazionalitatea',
    maritalStatus: 'Egoera zibila',
    availability: 'Eskuragarritasuna',
    ownVehicle: 'Ibilgailu propioa',
    workPermit: 'Lan-baimena',
    idNumber: 'NAN/AIZ',
    travel: 'Bidaiatzeko prest',
    disability: 'Aitortutako desgaitasuna',
  },
  links: { types: { portfolio: 'Portfolioa', website: 'Webgunea', other: 'Beste esteka bat' } },
  common: {
    contact: 'Harremanetarako',
    current: 'Gaur egun',
    monthYear: (month, year) => `${yearOf(year)} ${month}`,
    dateMonths: {
      short: ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'],
      long: ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'],
    },
    skillLevels: { 1: 'Hasiberria', 2: 'Oinarrizkoa', 3: 'Ertaina', 4: 'Aurreratua', 5: 'Aditua' },
    schedules: { fullTime: 'Lanaldi osoa', partTime: 'Lanaldi erdia', freelance: 'Autonomoa', internship: 'Praktikak', temporary: 'Aldi baterakoa' },
    workModes: { onsite: 'Aurrez aurre', remote: 'Urrutitik', hybrid: 'Hibridoa' },
    languageLevels: {
      native: 'Ama-hizkuntza',
      C2: 'C2 – Maisutasuna',
      C1: 'C1 – Aurreratua',
      B2: 'B2 – Erdi-maila altua',
      B1: 'B1 – Erdi-maila',
      A2: 'A2 – Oinarrizkoa',
      A1: 'A1 – Hasiberria',
    },
  },
  datePicker: { order: 'ymd', separator: '/' },
  references: { onRequestText: 'Erreferentziak eskatuz gero emango dira.' },
  customSection: { untitled: 'Atal pertsonalizatua' },
}
