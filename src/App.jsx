import { useState } from 'react'
import './App.css'

function App() {
  const [cv, setCv] = useState({ nombre: '', email: '' })

  return (
    <div className="app">
      <header className="topbar">Barra superior</header>
      <main className="workspace">
        <section className="form-panel">
          <label>
            Nombre
            <input value={cv.nombre} onChange={(e) => setCv ({ ...cv, nombre: e.target.value })}/>
          </label>
          <label>
            Email
            <input value={cv.email} onChange={(e) => setCv ({ ...cv, email: e.target.value })}/>
          </label>
        </section>
        <section className="preview-panel">
          <h1>{cv.nombre}</h1>
          <p>{cv.email}</p>
        </section>
      </main>
    </div>
  )
}

export default App