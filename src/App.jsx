import { useState } from 'react'
import './App.css'
import cvInicial from './datos/cvInicial.js'
import textos from './idiomas/es.js'
import DatosPersonales from './componentes/formulario/DatosPersonales.jsx'
import TextoLargo from './componentes/formulario/TextoLargo.jsx'
import secciones from './datos/secciones.js'
import Seccion from './componentes/formulario/Seccion.jsx'
import SeccionLista from './componentes/formulario/SeccionLista.jsx'

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
          <Seccion titulo={textos.personal.titulo} abierta>
            <DatosPersonales datos={cv.personal} alCambiar={cambiarPersonal}/>
          </Seccion>
          <Seccion titulo={textos.perfil.titulo}>
            <TextoLargo
              valor={cv.perfil}
              ayuda={textos.perfil.ayuda}
              alCambiar={(valor) => setCv({ ...cv, perfil: valor })}
            />
          </Seccion>
          {secciones.map((seccion) => (
            <Seccion key={seccion.clave} titulo={textos[seccion.clave].titulo}>
              <SeccionLista
                clave={seccion.clave}
                campos={seccion.campos}
                lista={cv[seccion.clave]}
                alCambiar={(lista) => setCv({ ...cv, [seccion.clave]: lista })}
              />
            </Seccion>
          ))}
          <Seccion titulo={textos.logros.titulo}>
            <TextoLargo
              valor={cv.logros}
              ayuda={textos.logros.ayuda}
              alCambiar={(valor) => setCv({ ...cv, logros: valor })}
            />
          </Seccion>
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