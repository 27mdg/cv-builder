import textos from '../../idiomas/es.js'
import { IconoFlecha } from '../Iconos.jsx'

// Sección del formulario que se pliega y despliega al pulsar el título.
// <details> y <summary> son etiquetas de HTML que ya hacen esto solas.
// titulo: texto del título
// abierta: si es true, la sección empieza desplegada
// children: lo que va dentro de la sección
function Seccion({ titulo, abierta, children }) {
  return (
    <details className="seccion" open={abierta}>
      <summary>
        <h2>{titulo}</h2>
        {/* Círculo con flecha; el CSS la gira cuando la sección está abierta */}
        <span className="seccion-flecha" title={textos.comun.plegar}><IconoFlecha/></span>
      </summary>
      <div className="seccion-contenido">{children}</div>
    </details>
  )
}

export default Seccion
