import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import textos from '../idiomas/es.js'
import secciones from '../datos/secciones.js'
import { tieneTexto, elementosConContenido, resumenElemento, datosPersonales } from './formato.js'

// Plantilla "Moderna": dos columnas. A la izquierda un lateral de color con los datos
// cortos (contacto, habilidades, idiomas...); a la derecha lo largo (experiencia, formación...).
// Aquí solo está el diseño; los textos se preparan con las funciones de formato.js.

// Colores (cambiarlos aquí cambia toda la plantilla)
const acento = '#2c5f5d'
const fondoLateral = '#e8f0ef'
// Ancho del lateral en puntos (el A4 mide 595 pt de ancho)
const anchoLateral = 180

// Secciones con lista que van en el lateral; el resto va en la columna principal
const enLateral = ['habilidades', 'idiomas', 'aficiones', 'aptitudes']

const estilos = StyleSheet.create({
  pagina: {
    flexDirection: 'row',
    paddingVertical: 36,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#222',
  },
  // Fondo del lateral: se dibuja en todas las páginas (fixed) y ocupa todo el alto
  fondo: { position: 'absolute', top: 0, bottom: 0, left: 0, width: anchoLateral, backgroundColor: fondoLateral },
  lateral: { width: anchoLateral, paddingHorizontal: 18, fontSize: 9 },
  principal: { flex: 1, paddingHorizontal: 28 },
  foto: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, alignSelf: 'center', objectFit: 'cover' },
  nombre: { fontSize: 24, lineHeight: 1.2, fontFamily: 'Helvetica-Bold', color: acento },
  puesto: { fontSize: 13, lineHeight: 1.3, marginTop: 2, color: '#555' },
  // Separación ENCIMA de cada sección (marginTop). Con marginBottom, react-pdf no sabe
  // partir una sección larga entre dos páginas y la pasa entera a la siguiente.
  seccion: { marginTop: 14 },
  // El lateral no se parte entre páginas, así que aquí el margen puede ir debajo
  seccionLateral: { marginBottom: 14 },
  tituloSeccion: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: acento,
    textTransform: 'uppercase',
    paddingBottom: 2,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: acento,
  },
  tituloLateral: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: acento,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  elemento: { marginBottom: 8 },
  tituloElemento: { fontFamily: 'Helvetica-Bold' },
  detalle: { fontSize: 9, color: '#666' },
  linea: { marginBottom: 2 },
  habilidad: { marginBottom: 4 },
  puntos: { flexDirection: 'row', marginTop: 2 },
  punto: { width: 6, height: 6, borderRadius: 3, marginRight: 3, borderWidth: 0.5, borderColor: acento },
  puntoLleno: { backgroundColor: acento },
})

// Nivel de habilidad (1–5) pintado como cinco puntitos: ●●●○○
function Puntos({ nivel }) {
  return (
    <View style={estilos.puntos}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View key={n} style={n <= nivel ? [estilos.punto, estilos.puntoLleno] : estilos.punto}/>
      ))}
    </View>
  )
}

// Sección del lateral: título pequeño y contenido
function SeccionLateral({ titulo, children }) {
  return (
    <View style={estilos.seccionLateral}>
      <Text style={estilos.tituloLateral} minPresenceAhead={30}>{titulo}</Text>
      {children}
    </View>
  )
}

// Sección de la columna principal: título con raya debajo
function Seccion({ titulo, children }) {
  return (
    <View style={estilos.seccion}>
      {/* minPresenceAhead: si el título quedaría solo al final de la página, pasa a la siguiente */}
      <Text style={estilos.tituloSeccion} minPresenceAhead={40}>{titulo}</Text>
      {children}
    </View>
  )
}

// Un elemento con título, detalle (fechas, lugar) y descripción.
// wrap={false}: no se parte entre dos páginas
function Elemento({ titulo, detalle, descripcion }) {
  return (
    <View style={estilos.elemento} wrap={false}>
      {tieneTexto(titulo) && <Text style={estilos.tituloElemento}>{titulo}</Text>}
      {tieneTexto(detalle) && <Text style={estilos.detalle}>{detalle}</Text>}
      {tieneTexto(descripcion) && <Text>{descripcion}</Text>}
    </View>
  )
}

