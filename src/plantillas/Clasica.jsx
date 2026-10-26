import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import textos from '../idiomas/es.js'
import secciones from '../datos/secciones.js'
import { tieneTexto, elementosConContenido, unir, resumenElemento, datosPersonales } from './formato.js'

// Plantilla "Clásica": una columna, sobria.
// Aquí solo está el diseño; los textos se preparan con las funciones de formato.js.

// Color de los títulos (cambiarlo aquí cambia toda la plantilla)
const acento = '#1f4e79'

// Medidas en puntos (pt): 1 pt ≈ 0,35 mm. Un A4 mide 595 × 842 pt.
const estilos = StyleSheet.create({
  pagina: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.4, color: '#222' },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: acento,
  },
  foto: { width: 70, height: 70, borderRadius: 35, marginRight: 16, objectFit: 'cover' },
  // lineHeight propio: el de la página se calcula para letra de 10 pt y aquí se montaría
  nombre: { fontSize: 22, lineHeight: 1.2, fontFamily: 'Helvetica-Bold', color: acento },
  puesto: { fontSize: 12, lineHeight: 1.3, marginTop: 2 },
  contacto: { fontSize: 9, color: '#555', marginTop: 4 },
  seccion: { marginTop: 14 },
  tituloSeccion: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: acento,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  elemento: { marginBottom: 6 },
  tituloElemento: { fontFamily: 'Helvetica-Bold' },
  detalle: { fontSize: 9, color: '#666' },
})

// Una sección del CV con su título
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

// Contenido de una sección con lista, según de qué sección se trate
function ContenidoLista({ clave, lista }) {
  if (clave === 'habilidades') {
    return lista.map((item) => (
      <Text key={item.id}>{unir([item.habilidad, textos.comun.nivelesHabilidad[item.nivel]], ' — ')}</Text>
    ))
  }
  if (clave === 'idiomas') {
    return lista.map((item) => (
      <Text key={item.id}>{unir([item.idioma, textos.comun.nivelesIdioma[item.nivel]], ' — ')}</Text>
    ))
  }
  if (clave === 'aficiones') {
    return <Text>{unir(lista.map((item) => item.interes))}</Text>
  }
  if (clave === 'aptitudes') {
    return <Text>{unir(lista.map((item) => item.aptitud))}</Text>
  }
  return lista.map((item) => {
    const [titulo, detalle] = resumenElemento(clave, item)
    return <Elemento key={item.id} titulo={titulo} detalle={detalle} descripcion={item.descripcion}/>
  })
}

// cv: todos los datos del CV (ver src/datos/cvInicial.js)
function Clasica({ cv }) {
  const p = cv.personal
  const datos = datosPersonales(p)
  const nombreCompleto = datos.nombreCompleto
  // En esta plantilla, contacto y otros datos van cada uno en una línea
  const contacto = unir(datos.contacto)
  const otrosDatos = unir(datos.otrosDatos)

  const hayCabecera = p.foto || nombreCompleto || p.puesto || contacto || otrosDatos

  return (
    <Document title={nombreCompleto} author={nombreCompleto}>
      <Page size="A4" style={estilos.pagina}>
        {hayCabecera && (
          <View style={estilos.cabecera}>
            {p.foto && <Image style={estilos.foto} src={p.foto}/>}
            <View>
              {tieneTexto(nombreCompleto) && <Text style={estilos.nombre}>{nombreCompleto}</Text>}
              {tieneTexto(p.puesto) && <Text style={estilos.puesto}>{p.puesto}</Text>}
              {tieneTexto(contacto) && <Text style={estilos.contacto}>{contacto}</Text>}
              {tieneTexto(otrosDatos) && <Text style={estilos.contacto}>{otrosDatos}</Text>}
            </View>
          </View>
        )}

        {tieneTexto(cv.perfil) && (
          <Seccion titulo={textos.perfil.titulo}>
            <Text>{cv.perfil}</Text>
          </Seccion>
        )}

        {/* Secciones con lista, en el mismo orden que el formulario */}
        {secciones.map(({ clave }) => {
          const lista = elementosConContenido(cv[clave])
          if (lista.length === 0) return null
          return (
            <Seccion key={clave} titulo={textos[clave].titulo}>
              <ContenidoLista clave={clave} lista={lista}/>
            </Seccion>
          )
        })}

        {tieneTexto(cv.logros) && (
          <Seccion titulo={textos.logros.titulo}>
            <Text>{cv.logros}</Text>
          </Seccion>
        )}
      </Page>
    </Document>
  )
}

export default Clasica
