// Marco de una sección del formulario: título y contenido.
// titulo: texto del título
// children: lo que va dentro de la sección
function Seccion({ titulo, children }) {
  return (
    <fieldset>
      <legend>{titulo}</legend>
      {children}
    </fieldset>
  )
}

export default Seccion
