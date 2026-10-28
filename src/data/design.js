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
  { id: 'montserrat', name: 'Montserrat', family: 'Montserrat', css: "'Montserrat', sans-serif" },
  { id: 'noto-sans', name: 'Noto Sans', family: 'Noto Sans', css: "'Noto Sans', sans-serif" },
  { id: 'noto-serif', name: 'Noto Serif', family: 'Noto Serif', css: "'Noto Serif', serif" },
  { id: 'open-sans', name: 'Open Sans', family: 'Open Sans', css: "'Open Sans', sans-serif" },
  { id: 'poppins', name: 'Poppins', family: 'Poppins', css: "'Poppins', sans-serif" },
  { id: 'raleway', name: 'Raleway', family: 'Raleway', css: "'Raleway', sans-serif" },
  { id: 'roboto', name: 'Roboto', family: 'Roboto', css: "'Roboto', sans-serif" },
  { id: 'tinos', name: 'Tinos', hint: 'Times New Roman', family: 'Tinos', css: "'Tinos', serif" },
]

// An empty `design.font` means the template's own font
export function fontOf(design, defaultFont) {
  const id = design.font || defaultFont
  return fonts.find((f) => f.id === id) ?? fonts[0]
}

// Multipliers for steps 1–5 (3 is normal); each template applies them to its own sizes
export const steps = {
  size: [0.85, 0.92, 1, 1.08, 1.16],
  paragraphs: [0.35, 0.65, 1, 1.5, 2],
  sections: [0.4, 0.7, 1, 1.4, 1.8],
  margins: [0.5, 0.75, 1, 1.3, 1.6],
}

export const lineHeight = { min: 1, max: 2, step: 0.05 }

// Order of the date format menu; the formatting itself is formatDate in src/templates/format.js
export const dateFormats = ['short', 'long', 'numeric']

// One accent colour per option; each template derives the tones it needs from it
export const colors = [
  { id: 'forest', value: '#3F5B4C' },
  { id: 'navy', value: '#233a5c' },
  { id: 'midnight', value: '#0b2545' },
  { id: 'slate', value: '#2b4466' },
  { id: 'blue', value: '#1f5fa8' },
  { id: 'teal', value: '#2c5f5d' },
  { id: 'green', value: '#2f6b41' },
  { id: 'burgundy', value: '#8c2f39' },
  { id: 'ochre', value: '#b06d27' },
  { id: 'taupe', value: '#a5806d' },
  { id: 'purple', value: '#5b4a8b' },
  { id: 'black', value: '#111111' },
]

function channels(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

function toHex(values) {
  return '#' + values.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')
}

// Mixes a colour with white: amount 0 = the same colour, 1 = white
export function lighten(hex, amount) {
  return toHex(channels(hex).map((c) => c + (255 - c) * amount))
}

// Mixes a colour with black: amount 0 = the same colour, 1 = black
export function darken(hex, amount) {
  return toHex(channels(hex).map((c) => c * (1 - amount)))
}

// A custom colour can be very light, so text on it must switch to dark to stay readable
function isLight(hex) {
  const [r, g, b] = channels(hex)
  return 0.299 * r + 0.587 * g + 0.114 * b > 165
}

function accentOf(design, defaultColor) {
  if (design.color === 'custom' && /^#[0-9a-f]{6}$/i.test(design.customColor)) {
    return design.customColor
  }
  const color = colors.find((c) => c.id === design.color) ?? colors.find((c) => c.id === defaultColor)
  return color.value
}

// Turns cv.design into the numbers and colours the templates use.
// `template`: its entry in src/templates/list.js (default colour and font).
export function designValues(design, template) {
  const font = fontOf(design, template.defaultFont)
  const accent = accentOf(design, template.defaultColor)
  const light = isLight(accent)
  // An invalid saved value (file edited by hand) is treated as normal
  const step = (list, n) => list[n - 1] ?? 1
  return {
    font: font.family,
    scale: step(steps.size, design.size),
    lineHeight: design.lineHeight,
    paragraphs: step(steps.paragraphs, design.paragraphs),
    sections: step(steps.sections, design.sections),
    margins: step(steps.margins, design.margins),
    accent,
    accentLight: lighten(accent, 0.88),
    accentSoft: lighten(accent, 0.6),
    accentDark: darken(accent, 0.35),
    // Text drawn on top of the accent colour
    onAccent: light ? '#222222' : '#ffffff',
    onAccentMuted: light ? '#555555' : lighten(accent, 0.7),
    // A light accent is unreadable as text on white, so templates use this instead
    accentText: light ? darken(accent, 0.55) : accent,
  }
}
