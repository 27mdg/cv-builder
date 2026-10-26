import { useState } from 'react'
import './App.css'
import cvInicial from './datos/cvInicial.js'
import textos from './idiomas/es.js'

function App() {
  const [cv, setCv] = useState(cvInicial)

  // Cambia un campo de los datos personales, p. ej. cambiarPersonal('nombre', 'Ana')
  function cambiarPersonal(campo, valor) {
    setCv({ ...cv, personal: { ...cv.personal, [campo]: valor } })
  }

  return (
    <div className="app">
      <header className="topbar">{textos.app.titulo}</header>
      <main className="workspace">
        <section className="form-panel">
          <label>
            {textos.personal.nombre}
            <input value={cv.personal.nombre} onChange={(e) => cambiarPersonal('nombre', e.target.value)}/>
          </label>
          <label>
            {textos.personal.email}
            <input value={cv.personal.email} onChange={(e) => cambiarPersonal('email', e.target.value)}/>
          </label>
        </section>
        <section className="preview-panel">
          <h1>{cv.personal.nombre}</h1>
          <p>{cv.personal.email}</p>
        </section>
      </main>
    </div>
  )
}

export default App