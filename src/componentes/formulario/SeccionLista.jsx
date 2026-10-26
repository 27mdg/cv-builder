import textos from '../../idiomas/es.js'
import CampoFecha from './CampoFecha.jsx'

// Etiqueta de un campo: la propia de la sección si existe; si no, la común
function etiqueta(clave, nombre) {
  return textos[clave][nombre] ?? textos.campos[nombre]
}

// Elemento nuevo y vacío con todos los campos de la sección
function elementoVacio(campos) {
  // id: identificador único para que React sepa qué bloque es cada uno
  const nuevo = { id: crypto.randomUUID() }
  for (const campo of campos) {
    if (campo.tipo === 'fecha' || campo.tipo === 'fechaFin') {
      nuevo[campo.nombre] = { mes: '', anio: '' }
    } else {
      nuevo[campo.nombre] = ''
    }
    if (campo.tipo === 'fechaFin') {
      nuevo.presente = false
    }
  }
  return nuevo
}

// Un campo de un elemento. Se pinta de una forma u otra según su tipo.
// alCambiar: función que recibe (nombreDelCampo, valor)
function Campo({ clave, campo, item, alCambiar }) {
  const texto = etiqueta(clave, campo.nombre)
  const valor = item[campo.nombre]

  if (campo.tipo === 'textoLargo') {
    return (
      <label>
        {texto}
        <textarea rows={4} value={valor} onChange={(e) => alCambiar(campo.nombre, e.target.value)}/>
      </label>
    )
  }
  if (campo.tipo === 'fecha') {
    return <CampoFecha etiqueta={texto} valor={valor} alCambiar={(nuevo) => alCambiar(campo.nombre, nuevo)}/>
  }
  if (campo.tipo === 'fechaFin') {
    return (
      <CampoFecha
        etiqueta={texto}
        valor={valor}
        alCambiar={(nuevo) => alCambiar(campo.nombre, nuevo)}
        ocultarFecha={item.presente}
      >
        <label className="presente">
          <input
            type="checkbox"
            checked={item.presente}
            onChange={(e) => alCambiar('presente', e.target.checked)}
          />
          {textos.comun.presente}
        </label>
      </CampoFecha>
    )
  }
  // 'texto': una sola línea
  return (
    <label>
      {texto}
      <input value={valor} onChange={(e) => alCambiar(campo.nombre, e.target.value)}/>
    </label>
  )
}

// Sección con varios elementos y botones Añadir / Quitar.
// clave: nombre de la sección en el CV y en los textos, p. ej. 'experiencia'
// campos: los campos de cada elemento (ver src/datos/secciones.js)
// lista: el array de esa sección, p. ej. cv.experiencia
// alCambiar: función que recibe la lista nueva entera
function SeccionLista({ clave, campos, lista, alCambiar }) {
  function anadir() {
    alCambiar([...lista, elementoVacio(campos)])
  }

  function quitar(id) {
    alCambiar(lista.filter((item) => item.id !== id))
  }

  // Cambia un campo de un solo elemento y deja los demás igual
  function cambiar(id, nombre, valor) {
    alCambiar(lista.map((item) => (item.id === id ? { ...item, [nombre]: valor } : item)))
  }

  return (
    <>
      {lista.map((item) => (
        <div className="bloque" key={item.id}>
          {campos.map((campo) => (
            <Campo
              key={campo.nombre}
              clave={clave}
              campo={campo}
              item={item}
              alCambiar={(nombre, valor) => cambiar(item.id, nombre, valor)}
            />
          ))}
          <button type="button" onClick={() => quitar(item.id)}>{textos.comun.quitar}</button>
        </div>
      ))}
      <button type="button" onClick={anadir}>{textos[clave].anadir}</button>
    </>
  )
}

export default SeccionLista
