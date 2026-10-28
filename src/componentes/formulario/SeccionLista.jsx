import textos from '../../idiomas/es.js'
import CampoFecha from './CampoFecha.jsx'

function etiqueta(clave, nombre) {
  return textos[clave][nombre] ?? textos.campos[nombre]
}

function elementoVacio(campos) {
  // El índice no sirve de key: al quitar un elemento, React mezclaría los campos de otro
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
  if (campo.tipo === 'nivelHabilidad' || campo.tipo === 'nivelIdioma') {
    const opciones = campo.tipo === 'nivelHabilidad' ? textos.comun.nivelesHabilidad : textos.comun.nivelesIdioma
    return (
      <label>
        {texto}
        <select
          value={valor}
          onChange={(e) => {
            // Número, no texto: así cada plantilla decide cómo pintarlo (p. ej. puntitos)
            const elegido = e.target.value
            alCambiar(campo.nombre, campo.tipo === 'nivelHabilidad' && elegido !== '' ? Number(elegido) : elegido)
          }}
        >
          <option value="">{textos.comun.elegir}</option>
          {Object.entries(opciones).map(([codigo, nombre]) => (
            <option key={codigo} value={codigo}>{nombre}</option>
          ))}
        </select>
      </label>
    )
  }
  return (
    <label>
      {texto}
      <input value={valor} onChange={(e) => alCambiar(campo.nombre, e.target.value)}/>
    </label>
  )
}

function SeccionLista({ clave, campos, lista, alCambiar }) {
  function anadir() {
    alCambiar([...lista, elementoVacio(campos)])
  }

  function quitar(id) {
    alCambiar(lista.filter((item) => item.id !== id))
  }

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
