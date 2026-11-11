import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { buildPdf } from './pdfClient.js'
import { language, sampleCvFor } from '../locales/index.js'
import { samplePhoto } from '../data/samplePhoto.js'

// Loaded with import() from the template picker: it pulls in the heavy PDF libraries.

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

// The sample CV never changes, so each thumbnail is drawn once per session
const cache = new Map()

async function render(id, width) {
  const sampleCv = sampleCvFor(language)
  const cv = { ...sampleCv, template: id, personal: { ...sampleCv.personal, photo: samplePhoto() } }
  const pdfDocument = await pdfjs.getDocument({ data: await buildPdf(cv) }).promise
  try {
    const page = await pdfDocument.getPage(1)
    const scale = (width / page.getViewport({ scale: 1 }).width) * (window.devicePixelRatio || 1)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    await page.render({ canvas, viewport }).promise
    return canvas.toDataURL('image/png')
  } finally {
    pdfDocument.loadingTask.destroy()
  }
}

// Image (data URL) of the first page of a template filled with the sample CV
export function templateThumbnail(id, width) {
  if (!cache.has(id)) {
    const promise = render(id, width)
    // A failed attempt should not stay cached forever
    promise.catch(() => cache.delete(id))
    cache.set(id, promise)
  }
  return cache.get(id)
}
