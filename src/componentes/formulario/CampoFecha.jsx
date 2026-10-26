import textos from '../../idiomas/es.js'

// Años del desplegable: desde unos años en el futuro (estudios que aún no han
// terminado) hasta 1950
const anioActual = new Date().getFullYear()
const anios = []
for (let anio = anioActual + 6; anio >= 1950; anio--) {
  anios.push(String(anio))
}

// etiqueta: texto que se muestra delante de los desplegables
// valor: { mes, anio } (textos vacíos si no se ha elegido nada)
// alCambiar: función que recibe el nuevo { mes, anio }
// ocultarFecha: si es true, no se muestran los desplegables (p. ej. con "Presente")
// children: lo que vaya detrás de los desplegables (p. ej. la casilla "Presente")
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
