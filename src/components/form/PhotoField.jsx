import texts from '../../locales/es.js'
import { CloseIcon, PersonIcon } from '../Icons.jsx'

// In pixels, longest side. An unresized phone photo does not fit in localStorage.
const maxSide = 400

// Resized in the browser: the photo is never sent to a server (GDPR)
function resizePhoto(file, onDone) {
  const image = new Image()
  const url = URL.createObjectURL(file)
  image.onload = () => {
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * scale)
    canvas.height = Math.round(image.height * scale)
    const context = canvas.getContext('2d')
    // White background, in case the image has transparent parts (JPEG does not support them)
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(url)
    onDone(canvas.toDataURL('image/jpeg', 0.85))
  }
  image.onerror = () => URL.revokeObjectURL(url)
  image.src = url
}

function PhotoField({ value, onChange }) {
  function handleChange(e) {
    const file = e.target.files[0]
    if (file) {
      resizePhoto(file, onChange)
    }
    // Reset the picker so the same file can be chosen again
    e.target.value = ''
  }

  return (
    <div className="photo-field">
      <span className="label">{texts.personal.photo}</span>
      {/* <label> so the whole box opens the file picker hidden inside it */}
      <label className="photo-box" title={texts.personal.choosePhoto}>
        {value ? <img src={value} alt={texts.personal.photo}/> : <PersonIcon/>}
        <input type="file" accept="image/*" onChange={handleChange}/>
      </label>
      {value && (
        <button
          type="button"
          className="photo-remove"
          title={texts.personal.removePhoto}
          aria-label={texts.personal.removePhoto}
          onClick={() => onChange('')}
        >
          <CloseIcon/>
        </button>
      )}
    </div>
  )
}

export default PhotoField
