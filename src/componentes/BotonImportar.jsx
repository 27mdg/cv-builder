import { useRef, useState } from 'react'
import textos from '../idiomas/es.js'
import cvInicial from '../datos/cvInicial.js'
import { leerArchivo } from '../datos/archivo.js'

// Haber elegido plantilla no cuenta como datos que se puedan perder
function tieneDatos(cv) {
  return JSON.stringify({ ...cv, plantilla: cvInicial.plantilla }) !== JSON.stringify(cvInicial)
}

function BotonImportar({ cvActual, alImportar }) {
  const selector = useRef(null)
  const [error, setError] = useState('')

  async function elegido(e) {
    const archivo = e.target.files[0]
    // Vacía el selector para poder volver a elegir el mismo archivo
    e.target.value = ''
    if (!archivo) return
    setError('')
    try {
      const cv = await leerArchivo(archivo)
      if (tieneDatos(cvActual) && !window.confirm(textos.archivo.confirmarImportar)) return
      alImportar(cv)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="importar">
      {error && <span className="mensaje-error">{error}</span>}
      <button type="button" className="boton-secundario" onClick={() => selector.current.click()}>
        {textos.archivo.importar}
      </button>
      <input ref={selector} type="file" accept=".json,application/json" hidden onChange={elegido}/>
    </div>
  )
}

export default BotonImportar
