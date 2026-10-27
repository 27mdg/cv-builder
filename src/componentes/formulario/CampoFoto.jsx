import textos from '../../idiomas/es.js'
import { IconoCerrar, IconoPersona } from '../Iconos.jsx'

// Tamaño máximo (en píxeles) del lado más largo de la foto
const ladoMaximo = 400

// Reduce la imagen y la devuelve como texto (una "data URL") para que ocupe poco.
// Todo ocurre en el navegador: la foto no se envía a ningún servidor.
// alTerminar: función que recibe la foto reducida
function reducirFoto(archivo, alTerminar) {
  const imagen = new Image()
  const url = URL.createObjectURL(archivo)
  imagen.onload = () => {
    const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height))
    // Un <canvas> es un lienzo donde se dibuja la imagen ya a su nuevo tamaño
    const lienzo = document.createElement('canvas')
    lienzo.width = Math.round(imagen.width * escala)
    lienzo.height = Math.round(imagen.height * escala)
    const pincel = lienzo.getContext('2d')
    // Fondo blanco, por si la imagen tiene partes transparentes (JPEG no las admite)
    pincel.fillStyle = 'white'
    pincel.fillRect(0, 0, lienzo.width, lienzo.height)
    pincel.drawImage(imagen, 0, 0, lienzo.width, lienzo.height)
    URL.revokeObjectURL(url)
    alTerminar(lienzo.toDataURL('image/jpeg', 0.85))
  }
  // Si el archivo no es una imagen válida, no se hace nada
  imagen.onerror = () => URL.revokeObjectURL(url)
  imagen.src = url
}

// valor: la foto guardada (texto vacío si no hay)
// alCambiar: función que recibe la foto nueva (o '' para quitarla)
function CampoFoto({ valor, alCambiar }) {
  function elegir(e) {
    const archivo = e.target.files[0]
    if (archivo) {
      reducirFoto(archivo, alCambiar)
    }
    // Vacía el selector para poder volver a elegir el mismo archivo
    e.target.value = ''
  }

  return (
    <div className="campo-foto">
      <span className="etiqueta">{textos.personal.foto}</span>
      {/* Todo el recuadro es un <label>: al pulsarlo se abre el selector de archivos,
          que está escondido dentro */}
      <label className="foto-recuadro" title={textos.personal.elegirFoto}>
        {valor ? <img src={valor} alt={textos.personal.foto}/> : <IconoPersona/>}
        <input type="file" accept="image/*" onChange={elegir}/>
      </label>
      {valor && (
        <button
          type="button"
          className="foto-quitar"
          title={textos.personal.quitarFoto}
          aria-label={textos.personal.quitarFoto}
          onClick={() => alCambiar('')}
        >
          <IconoCerrar/>
        </button>
      )}
    </div>
  )
}

export default CampoFoto
