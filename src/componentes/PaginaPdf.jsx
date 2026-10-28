import { useEffect, useRef } from 'react'

function PaginaPdf({ documento, numero, ancho }) {
  const lienzo = useRef(null)

  useEffect(() => {
    let cancelado = false
    let tarea = null

    async function dibujar() {
      const pagina = await documento.getPage(numero)
      if (cancelado) return
      // devicePixelRatio: sin él, la página se ve borrosa en pantallas de alta resolución
      const escala = (ancho / pagina.getViewport({ scale: 1 }).width) * (window.devicePixelRatio || 1)
      const viewport = pagina.getViewport({ scale: escala })
      // Se dibuja primero en un lienzo aparte y luego se copia de golpe al visible:
      // así la página anterior se sigue viendo mientras se dibuja la nueva (sin parpadeo)
      const temporal = document.createElement('canvas')
      temporal.width = Math.floor(viewport.width)
      temporal.height = Math.floor(viewport.height)
      tarea = pagina.render({ canvas: temporal, viewport })
      await tarea.promise
      if (cancelado || !lienzo.current) return
      lienzo.current.width = temporal.width
      lienzo.current.height = temporal.height
      lienzo.current.getContext('2d').drawImage(temporal, 0, 0)
    }

    dibujar().catch(() => {
      // Dibujo cancelado porque llegó otra versión del CV: no pasa nada
    })
    return () => {
      cancelado = true
      tarea?.cancel()
    }
  }, [documento, numero, ancho])

  return <canvas ref={lienzo} className="pagina-pdf" style={{ width: ancho }}/>
}

export default PaginaPdf
