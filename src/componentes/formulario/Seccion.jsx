// Sección del formulario que se pliega y despliega al pulsar el título.
// <details> y <summary> son etiquetas de HTML que ya hacen esto solas.
// titulo: texto del título
// abierta: si es true, la sección empieza desplegada
// children: lo que va dentro de la sección
function Seccion({ titulo, abierta, children }) {
  return (
    <details className="seccion" open={abierta}>
      <summary>{titulo}</summary>
      <div className="seccion-contenido">{children}</div>
    </details>
  )
}

export default Seccion
