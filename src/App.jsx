import { useState } from 'react'
import './App.css'
import cvInicial from './datos/cvInicial.js'
import textos from './idiomas/es.js'
import DatosPersonales from './componentes/formulario/DatosPersonales.jsx'
import Resumen from './componentes/formulario/Resumen.jsx'
import Experiencia from './componentes/formulario/Experiencia.jsx'

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
          <DatosPersonales datos={cv.personal} alCambiar={cambiarPersonal}/>
          <Resumen valor={cv.resumen} alCambiar={(valor) => setCv({ ...cv, resumen: valor })}/>
          <Experiencia lista={cv.experiencia} alCambiar={(lista) => setCv({ ...cv, experiencia: lista })}/>
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