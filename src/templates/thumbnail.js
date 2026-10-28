import { pdf } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { cvDocument } from './document.jsx'
import sampleCv from '../locales/sampleCv.es.js'

// Loaded with import() from the template picker: it pulls in the heavy PDF libraries.

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

// The sample CV never changes, so each thumbnail is drawn once per session
const cache = new Map()
let samplePhoto = null

// A neutral silhouette drawn on the fly, so the sample needs no stock photo or licence
function placeholderPhoto() {
  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = 240
  const context = canvas.getContext('2d')
  context.fillStyle = '#cfd4da'
  context.fillRect(0, 0, 240, 240)
  context.fillStyle = '#eef0f3'
  context.beginPath()
  context.arc(120, 96, 46, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(120, 240, 92, 84, 0, Math.PI, 0)
  context.fill()
  return canvas.toDataURL('image/jpeg', 0.9)
}

async function render(id, width) {
  samplePhoto ??= placeholderPhoto()
  const cv = { ...sampleCv, template: id, personal: { ...sampleCv.personal, photo: samplePhoto } }
  const blob = await pdf(cvDocument(cv)).toBlob()
  const pdfDocument = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise
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
