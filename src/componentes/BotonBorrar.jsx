import textos from '../idiomas/es.js'

// Botón para vaciar el CV y empezar de cero (útil en ordenadores compartidos).
// Antes de borrar pide confirmación.
// alBorrar: función que vacía el CV
function BotonBorrar({ alBorrar }) {
  function borrar() {
    // window.confirm muestra una ventanita del navegador con Aceptar / Cancelar
    if (window.confirm(textos.guardado.confirmar)) {
      alBorrar()
    }
  }

  return (
    <button type="button" className="boton-secundario" onClick={borrar}>
      {textos.guardado.borrar}
    </button>
  )
}

export default BotonBorrar
