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
