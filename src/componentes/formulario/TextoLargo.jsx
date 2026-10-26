// Un texto largo, p. ej. el perfil o los logros
// valor: el texto actual
// ayuda: texto de ejemplo que se ve cuando está vacío
// alCambiar: función que recibe el nuevo texto
function TextoLargo({ valor, ayuda, alCambiar }) {
  return (
    <textarea
      rows={5}
      placeholder={ayuda}
      value={valor}
      onChange={(e) => alCambiar(e.target.value)}
    />
  )
}

export default TextoLargo
