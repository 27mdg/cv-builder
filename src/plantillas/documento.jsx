import Clasica from './Clasica.jsx'
import Moderna from './Moderna.jsx'
import plantillas from './lista.js'
// Da de alta las fuentes del PDF (solo hace falta importarlo una vez)
import './fuentes.js'

// Qué componente corresponde a cada plantilla de lista.js.
// Para añadir una plantilla: crear su archivo, ponerla aquí, en lista.js y en es.js.
const componentes = {
  clasica: Clasica,
  moderna: Moderna,
}

// Documento PDF del CV con la plantilla elegida (si no existe, la primera de la lista).
// Lo usan la vista previa y la descarga.
export function documentoPdf(cv) {
  const Plantilla = componentes[cv.plantilla] ?? componentes[plantillas[0]]
  return <Plantilla cv={cv}/>
}
