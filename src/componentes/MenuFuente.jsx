import textos from '../idiomas/es.js'
import { fuentes } from '../datos/diseno.js'
import Deslizador from './Deslizador.jsx'
// Para que cada nombre de la lista se vea con su propia letra. Se sirven desde nuestra
// web (RGPD) y el navegador solo las descarga al abrir este menú.
import '@fontsource/arimo/400.css'
import '@fontsource/carlito/400.css'
import '@fontsource/cousine/400.css'
import '@fontsource/eb-garamond/400.css'
import '@fontsource/gelasio/400.css'
import '@fontsource/lato/400.css'
import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-serif/400.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/poppins/400.css'
import '@fontsource/roboto/400.css'
import '@fontsource/tinos/400.css'

function MenuFuente({ diseno, alCambiar }) {
  return (
    <div className="menu-diseno">
      <Deslizador
        titulo={textos.herramientas.tamanoFuente}
        texto={textos.herramientas.pasos[diseno.tamano - 1]}
        valor={diseno.tamano}
        minimo={1}
        maximo={5}
        alCambiar={(valor) => alCambiar('tamano', valor)}
      />
      <p className="menu-subtitulo">{textos.herramientas.fuente}</p>
      <div className="lista-fuentes">
        {fuentes.map((fuente) => (
          <button
            key={fuente.id}
            type="button"
            className={fuente.id === diseno.fuente ? 'elegida' : ''}
            aria-pressed={fuente.id === diseno.fuente}
            style={{ fontFamily: fuente.css }}
            onClick={() => alCambiar('fuente', fuente.id)}
          >
            {fuente.pista ? `${fuente.nombre} (${textos.herramientas.tipo} ${fuente.pista})` : fuente.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MenuFuente
