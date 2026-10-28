import textos from '../idiomas/es.js'
import { exportarCv } from '../datos/archivo.js'

function BotonExportar({ cv }) {
  return (
    <button type="button" className="boton-secundario" onClick={() => exportarCv(cv)}>
      {textos.archivo.exportar}
    </button>
  )
}

export default BotonExportar
