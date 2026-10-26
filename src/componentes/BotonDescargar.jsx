import { useState } from 'react'
import textos from '../idiomas/es.js'

// Botón que genera el PDF con los datos actuales y lo descarga.
// cv: todos los datos del CV
function BotonDescargar({ cv }) {
  // generando: true mientras se crea el PDF (el botón se desactiva)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState(false)

  async function descargar() {
    setGenerando(true)
    setError(false)
    try {
      // import(): carga la librería de PDF solo ahora, al pulsar
      const { descargarPdf } = await import('../plantillas/descargar.jsx')
      await descargarPdf(cv)
    } catch (e) {
      console.error(e)
      setError(true)
    }
    setGenerando(false)
  }

  return (
    <div className="descargar">
      {error && <span className="descargar-error">{textos.descargar.error}</span>}
      <button type="button" onClick={descargar} disabled={generando}>
        {generando ? textos.descargar.generando : textos.descargar.boton}
      </button>
    </div>
  )
}

export default BotonDescargar
