import textos from '../../idiomas/es.js'
import { IconoFlecha } from '../Iconos.jsx'

// <details> pliega y despliega sin JavaScript ni estado
function Seccion({ titulo, abierta, children }) {
  return (
    <details className="seccion" open={abierta}>
      <summary>
        <h2>{titulo}</h2>
        <span className="seccion-flecha" title={textos.comun.plegar}><IconoFlecha/></span>
      </summary>
      <div className="seccion-contenido">{children}</div>
    </details>
  )
}

export default Seccion
