import textos from '../../idiomas/es.js'

// Campos de una línea de cada experiencia. La descripción va aparte (textarea)
const campos = ['puesto', 'empresa', 'inicio', 'fin']

// lista: el array cv.experiencia
// alCambiar: función que recibe la lista nueva entera
function Experiencia({ lista, alCambiar }) {
  function anadir() {
    // id: identificador único para que React sepa qué bloque es cada uno
    const nueva = { id: crypto.randomUUID(), puesto: '', empresa: '', inicio: '', fin: '', descripcion: '' }
    alCambiar([...lista, nueva])
  }

  function quitar(id) {
    alCambiar(lista.filter((item) => item.id !== id))
  }

  // Cambia un campo de un solo elemento y deja los demás igual
  function cambiar(id, campo, valor) {
    alCambiar(lista.map((item) => (item.id === id ? { ...item, [campo]: valor } : item)))
  }

  return (
    <fieldset>
      <legend>{textos.experiencia.titulo}</legend>
      {lista.map((item) => (
        <div className="bloque" key={item.id}>
          {campos.map((campo) => (
            <label key={campo}>
              {textos.experiencia[campo]}
              <input value={item[campo]} onChange={(e) => cambiar(item.id, campo, e.target.value)}/>
            </label>
          ))}
          <label>
            {textos.experiencia.descripcion}
            <textarea
              rows={4}
              value={item.descripcion}
              onChange={(e) => cambiar(item.id, 'descripcion', e.target.value)}
            />
          </label>
          <button type="button" onClick={() => quitar(item.id)}>{textos.experiencia.quitar}</button>
        </div>
      ))}
      <button type="button" onClick={anadir}>{textos.experiencia.anadir}</button>
    </fieldset>
  )
}

export default Experiencia
