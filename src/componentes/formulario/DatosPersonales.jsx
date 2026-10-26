import textos from '../../idiomas/es.js'

// Campos que se muestran, en orden. El texto de cada etiqueta sale de textos.personal
const campos = ['nombre', 'puesto', 'email', 'telefono', 'ciudad']

// datos: el objeto cv.personal
// alCambiar: función que recibe (campo, valor)
function DatosPersonales({ datos, alCambiar }) {
  return (
    <fieldset>
      <legend>{textos.personal.titulo}</legend>
      {campos.map((campo) => (
        <label key={campo}>
          {textos.personal[campo]}
          <input value={datos[campo]} onChange={(e) => alCambiar(campo, e.target.value)}/>
        </label>
      ))}
    </fieldset>
  )
}

export default DatosPersonales
