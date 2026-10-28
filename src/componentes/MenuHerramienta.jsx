import { useEffect, useRef, useState } from 'react'
import textos from '../idiomas/es.js'
import { IconoFlecha } from './Iconos.jsx'

// children es una función que recibe `cerrar`, para que el menú pueda cerrarse al elegir.
// aDerecha: para las herramientas del borde derecho, cuyo menú se saldría del panel.
function MenuHerramienta({ icono, texto, desactivada, aDerecha, children }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)

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
      {abierto && (
        <div className={aDerecha ? 'menu-herramienta a-derecha' : 'menu-herramienta'}>
          {children(() => setAbierto(false))}
        </div>
      )}
    </span>
  )
}

export default MenuHerramienta
