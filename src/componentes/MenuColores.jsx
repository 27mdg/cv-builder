import textos from '../idiomas/es.js'
import { colores } from '../datos/diseno.js'
import { colorPorDefecto } from '../plantillas/lista.js'

// Contenido del menú Colores: una muestra por combinación (el cuadrado es el fondo del
// lateral y el círculo el color principal) y una muestra arcoíris para elegir un color a mano.
// diseno: cv.diseno · plantilla: id de la plantilla elegida (para saber su color por defecto)
// alCambiar: función que recibe (campo, valor), p. ej. ('color', 'rojo')
function MenuColores({ diseno, plantilla, alCambiar }) {
  // Combinación que se está usando: la elegida o, si no hay, la de la plantilla
  const actual = diseno.color || colorPorDefecto[plantilla]

  return (
    <div className="menu-colores">
      {colores.map((color) => (
        <button
          key={color.id}
          type="button"
          className={color.id === actual ? 'muestra elegida' : 'muestra'}
          style={{ backgroundColor: color.lateral }}
          aria-label={textos.nombresColores[color.id]}
          title={textos.nombresColores[color.id]}
          aria-pressed={color.id === actual}
          onClick={() => alCambiar('color', color.id)}
        >
          <span className="muestra-circulo" style={{ backgroundColor: color.principal }}/>
        </button>
      ))}
      {/* Color a mano: el <label> abre el selector de color del navegador al pulsarlo */}
      <label
        className={actual === 'propio' ? 'muestra muestra-arcoiris elegida' : 'muestra muestra-arcoiris'}
        title={textos.nombresColores.propio}
      >
        <input
          type="color"
          aria-label={textos.nombresColores.propio}
          value={diseno.colorPropio || '#1f4e79'}
          onChange={(e) => {
            alCambiar('colorPropio', e.target.value)
            alCambiar('color', 'propio')
          }}
        />
      </label>
    </div>
  )
}

export default MenuColores
