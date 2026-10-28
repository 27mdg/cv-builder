import textos from '../../idiomas/es.js'

function TextoLargo({ valor, ayuda, alCambiar }) {
  return (
    <label>
      {textos.comun.descripcion}
      <textarea
        className="texto-largo"
        rows={6}
        placeholder={ayuda}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
      />
    </label>
  )
}

export default TextoLargo
