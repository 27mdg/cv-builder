import { Font } from '@react-pdf/renderer'
import { extendedFamily, fonts } from '../data/design.js'

// The files come from @fontsource (OFL) and are served from our own site, never from
// Google Fonts (GDPR). react-pdf only downloads a font when a PDF uses it.

// Each font comes split in two files: basic Latin letters ('latin') and the rest of the Latin
// alphabets ('latin-ext': ł ř ş ț ő ğ…, for Polish, Czech, Romanian, Hungarian, Turkish names).
// Both are registered, the second under extendedFamily(); templates list both (designValues)
// and the PDF takes each letter from the first one that has it. Other alphabets (Greek,
// Cyrillic…) would need their own files the same way.
// `?url` makes Vite return the file's address instead of its content.
const files = import.meta.glob('/node_modules/@fontsource/*/files/*-latin*-{400,700}-normal.woff', {
  query: '?url',
  import: 'default',
  eager: true,
})

function file(id, subset, weight) {
  return files[`/node_modules/@fontsource/${id}/files/${id}-${subset}-${weight}-normal.woff`]
}

for (const font of fonts) {
  // Helvetica is built into every PDF reader; its missing letters come from Arimo's extended file
  if (font.id === 'helvetica') continue
  for (const [subset, family] of [['latin', font.family], ['latin-ext', extendedFamily(font.family)]]) {
    Font.register({
      family,
      fonts: [
        { src: file(font.id, subset, 400) },
        { src: file(font.id, subset, 700), fontWeight: 'bold' },
      ],
    })
  }
}

// react-pdf hyphenates with English rules ("planifi-cación"), which looks wrong in Spanish
// and makes ATS read broken words. Lines break only between words.
Font.registerHyphenationCallback((word) => [word])
