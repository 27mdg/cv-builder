// Deslizador (<input type="range">) con su título encima y el valor a la derecha,
// para los menús Fuente y Espaciado.
// titulo: texto de encima · texto: valor que se muestra a la derecha (p. ej. 'M' o '1.25')
// valor, minimo, maximo, salto: posición y límites del deslizador
// alCambiar: función que recibe el nuevo valor (número)
function Deslizador({ titulo, texto, valor, minimo, maximo, salto = 1, alCambiar }) {
  return (
    <label className="deslizador">
      <span className="deslizador-titulo">{titulo}</span>
      <span className="deslizador-fila">
        <input
          type="range"
          min={minimo}
          max={maximo}
          step={salto}
          value={valor}
          onChange={(e) => alCambiar(Number(e.target.value))}
        />
        <span className="deslizador-valor">{texto}</span>
      </span>
    </label>
  )
}

export default Deslizador
