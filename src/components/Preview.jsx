import { useEffect, useRef, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import texts from '../locales/es.js'
import { cvDocument } from '../templates/document.jsx'
import PdfPage from './PdfPage.jsx'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

// In ms. Generating the PDF is costly: it is not done on every keystroke, only after typing stops.
const delay = 500
// In px, the same as .pdf-pages in App.css, which sizes the pages on screen; here they only
// decide the size the pages are drawn at. So pages do not look huge on large screens:
const maxWidth = 900
// Two pages side by side once each can be at least this wide:
const minTwoWidth = 640
const gap = 28

/** Width of each page, in px, for a preview `available` px wide holding `pageCount` pages. */
function pageWidth(available, pageCount) {
  const half = (available - gap) / 2
  const each = pageCount > 1 && half >= minTwoWidth ? half : available
  return Math.floor(Math.min(each, maxWidth))
}

// Drawn with pdf.js on <canvas> instead of the browser's PDF viewer,
// so its toolbar does not show and it does not flicker when regenerating.
function Preview({ cv }) {
  const [pdfDocument, setPdfDocument] = useState(null)
  const [width, setWidth] = useState(0)
  const [drawWidth, setDrawWidth] = useState(0)
  const container = useRef(null)
  // The first time it is generated without waiting
  const wait = useRef(0)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const blob = await pdf(cvDocument(cv)).toBlob()
        const loaded = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise
        if (cancelled) {
          loaded.loadingTask.destroy()
          return
        }
        setPdfDocument(loaded)
      } catch (e) {
        // If it fails, the previous version stays visible
        console.error(e)
      }
    }, wait.current)
    wait.current = delay
    // If the CV changes before it finishes, this version is discarded
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [cv])

  // When a new PDF arrives, the memory of the previous one is freed
  useEffect(() => {
    return () => {
      pdfDocument?.loadingTask.destroy()
    }
  }, [pdfDocument])

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  // While the panel is being resized the page is only stretched; it is redrawn sharp once it
  // stops, because redrawing on every pixel would make the drag stutter
  const pageCount = pdfDocument?.numPages ?? 0
  const targetWidth = pageWidth(width, pageCount)
  useEffect(() => {
    const timer = setTimeout(() => setDrawWidth(targetWidth), 150)
    return () => clearTimeout(timer)
  }, [targetWidth])

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className="preview" ref={container}>
      {!pdfDocument && <p className="loading">{texts.preview.loading}</p>}
      {drawWidth > 0 && (
        <div className="pdf-pages">
          {pages.map((number) => (
            <PdfPage key={number} pdfDocument={pdfDocument} number={number} drawWidth={drawWidth}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default Preview
