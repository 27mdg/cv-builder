import textos from '../../idiomas/es.js'

// Incluye años futuros para estudios que aún no han terminado
const anioActual = new Date().getFullYear()
const anios = []
for (let anio = anioActual + 6; anio >= 1950; anio--) {
  anios.push(String(anio))
}

function CampoFecha({ etiqueta, valor, alCambiar, ocultarFecha, children }) {
  return (
    <div className="campo-fecha">
      <span>{etiqueta}</span>
      {!ocultarFecha && (
        <>
          <select
            aria-label={textos.comun.mes}
            value={valor.mes}
            onChange={(e) => alCambiar({ ...valor, mes: e.target.value })}
          >
            <option value="">{textos.comun.mes}</option>
            {textos.comun.meses.map((nombre, i) => (
              <option key={nombre} value={String(i + 1)}>{nombre}</option>
            ))}
          </select>
          <select
            aria-label={textos.comun.anio}
            value={valor.anio}
            onChange={(e) => alCambiar({ ...valor, anio: e.target.value })}
          >
            <option value="">{textos.comun.anio}</option>
            {anios.map((anio) => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        </>
      )}
      {children}
    </div>
  )
}

export default CampoFecha
