import textos from '../idiomas/es.js'
import plantillas from '../plantillas/lista.js'

// Botones para elegir la plantilla del CV. La elegida sale resaltada.
// valor: id de la plantilla elegida, p. ej. 'clasica'
// alCambiar: función que recibe el id de la nueva plantilla
function SelectorPlantilla({ valor, alCambiar }) {
  return (
    <div className="selector-plantilla" role="group" aria-label={textos.plantillas.titulo}>
      <span>{textos.plantillas.titulo}</span>
      {plantillas.map((id) => (
        <button
          key={id}
          type="button"
          className={id === valor ? 'elegida' : ''}
          aria-pressed={id === valor}
          onClick={() => alCambiar(id)}
        >
          {textos.plantillas[id]}
        </button>
      ))}
    </div>
  )
}

export default SelectorPlantilla
