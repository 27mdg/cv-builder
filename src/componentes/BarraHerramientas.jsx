import textos from '../idiomas/es.js'
import plantillas from '../plantillas/lista.js'
import MenuHerramienta from './MenuHerramienta.jsx'
import {
  IconoPlantillas, IconoFuente, IconoEspaciado, IconoColores,
  IconoPantallaCompleta, IconoSalirPantallaCompleta,
} from './Iconos.jsx'

// Barra flotante abajo de la vista previa: Plantillas, Fuente, Espaciado, Colores
// y Pantalla completa. Fuente, Espaciado y Colores aún no funcionan ("Próximamente"):
// para activarlos, quitar `desactivada` y poner su menú como en Plantillas.
// plantilla: id de la plantilla elegida
// alCambiarPlantilla: función que recibe el id de la nueva plantilla
// pantallaCompleta: true si la vista previa ocupa toda la ventana
// alCambiarPantallaCompleta: función que recibe true / false
function BarraHerramientas({ plantilla, alCambiarPlantilla, pantallaCompleta, alCambiarPantallaCompleta }) {
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
      <MenuHerramienta icono={<IconoFuente/>} texto={textos.herramientas.fuente} desactivada/>
      <MenuHerramienta icono={<IconoEspaciado/>} texto={textos.herramientas.espaciado} desactivada/>
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
