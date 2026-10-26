import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import cvInicial from './datos/cvInicial.js'
import { cargarCv, guardarCv } from './datos/guardado.js'
import textos from './idiomas/es.js'
import DatosPersonales from './componentes/formulario/DatosPersonales.jsx'
import TextoLargo from './componentes/formulario/TextoLargo.jsx'
import secciones from './datos/secciones.js'
import Seccion from './componentes/formulario/Seccion.jsx'
import SeccionLista from './componentes/formulario/SeccionLista.jsx'
import BotonDescargar from './componentes/BotonDescargar.jsx'
import BotonBorrar from './componentes/BotonBorrar.jsx'
import SelectorPlantilla from './componentes/SelectorPlantilla.jsx'

// La vista previa se carga aparte (lazy) porque la librería de PDF pesa bastante:
// así el formulario aparece al instante y el PDF un momento después.
const VistaPrevia = lazy(() => import('./componentes/VistaPrevia.jsx'))

function App() {
  // Al abrir la web se carga el CV guardado en el navegador (o uno vacío)
  const [cv, setCv] = useState(cargarCv)

  // Cada vez que cambia el CV, se guarda
  useEffect(() => {
    guardarCv(cv)
  }, [cv])

  // Los cambios parten siempre de la versión más reciente del CV (anterior), no de `cv`.
  // Así, si llegan dos cambios casi a la vez (p. ej. la foto, que tarda un poco en
  // reducirse), el segundo no borra el primero.

  // Cambia una sección entera, p. ej. cambiarSeccion('perfil', 'Soy...')
  function cambiarSeccion(clave, valor) {
    setCv((anterior) => ({ ...anterior, [clave]: valor }))
  }

  // Cambia un campo de los datos personales, p. ej. cambiarPersonal('nombre', 'Ana')
  function cambiarPersonal(campo, valor) {
    setCv((anterior) => ({ ...anterior, personal: { ...anterior.personal, [campo]: valor } }))
  }

  return (
    <div className="app">
      <header className="topbar">
        <span>{textos.app.titulo}</span>
        <div className="acciones">
          <SelectorPlantilla valor={cv.plantilla} alCambiar={(id) => cambiarSeccion('plantilla', id)}/>
          {/* Al vaciar el CV, el useEffect de arriba guarda también el CV vacío */}
          <BotonBorrar alBorrar={() => setCv(cvInicial)}/>
          <BotonDescargar cv={cv}/>
        </div>
      </header>
      <main className="workspace">
        <section className="form-panel">
          <p className="aviso">{textos.guardado.aviso}</p>
          <Seccion titulo={textos.personal.titulo} abierta>
            <DatosPersonales datos={cv.personal} alCambiar={cambiarPersonal}/>
          </Seccion>
          <Seccion titulo={textos.perfil.titulo}>
            <TextoLargo
              valor={cv.perfil}
              ayuda={textos.perfil.ayuda}
              alCambiar={(valor) => cambiarSeccion('perfil', valor)}
            />
          </Seccion>
          {secciones.map((seccion) => (
            <Seccion key={seccion.clave} titulo={textos[seccion.clave].titulo}>
              <SeccionLista
                clave={seccion.clave}
                campos={seccion.campos}
                lista={cv[seccion.clave]}
                alCambiar={(lista) => cambiarSeccion(seccion.clave, lista)}
              />
            </Seccion>
          ))}
          <Seccion titulo={textos.logros.titulo}>
            <TextoLargo
              valor={cv.logros}
              ayuda={textos.logros.ayuda}
              alCambiar={(valor) => cambiarSeccion('logros', valor)}
            />
          </Seccion>
        </section>
        <section className="preview-panel">
          {/* Suspense muestra el texto "Cargando…" mientras llega la vista previa */}
          <Suspense fallback={<p className="cargando">{textos.vistaPrevia.cargando}</p>}>
            <VistaPrevia cv={cv}/>
          </Suspense>
        </section>
      </main>
    </div>
  )
}

export default App