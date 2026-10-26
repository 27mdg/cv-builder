import textos from '../idiomas/es.js'
import plantillas from '../plantillas/lista.js'
import { fuenteDe } from '../datos/diseno.js'
import MenuHerramienta from './MenuHerramienta.jsx'
import MenuFuente from './MenuFuente.jsx'
import MenuEspaciado from './MenuEspaciado.jsx'
import {
  IconoPlantillas, IconoFuente, IconoEspaciado, IconoColores,
  IconoPantallaCompleta, IconoSalirPantallaCompleta,
} from './Iconos.jsx'

// Barra flotante abajo de la vista previa: Plantillas, Fuente, Espaciado, Colores
// y Pantalla completa. Las que aún no funcionan llevan `desactivada` ("Próximamente").
// plantilla: id de la plantilla elegida
// alCambiarPlantilla: función que recibe el id de la nueva plantilla
// diseno: cv.diseno (fuente, tamaño, espaciado, colores)
// alCambiarDiseno: función que recibe (campo, valor), p. ej. ('fuente', 'lato')
// pantallaCompleta: true si la vista previa ocupa toda la ventana
// alCambiarPantallaCompleta: función que recibe true / false
function BarraHerramientas({
  plantilla, alCambiarPlantilla, diseno, alCambiarDiseno, pantallaCompleta, alCambiarPantallaCompleta,
}) {
  return (
    <div className="barra-herramientas">
      <MenuHerramienta icono={<IconoPlantillas/>} texto={textos.herramientas.plantillas}>
        {(cerrar) => plantillas.map((id) => (
          <button
            key={id}
            type="button"
            className={id === plantilla ? 'elegida' : ''}
            aria-pressed={id === plantilla}
            onClick={() => {
              alCambiarPlantilla(id)
              cerrar()
            }}
          >
            {textos.plantillas[id]}
          </button>
        ))}
      </MenuHerramienta>
      {/* El botón muestra el nombre de la fuente elegida, p. ej. "Lato" */}
      <MenuHerramienta icono={<IconoFuente/>} texto={fuenteDe(diseno).nombre}>
        {() => <MenuFuente diseno={diseno} alCambiar={alCambiarDiseno}/>}
      </MenuHerramienta>
      <MenuHerramienta icono={<IconoEspaciado/>} texto={textos.herramientas.espaciado}>
        {() => <MenuEspaciado diseno={diseno} alCambiar={alCambiarDiseno}/>}
      </MenuHerramienta>
      <MenuHerramienta icono={<IconoColores/>} texto={textos.herramientas.colores} desactivada/>
      <button
        type="button"
        className="boton-pantalla-completa"
        aria-label={pantallaCompleta ? textos.herramientas.salirPantallaCompleta : textos.herramientas.pantallaCompleta}
        title={pantallaCompleta ? textos.herramientas.salirPantallaCompleta : textos.herramientas.pantallaCompleta}
        onClick={() => alCambiarPantallaCompleta(!pantallaCompleta)}
      >
        {pantallaCompleta ? <IconoSalirPantallaCompleta/> : <IconoPantallaCompleta/>}
      </button>
    </div>
  )
}

export default BarraHerramientas
