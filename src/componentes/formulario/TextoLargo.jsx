import textos from '../../idiomas/es.js'

// Un texto largo, p. ej. el perfil o los logros
// valor: el texto actual
// ayuda: texto de ejemplo que se ve cuando está vacío
// alCambiar: función que recibe el nuevo texto
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
