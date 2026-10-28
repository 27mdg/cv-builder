import { useState } from 'react'
import textos from '../idiomas/es.js'

function BotonDescargar({ cv }) {
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState(false)

  async function descargar() {
    setGenerando(true)
    setError(false)
    try {
      // import(): la librería de PDF pesa mucho y solo se carga al pulsar
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
