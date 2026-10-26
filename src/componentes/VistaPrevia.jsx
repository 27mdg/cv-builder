import { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import Clasica from '../plantillas/Clasica.jsx'

// Milisegundos que se espera tras el último cambio antes de regenerar el PDF
const espera = 500

// Muestra el PDF del CV. Como generar el PDF cuesta un poco, no se hace en cada
// tecla: se espera a que el usuario deje de escribir medio segundo.
// cv: todos los datos del CV
function VistaPrevia({ cv }) {
  // cvMostrado: la versión del CV que se ve ahora en el PDF
  const [cvMostrado, setCvMostrado] = useState(cv)

  useEffect(() => {
    const temporizador = setTimeout(() => setCvMostrado(cv), espera)
    // Si el CV cambia antes de que pase el medio segundo, se cancela la espera anterior
    return () => clearTimeout(temporizador)
  }, [cv])

  return (
    <PDFViewer className="visor-pdf">
      <Clasica cv={cvMostrado}/>
    </PDFViewer>
  )
}

export default VistaPrevia
