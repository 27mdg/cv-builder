import textos from '../idiomas/es.js'
import { exportarCv } from '../datos/archivo.js'

// Botón que descarga una copia del CV (.json) para recuperarla después con "Importar".
// cv: todos los datos del CV
function BotonExportar({ cv }) {
  return (
    <button type="button" className="boton-secundario" onClick={() => exportarCv(cv)}>
      {textos.archivo.exportar}
    </button>
  )
}

export default BotonExportar
