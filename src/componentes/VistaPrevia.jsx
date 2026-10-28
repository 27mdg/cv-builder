import { useEffect, useRef, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist'
import urlWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import textos from '../idiomas/es.js'
import { documentoPdf } from '../plantillas/documento.jsx'
import PaginaPdf from './PaginaPdf.jsx'

pdfjs.GlobalWorkerOptions.workerSrc = urlWorker

// En ms. Generar el PDF cuesta: no se hace en cada tecla, sino al dejar de escribir.
const espera = 500
// Para que en pantallas grandes las hojas no se vean enormes
const anchoMaximo = 800

// Se dibuja con pdf.js en <canvas> en vez de usar el visor del navegador,
// para que no salga su barra ni parpadee al regenerar.
function VistaPrevia({ cv }) {
  const [documento, setDocumento] = useState(null)
  const [ancho, setAncho] = useState(0)
  const contenedor = useRef(null)
  // La primera vez se genera sin esperar
  const retraso = useRef(0)

  useEffect(() => {
    let cancelado = false
    const temporizador = setTimeout(async () => {
      try {
        const blob = await pdf(documentoPdf(cv)).toBlob()
        const nuevo = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise
        if (cancelado) {
          nuevo.loadingTask.destroy()
          return
        }
        setDocumento(nuevo)
      } catch (e) {
        // Si falla, se sigue viendo la versión anterior
        console.error(e)
      }
    }, retraso.current)
    retraso.current = espera
    // Si el CV cambia antes de terminar, esta versión se descarta
    return () => {
      cancelado = true
      clearTimeout(temporizador)
    }
  }, [cv])

  // Cuando llega un PDF nuevo, se libera la memoria del anterior
  useEffect(() => {
    return () => {
      documento?.loadingTask.destroy()
    }
  }, [documento])

  useEffect(() => {
    const observador = new ResizeObserver(([entrada]) => {
      setAncho(Math.floor(Math.min(entrada.contentRect.width, anchoMaximo)))
    })
    observador.observe(contenedor.current)
    return () => observador.disconnect()
  }, [])

  const paginas = documento ? Array.from({ length: documento.numPages }, (_, i) => i + 1) : []

  return (
    <div className="vista-previa" ref={contenedor}>
      {!documento && <p className="cargando">{textos.vistaPrevia.cargando}</p>}
      {ancho > 0 && paginas.map((numero) => (
        <PaginaPdf key={numero} documento={documento} numero={numero} ancho={ancho}/>
      ))}
    </div>
  )
}

export default VistaPrevia
