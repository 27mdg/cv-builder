import { useEffect, useRef, useState } from 'react'
import textos from '../idiomas/es.js'
import { IconoFlecha } from './Iconos.jsx'

// Una herramienta de la barra de la vista previa: un botón que abre un menú hacia arriba.
// icono: el icono del botón
// texto: el nombre de la herramienta
// desactivada: si es true, el botón se ve en gris y no hace nada ("Próximamente")
// children: el contenido del menú. Recibe la función cerrar: children(cerrar)
function MenuHerramienta({ icono, texto, desactivada, children }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)

  // Con el menú abierto: se cierra al pulsar fuera de él o la tecla Esc
  useEffect(() => {
    if (!abierto) return
    function alPulsarFuera(e) {
      if (!caja.current.contains(e.target)) setAbierto(false)
    }
    function alPulsarTecla(e) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alPulsarFuera)
    document.addEventListener('keydown', alPulsarTecla)
    return () => {
      document.removeEventListener('mousedown', alPulsarFuera)
      document.removeEventListener('keydown', alPulsarTecla)
    }
  }, [abierto])

  return (
    // El aviso "Próximamente" va en el span: los botones desactivados no muestran su title
    <span className="herramienta" ref={caja} title={desactivada ? textos.herramientas.proximamente : undefined}>
      <button
        type="button"
        disabled={desactivada}
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        {icono}
        {texto}
        <IconoFlecha/>
      </button>
      {abierto && <div className="menu-herramienta">{children(() => setAbierto(false))}</div>}
    </span>
  )
}

export default MenuHerramienta
