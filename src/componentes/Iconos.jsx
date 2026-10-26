// Iconos sencillos dibujados con SVG (hechos a mano, sin librerías ni licencias).
// Usan currentColor: toman el color del texto del botón donde estén.

function Icono({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

// Hoja con líneas
export function IconoPlantillas() {
  return <Icono><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></Icono>
}

// Letra "A" con una "a" pequeña
export function IconoFuente() {
  return <Icono><path d="M3 19l5-14 5 14M5 14h6"/><circle cx="18" cy="16" r="3"/><path d="M21 13v6"/></Icono>
}

// Líneas con flechas arriba y abajo
export function IconoEspaciado() {
  return <Icono><path d="M11 6h10M11 12h10M11 18h10M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2"/></Icono>
}

// Gota de pintura
export function IconoColores() {
  return <Icono><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></Icono>
}

// Cuatro esquinas hacia fuera
export function IconoPantallaCompleta() {
  return <Icono><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></Icono>
}

// Cuatro esquinas hacia dentro
export function IconoSalirPantallaCompleta() {
  return <Icono><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></Icono>
}

// Flechita hacia abajo de los menús
export function IconoFlecha() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  )
}
