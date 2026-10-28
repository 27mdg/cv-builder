import textos from '../idiomas/es.js'
import { altoLinea } from '../datos/diseno.js'
import Deslizador from './Deslizador.jsx'

function MenuEspaciado({ diseno, alCambiar }) {
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
