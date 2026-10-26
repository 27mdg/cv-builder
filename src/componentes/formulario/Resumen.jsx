import textos from '../../idiomas/es.js'

// valor: el texto de cv.resumen
// alCambiar: función que recibe el nuevo texto
function Resumen({ valor, alCambiar }) {
  return (
    <fieldset>
      <legend>{textos.resumen.titulo}</legend>
      <textarea
        rows={5}
        placeholder={textos.resumen.ayuda}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
      />
    </fieldset>
  )
}

export default Resumen
