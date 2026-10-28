// This file does not import the PDF library, so the menus load fast.

// Free fonts only, served from our own site (GDPR). `hint`: the paid font it resembles,
// for the menu ("Arimo (tipo Arial)").
// To add one: `npm install @fontsource/<id>`, add it here and its CSS in FontMenu.jsx.
export const fonts = [
  // Helvetica is built into every PDF reader: no file needed
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica', css: 'Helvetica, Arial, sans-serif' },
  { id: 'arimo', name: 'Arimo', hint: 'Arial', family: 'Arimo', css: "'Arimo', sans-serif" },
  { id: 'carlito', name: 'Carlito', hint: 'Calibri', family: 'Carlito', css: "'Carlito', sans-serif" },
  { id: 'cousine', name: 'Cousine', hint: 'Courier New', family: 'Cousine', css: "'Cousine', monospace" },
  { id: 'eb-garamond', name: 'EB Garamond', family: 'EB Garamond', css: "'EB Garamond', serif" },
  { id: 'gelasio', name: 'Gelasio', hint: 'Georgia', family: 'Gelasio', css: "'Gelasio', serif" },
  { id: 'lato', name: 'Lato', family: 'Lato', css: "'Lato', sans-serif" },
  { id: 'noto-sans', name: 'Noto Sans', family: 'Noto Sans', css: "'Noto Sans', sans-serif" },
  { id: 'noto-serif', name: 'Noto Serif', family: 'Noto Serif', css: "'Noto Serif', serif" },
  { id: 'open-sans', name: 'Open Sans', family: 'Open Sans', css: "'Open Sans', sans-serif" },
  { id: 'poppins', name: 'Poppins', family: 'Poppins', css: "'Poppins', sans-serif" },
  { id: 'roboto', name: 'Roboto', family: 'Roboto', css: "'Roboto', sans-serif" },
  { id: 'tinos', name: 'Tinos', hint: 'Times New Roman', family: 'Tinos', css: "'Tinos', serif" },
]

// The CV's font (the first one if it does not exist)
export function fontOf(design) {
  return fonts.find((f) => f.id === design.font) ?? fonts[0]
}

// Multipliers for steps 1–5 (3 is normal); each template applies them to its own sizes
export const steps = {
  size: [0.85, 0.92, 1, 1.08, 1.16],
  paragraphs: [0.35, 0.65, 1, 1.5, 2],
  sections: [0.4, 0.7, 1, 1.4, 1.8],
  margins: [0.5, 0.75, 1, 1.3, 1.6],
}

export const lineHeight = { min: 1, max: 2, step: 0.05 }

// `dark`: the sidebar is dark and its text must be light to be readable
export const colors = [
  { id: 'navy', main: '#1f4e79', sidebar: '#e6edf4' },
  { id: 'teal', main: '#2c5f5d', sidebar: '#e8f0ef' },
  { id: 'red', main: '#a33b3b', sidebar: '#f6e8e8' },
  { id: 'green', main: '#2f6b41', sidebar: '#e6f1e9' },
  { id: 'ochre', main: '#b06d27', sidebar: '#f7eee3' },
  { id: 'purple', main: '#5b4a8b', sidebar: '#ece9f4' },
  { id: 'salmon-dark', main: '#e08a6c', sidebar: '#232323', dark: true },
  { id: 'sky-dark', main: '#8bb8de', sidebar: '#1f2633', dark: true },
]

// Mixes a colour with white: amount 0 = the same colour, 1 = white
export function lighten(hex, amount) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const light = channels.map((c) => Math.round(c + (255 - c) * amount))
  return '#' + light.map((c) => c.toString(16).padStart(2, '0')).join('')
}

function colorsOf(design, defaultColor) {
  let scheme
  if (design.color === 'custom' && /^#[0-9a-f]{6}$/i.test(design.customColor)) {
    scheme = { main: design.customColor, sidebar: lighten(design.customColor, 0.88) }
  } else {
    scheme = colors.find((c) => c.id === design.color) ?? colors.find((c) => c.id === defaultColor)
  }
  return {
    main: scheme.main,
    sidebar: scheme.sidebar,
    sidebarText: scheme.dark ? '#f2f2f2' : '#222',
    sidebarMutedText: scheme.dark ? '#b8b8b8' : '#666',
  }
}

// Turns cv.design into the numbers the templates use
export function designValues(design, defaultColor) {
  const font = fontOf(design)
  // An invalid saved value (file edited by hand) is treated as normal
  const step = (list, n) => list[n - 1] ?? 1
  return {
    font: font.family,
    scale: step(steps.size, design.size),
    lineHeight: design.lineHeight,
    paragraphs: step(steps.paragraphs, design.paragraphs),
    sections: step(steps.sections, design.sections),
    margins: step(steps.margins, design.margins),
    ...colorsOf(design, defaultColor),
  }
}
