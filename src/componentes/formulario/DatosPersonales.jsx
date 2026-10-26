import textos from '../../idiomas/es.js'
import SeccionLista from './SeccionLista.jsx'
import CampoFoto from './CampoFoto.jsx'

// Campos que se muestran, en orden. El texto de cada etiqueta sale de textos.personal
// tipo: el tipo del <input> ('date' muestra un calendario)
const campos = [
  { nombre: 'nombre', tipo: 'text' },
  { nombre: 'apellidos', tipo: 'text' },
  { nombre: 'puesto', tipo: 'text' },
  { nombre: 'email', tipo: 'email' },
  { nombre: 'telefono', tipo: 'tel' },
  { nombre: 'direccion', tipo: 'text' },
  { nombre: 'codigoPostal', tipo: 'text' },
  { nombre: 'localidad', tipo: 'text' },
  { nombre: 'fechaNacimiento', tipo: 'date' },
  { nombre: 'lugarNacimiento', tipo: 'text' },
  { nombre: 'carne', tipo: 'text' },
  { nombre: 'genero', tipo: 'text' },
  { nombre: 'nacionalidad', tipo: 'text' },
  { nombre: 'estadoCivil', tipo: 'text' },
  { nombre: 'web', tipo: 'text' },
  { nombre: 'linkedin', tipo: 'text' },
]

// Cada campo personalizado: una etiqueta y su valor (p. ej. "Disponibilidad" + "Inmediata")
const camposPersonalizados = [
  { nombre: 'etiqueta', tipo: 'texto' },
  { nombre: 'valor', tipo: 'texto' },
]

// datos: el objeto cv.personal
// alCambiar: función que recibe (campo, valor)
function DatosPersonales({ datos, alCambiar }) {
  return (
    <>
      <CampoFoto valor={datos.foto} alCambiar={(foto) => alCambiar('foto', foto)}/>
      {campos.map((campo) => (
        <label key={campo.nombre}>
          {textos.personal[campo.nombre]}
          <input
            type={campo.tipo}
            value={datos[campo.nombre]}
            onChange={(e) => alCambiar(campo.nombre, e.target.value)}
          />
        </label>
      ))}
      <p className="subtitulo">{textos.personalizados.titulo}</p>
      <SeccionLista
        clave="personalizados"
        campos={camposPersonalizados}
        lista={datos.personalizados}
        alCambiar={(lista) => alCambiar('personalizados', lista)}
      />
    </>
  )
}

export default DatosPersonales