// Contenido de las secciones del lateral
function ContenidoLateral({ clave, lista }) {
  if (clave === 'habilidades') {
    return lista.map((item) => (
      <View key={item.id} style={estilos.habilidad} wrap={false}>
        {tieneTexto(item.habilidad) && <Text>{item.habilidad}</Text>}
        {item.nivel !== '' && <Puntos nivel={item.nivel}/>}
      </View>
    ))
  }
  if (clave === 'idiomas') {
    return lista.map((item) => (
      <View key={item.id} style={estilos.habilidad} wrap={false}>
        {tieneTexto(item.idioma) && <Text>{item.idioma}</Text>}
        {item.nivel !== '' && <Text style={estilos.detalle}>{textos.comun.nivelesIdioma[item.nivel]}</Text>}
      </View>
    ))
  }
  // Aficiones y Aptitudes: uno por línea
  const campo = clave === 'aficiones' ? 'interes' : 'aptitud'
  return lista
    .filter((item) => tieneTexto(item[campo]))
    .map((item) => <Text key={item.id} style={estilos.linea}>{item[campo]}</Text>)
}

// cv: todos los datos del CV (ver src/datos/cvInicial.js)
function Moderna({ cv }) {
  const p = cv.personal
  const datos = datosPersonales(p)

  // Secciones con lista que tienen algo, separadas en lateral y principal
  const conContenido = secciones
    .map(({ clave }) => ({ clave, lista: elementosConContenido(cv[clave]) }))
    .filter(({ lista }) => lista.length > 0)
  const lateral = conContenido.filter(({ clave }) => enLateral.includes(clave))
  const principal = conContenido.filter(({ clave }) => !enLateral.includes(clave))

  return (
    <Document title={datos.nombreCompleto} author={datos.nombreCompleto}>
      <Page size="A4" style={estilos.pagina}>
        <View style={estilos.fondo} fixed/>

        <View style={estilos.lateral}>
          {p.foto && <Image style={estilos.foto} src={p.foto}/>}
          {datos.contacto.length > 0 && (
            <SeccionLateral titulo={textos.plantillas.contacto}>
              {datos.contacto.map((texto, i) => <Text key={i} style={estilos.linea}>{texto}</Text>)}
            </SeccionLateral>
          )}
          {datos.otrosDatos.length > 0 && (
            <SeccionLateral titulo={textos.personal.titulo}>
              {datos.otrosDatos.map((texto, i) => <Text key={i} style={estilos.linea}>{texto}</Text>)}
            </SeccionLateral>
          )}
          {lateral.map(({ clave, lista }) => (
            <SeccionLateral key={clave} titulo={textos[clave].titulo}>
              <ContenidoLateral clave={clave} lista={lista}/>
            </SeccionLateral>
          ))}
        </View>

        <View style={estilos.principal}>
          {(tieneTexto(datos.nombreCompleto) || tieneTexto(p.puesto)) && (
            <View>
              {tieneTexto(datos.nombreCompleto) && <Text style={estilos.nombre}>{datos.nombreCompleto}</Text>}
              {tieneTexto(p.puesto) && <Text style={estilos.puesto}>{p.puesto}</Text>}
            </View>
          )}
          {tieneTexto(cv.perfil) && (
            <Seccion titulo={textos.perfil.titulo}>
              <Text>{cv.perfil}</Text>
            </Seccion>
          )}
          {principal.map(({ clave, lista }) => (
            <Seccion key={clave} titulo={textos[clave].titulo}>
              {lista.map((item) => {
                const [titulo, detalle] = resumenElemento(clave, item)
                return <Elemento key={item.id} titulo={titulo} detalle={detalle} descripcion={item.descripcion}/>
              })}
            </Seccion>
          ))}
          {tieneTexto(cv.logros) && (
            <Seccion titulo={textos.logros.titulo}>
              <Text>{cv.logros}</Text>
            </Seccion>
          )}
        </View>
      </Page>
    </Document>
  )
}

export default Moderna
