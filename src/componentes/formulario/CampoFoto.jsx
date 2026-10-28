import textos from '../../idiomas/es.js'
import { IconoCerrar, IconoPersona } from '../Iconos.jsx'

// En píxeles, lado más largo. Una foto de móvil sin reducir no cabe en localStorage.
const ladoMaximo = 400

// Se reduce en el navegador: la foto no se envía a ningún servidor (RGPD)
function reducirFoto(archivo, alTerminar) {
  const imagen = new Image()
  const url = URL.createObjectURL(archivo)
  imagen.onload = () => {
    const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height))
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
  imagen.onerror = () => URL.revokeObjectURL(url)
  imagen.src = url
}

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
      {/* <label> para que todo el recuadro abra el selector de archivos escondido dentro */}
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
