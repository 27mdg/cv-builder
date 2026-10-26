import { useEffect, useRef, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist'
// El "worker" de pdf.js: la parte que lee el PDF en segundo plano sin bloquear la página.
// `?url` le pide a Vite la dirección del archivo.
import urlWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import textos from '../idiomas/es.js'
import { documentoPdf } from '../plantillas/documento.jsx'
import PaginaPdf from './PaginaPdf.jsx'

pdfjs.GlobalWorkerOptions.workerSrc = urlWorker

// Milisegundos que se espera tras el último cambio antes de regenerar el PDF
const espera = 500
// Ancho máximo de las hojas, para que en pantallas grandes no se vean enormes
const anchoMaximo = 800

// Muestra el CV como hojas limpias, sin la barra del visor de PDF del navegador:
// 1. se genera el PDF (igual que al descargar), 2. pdf.js lo abre, 3. cada página
// se dibuja en un <canvas> (ver PaginaPdf.jsx).
// Como generar el PDF cuesta un poco, no se hace en cada tecla: se espera a que
// el usuario deje de escribir medio segundo.
// cv: todos los datos del CV
function VistaPrevia({ cv }) {
  // documento: el PDF abierto con pdf.js (null hasta que está el primero)
  const [documento, setDocumento] = useState(null)
  // ancho: ancho disponible para las hojas, según el tamaño del panel
  const [ancho, setAncho] = useState(0)
  const contenedor = useRef(null)
  // La primera vez se genera sin esperar
  const retraso = useRef(0)

  // Genera el PDF cuando cambia el CV
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

  // Mide el panel, y vuelve a medirlo si cambia de tamaño (ventana, pantalla completa...)
  useEffect(() => {
    const observador = new ResizeObserver(([entrada]) => {
      setAncho(Math.floor(Math.min(entrada.contentRect.width, anchoMaximo)))
    })
    observador.observe(contenedor.current)
    return () => observador.disconnect()
  }, [])

  // Números de página: 1, 2, 3...
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
