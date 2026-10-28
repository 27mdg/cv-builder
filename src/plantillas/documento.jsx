import Clasica from './Clasica.jsx'
import Moderna from './Moderna.jsx'
import plantillas from './lista.js'
import './fuentes.js'

// Para añadir una plantilla: crear su archivo, ponerla aquí, en lista.js y en es.js.
const componentes = {
  clasica: Clasica,
  moderna: Moderna,
}

// Común a vista previa y descarga, para que el PDF descargado sea igual al que se ve
export function documentoPdf(cv) {
  const Plantilla = componentes[cv.plantilla] ?? componentes[plantillas[0]]
  return <Plantilla cv={cv}/>
}
