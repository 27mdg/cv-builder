// Plantillas disponibles, en el orden del selector. La primera es la de por defecto.
// Sus nombres visibles están en el archivo de idioma (textos.plantillas).
// Este archivo no importa la librería de PDF, así el selector carga rápido.
const plantillas = ['clasica', 'moderna']

// Combinación de colores propia de cada plantilla, cuando el usuario no elige otra
// (ids de `colores` en src/datos/diseno.js)
export const colorPorDefecto = {
  clasica: 'azul',
  moderna: 'verde-azulado',
}

export default plantillas
