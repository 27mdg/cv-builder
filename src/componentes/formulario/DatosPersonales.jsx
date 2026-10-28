import { useState } from 'react'
import textos from '../../idiomas/es.js'
import CampoFoto from './CampoFoto.jsx'
import { IconoCerrar, IconoMas } from '../Iconos.jsx'

// `completo`: ocupa las dos columnas de la rejilla
const campos = [
  { nombre: 'email', tipo: 'email' },
  { nombre: 'telefono', tipo: 'tel' },
  { nombre: 'direccion', tipo: 'text', completo: true },
  { nombre: 'codigoPostal', tipo: 'text' },
  { nombre: 'localidad', tipo: 'text' },
  { nombre: 'fechaNacimiento', tipo: 'date', completo: true },
]

// Poco usados: escondidos tras un botón "+" para no alargar el formulario
const camposExtra = [
  { nombre: 'lugarNacimiento', tipo: 'text' },
  { nombre: 'carne', tipo: 'text' },
  { nombre: 'genero', tipo: 'text' },
  { nombre: 'nacionalidad', tipo: 'text' },
  { nombre: 'estadoCivil', tipo: 'text' },
  { nombre: 'web', tipo: 'text' },
  { nombre: 'linkedin', tipo: 'text' },
]

function Campo({ campo, datos, alCambiar, enfocar, children }) {
  return (
    <div className={campo.completo ? 'campo campo-completo' : 'campo'}>
      <label>
        {textos.personal[campo.nombre]}
        <input
          type={campo.tipo}
          value={datos[campo.nombre]}
          autoFocus={enfocar}
          onChange={(e) => alCambiar(campo.nombre, e.target.value)}
        />
      </label>
      {children}
    </div>
  )
}

function BotonQuitar({ alPulsar }) {
  return (
    <button type="button" className="campo-quitar" title={textos.comun.quitar}
      aria-label={textos.comun.quitar} onClick={alPulsar}>
      <IconoCerrar/>
    </button>
  )
}

function DatosPersonales({ datos, alCambiar }) {
  // Solo los abiertos y aún vacíos: los que tienen algo se ven siempre (ver `visibles`),
  // así no hace falta guardar esto en el CV
  const [abiertos, setAbiertos] = useState([])
  // Para poner el cursor en el campo personalizado recién añadido
  const [nuevoPersonalizado, setNuevoPersonalizado] = useState(null)

  const visibles = camposExtra.filter((c) => datos[c.nombre] !== '' || abiertos.includes(c.nombre))
  const escondidos = camposExtra.filter((c) => !visibles.includes(c))

  function quitarExtra(nombre) {
    alCambiar(nombre, '')
    setAbiertos(abiertos.filter((n) => n !== nombre))
  }

  function anadirPersonalizado() {
    const nuevo = { id: crypto.randomUUID(), etiqueta: '', valor: '' }
    setNuevoPersonalizado(nuevo.id)
    alCambiar('personalizados', [...datos.personalizados, nuevo])
  }

  function cambiarPersonalizado(id, campo, valor) {
    alCambiar('personalizados', datos.personalizados.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)))
  }

  function quitarPersonalizado(id) {
    alCambiar('personalizados', datos.personalizados.filter((p) => p.id !== id))
  }

  return (
    <>
      <div className="personal-cabecera">
        <CampoFoto valor={datos.foto} alCambiar={(foto) => alCambiar('foto', foto)}/>
        <div className="rejilla">
          <Campo campo={{ nombre: 'nombre', tipo: 'text' }} datos={datos} alCambiar={alCambiar}/>
          <Campo campo={{ nombre: 'apellidos', tipo: 'text' }} datos={datos} alCambiar={alCambiar}/>
          <Campo campo={{ nombre: 'puesto', tipo: 'text', completo: true }} datos={datos} alCambiar={alCambiar}/>
        </div>
      </div>

      <div className="rejilla">
        {campos.map((campo) => (
          <Campo key={campo.nombre} campo={campo} datos={datos} alCambiar={alCambiar}/>
        ))}
        {visibles.map((campo) => (
          <Campo key={campo.nombre} campo={campo} datos={datos} alCambiar={alCambiar}
            enfocar={abiertos.includes(campo.nombre)}>
            <BotonQuitar alPulsar={() => quitarExtra(campo.nombre)}/>
          </Campo>
        ))}
        {datos.personalizados.map((p) => (
          <div className="campo campo-completo personalizado" key={p.id}>
            <input
              aria-label={textos.personalizados.etiqueta}
              placeholder={textos.personalizados.etiqueta}
              value={p.etiqueta}
              autoFocus={p.id === nuevoPersonalizado}
              onChange={(e) => cambiarPersonalizado(p.id, 'etiqueta', e.target.value)}
            />
            <input
              aria-label={textos.personalizados.valor}
              placeholder={textos.personalizados.valor}
              value={p.valor}
              onChange={(e) => cambiarPersonalizado(p.id, 'valor', e.target.value)}
            />
            <BotonQuitar alPulsar={() => quitarPersonalizado(p.id)}/>
          </div>
        ))}
      </div>

      <div className="chips">
        {escondidos.map((campo) => (
          <button type="button" className="chip" key={campo.nombre}
            onClick={() => setAbiertos([...abiertos, campo.nombre])}>
            <IconoMas/>{textos.personal[campo.nombre]}
          </button>
        ))}
        <button type="button" className="chip" onClick={anadirPersonalizado}>
          <IconoMas/>{textos.personalizados.boton}
        </button>
      </div>
    </>
  )
}

export default DatosPersonales
