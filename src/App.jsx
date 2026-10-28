import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import { cargarCv, guardarCv } from './datos/guardado.js'
import { nombreBase } from './datos/archivo.js'
import textos from './idiomas/es.js'
import DatosPersonales from './componentes/formulario/DatosPersonales.jsx'
import TextoLargo from './componentes/formulario/TextoLargo.jsx'
import secciones from './datos/secciones.js'
import Seccion from './componentes/formulario/Seccion.jsx'
import SeccionLista from './componentes/formulario/SeccionLista.jsx'
import BotonDescargar from './componentes/BotonDescargar.jsx'
import BotonImportar from './componentes/BotonImportar.jsx'
import BotonExportar from './componentes/BotonExportar.jsx'
import BarraHerramientas from './componentes/BarraHerramientas.jsx'

// La vista previa se carga aparte (lazy) porque la librería de PDF pesa bastante:
// así el formulario aparece al instante y el PDF un momento después.
const VistaPrevia = lazy(() => import('./componentes/VistaPrevia.jsx'))

function App() {
  const [cv, setCv] = useState(cargarCv)

  useEffect(() => {
    guardarCv(cv)
  }, [cv])

  const [pantallaCompleta, setPantallaCompleta] = useState(false)

  useEffect(() => {
    if (!pantallaCompleta) return
    function alPulsarTecla(e) {
      if (e.key === 'Escape') setPantallaCompleta(false)
    }
    window.addEventListener('keydown', alPulsarTecla)
    return () => window.removeEventListener('keydown', alPulsarTecla)
  }, [pantallaCompleta])

  // Los cambios parten siempre de la versión más reciente del CV (anterior), no de `cv`.
  // Así, si llegan dos cambios casi a la vez (p. ej. la foto, que tarda un poco en
  // reducirse), el segundo no borra el primero.
  function cambiarSeccion(clave, valor) {
    setCv((anterior) => ({ ...anterior, [clave]: valor }))
  }

  function cambiarDiseno(campo, valor) {
    setCv((anterior) => ({ ...anterior, diseno: { ...anterior.diseno, [campo]: valor } }))
  }

  function cambiarPersonal(campo, valor) {
    setCv((anterior) => ({ ...anterior, personal: { ...anterior.personal, [campo]: valor } }))
  }

  return (
    <div className="app">
      <header className="topbar">
        {/* Logo provisional: cuando exista la página de inicio, este enlace llevará a ella */}
        <a href="/" className="logo">{textos.app.titulo}</a>
        {/* El placeholder enseña el nombre automático que se usará si se deja vacío */}
        <input
          className="nombre-archivo"
          aria-label={textos.archivo.nombre}
          placeholder={nombreBase({ ...cv, nombreArchivo: '' })}
          value={cv.nombreArchivo}
          onChange={(e) => cambiarSeccion('nombreArchivo', e.target.value)}
        />
        <div className="acciones">
          <BotonImportar cvActual={cv} alImportar={setCv}/>
          <BotonExportar cv={cv}/>
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
        <section className={pantallaCompleta ? 'preview-panel pantalla-completa' : 'preview-panel'}>
          <Suspense fallback={<p className="cargando">{textos.vistaPrevia.cargando}</p>}>
            <VistaPrevia cv={cv}/>
          </Suspense>
          <BarraHerramientas
            plantilla={cv.plantilla}
            alCambiarPlantilla={(id) => cambiarSeccion('plantilla', id)}
            diseno={cv.diseno}
            alCambiarDiseno={cambiarDiseno}
            pantallaCompleta={pantallaCompleta}
            alCambiarPantallaCompleta={setPantallaCompleta}
          />
        </section>
      </main>
    </div>
  )
}

export default App