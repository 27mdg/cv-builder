import textos from '../idiomas/es.js'
import { altoLinea } from '../datos/diseno.js'
import Deslizador from './Deslizador.jsx'

// Contenido del menú Espaciado: alto de línea, espacio entre párrafos y entre secciones,
// y márgenes de la página.
// diseno: cv.diseno · alCambiar: función que recibe (campo, valor), p. ej. ('margenes', 4)
function MenuEspaciado({ diseno, alCambiar }) {
  // Deslizadores de 5 pasos (XS, S, M, L, XL): campo del CV y su título
  const conPasos = [
    { campo: 'parrafos', titulo: textos.herramientas.espaciadoParrafos },
    { campo: 'secciones', titulo: textos.herramientas.espaciadoSecciones },
    { campo: 'margenes', titulo: textos.herramientas.margenes },
  ]

  return (
    <div className="menu-diseno">
      <Deslizador
        titulo={textos.herramientas.altoLinea}
        texto={diseno.altoLinea.toFixed(2)}
        valor={diseno.altoLinea}
        minimo={altoLinea.minimo}
        maximo={altoLinea.maximo}
        salto={altoLinea.salto}
        alCambiar={(valor) => alCambiar('altoLinea', valor)}
      />
      {conPasos.map(({ campo, titulo }) => (
        <Deslizador
          key={campo}
          titulo={titulo}
          texto={textos.herramientas.pasos[diseno[campo] - 1]}
          valor={diseno[campo]}
          minimo={1}
          maximo={5}
          alCambiar={(valor) => alCambiar(campo, valor)}
        />
      ))}
    </div>
  )
}

export default MenuEspaciado
