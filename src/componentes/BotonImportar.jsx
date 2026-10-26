import { useRef, useState } from 'react'
import textos from '../idiomas/es.js'
import cvInicial from '../datos/cvInicial.js'
import { leerArchivo } from '../datos/archivo.js'

// true si el CV tiene algo escrito (la plantilla elegida no cuenta)
function tieneDatos(cv) {
  return JSON.stringify({ ...cv, plantilla: cvInicial.plantilla }) !== JSON.stringify(cvInicial)
}

// Botón para cargar un CV guardado antes con "Exportar".
// cvActual: el CV que hay ahora (para avisar antes de sustituirlo)
// alImportar: función que recibe el CV leído del archivo
function BotonImportar({ cvActual, alImportar }) {
  // useRef: una referencia al <input type="file"> oculto, para "pulsarlo" desde el botón
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
      // window.confirm muestra una ventanita del navegador con Aceptar / Cancelar
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
