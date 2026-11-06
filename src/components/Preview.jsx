import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import texts from '../locales/es.js'
import { buildPdf } from '../templates/pdfClient.js'
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

// Ctrl + wheel zoom, as a factor of the size that fits the panel
const minZoom = 0.5
const maxZoom = 3
// How fast the wheel zooms: a mouse wheel notch (deltaY ≈ 100) is about 20 %, and the many
// small steps of a touchpad pinch add up smoothly
const zoomSpeed = 0.002

function animating() {
  try {
    return document.documentElement.matches(':active-view-transition')
  } catch {
    // A browser that does not know the selector has no such animations either
    return false
  }
}

// The box around all the pages on screen. Not that of .pdf-pages: zoomed in, the pages spill
// out of it, and it stays as wide as the panel.
function pagesBox(preview) {
  const pages = [...preview.querySelectorAll('.pdf-page')].map((page) => page.getBoundingClientRect())
  if (!pages.length) return null
  const left = Math.min(...pages.map((r) => r.left))
  const top = Math.min(...pages.map((r) => r.top))
  const width = Math.max(...pages.map((r) => r.right)) - left
  const height = Math.max(...pages.map((r) => r.bottom)) - top
  return { left, top, width, height }
}

// Drawn with pdf.js on <canvas> instead of the browser's PDF viewer,
// so its toolbar does not show and it does not flicker when regenerating.
function Preview({ cv }) {
  const [pdfDocument, setPdfDocument] = useState(null)
  const [width, setWidth] = useState(0)
  const [drawWidth, setDrawWidth] = useState(0)
  const [zoom, setZoom] = useState(1)
  const container = useRef(null)
  // The pointer of the last zoom step, to keep the same spot of the pages under it
  const anchor = useRef(null)
  // The first time it is generated without waiting
  const wait = useRef(0)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const loaded = await pdfjs.getDocument({ data: await buildPdf(cv) }).promise
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
  const targetWidth = Math.round(pageWidth(width, pageCount) * zoom)
  useEffect(() => {
    // Nor while the full-screen animation runs: redrawing big pages costs whole frames, and it
    // made the end of the animation stutter. It waits for it to finish.
    let timer
    function draw() {
      if (animating()) timer = setTimeout(draw, 100)
      else setDrawWidth(targetWidth)
    }
    timer = setTimeout(draw, 150)
    return () => clearTimeout(timer)
  }, [targetWidth])

  // Ctrl + wheel zooms the preview only, not the whole page as the browser would. A touchpad
  // pinch arrives the same way (with ctrlKey set). React's onWheel cannot preventDefault (it
  // is passive), hence the listener by hand.
  useEffect(() => {
    const element = container.current
    function handleWheel(e) {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const box = pagesBox(element)
      if (!box) return
      // Where the pointer is on the pages, as a fraction, so it stays under the pointer
      anchor.current = {
        x: e.clientX, y: e.clientY,
        fx: (e.clientX - box.left) / box.width, fy: (e.clientY - box.top) / box.height,
      }
      setZoom((current) => {
        const next = Math.min(Math.max(current * Math.exp(-e.deltaY * zoomSpeed), minZoom), maxZoom)
        // Passing through 100 % stops there, so the wheel can always land back on it
        return (current - 1) * (next - 1) < 0 ? 1 : next
      })
    }
    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [])

  // Before the paint, so the pages never show a frame away from the pointer
  useLayoutEffect(() => {
    const point = anchor.current
    if (!point) return
    anchor.current = null
    const box = pagesBox(container.current)
    if (!box) return
    container.current.scrollLeft += box.left + point.fx * box.width - point.x
    container.current.scrollTop += box.top + point.fy * box.height - point.y
  }, [zoom])

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  const percent = Math.round(zoom * 100)
  // Back at 100 %, the pill stays a moment to say so and then fades out (App.css), unless the
  // zoom changes again meanwhile. Updated while rendering, React's way of following a change.
  const [lingering, setLingering] = useState(false)
  const [previousPercent, setPreviousPercent] = useState(percent)
  if (percent !== previousPercent) {
    setPreviousPercent(percent)
    setLingering(percent === 100)
  }

  return (
    <>
      <div className="preview" ref={container}>
        {!pdfDocument && <p className="loading">{texts.preview.loading}</p>}
        {drawWidth > 0 && (
          <div className="pdf-pages" style={{ '--zoom': zoom }}>
            {pages.map((number) => (
              <PdfPage key={number} pdfDocument={pdfDocument} number={number} drawWidth={drawWidth}/>
            ))}
          </div>
        )}
      </div>
      {(percent !== 100 || lingering) && (
        <button type="button" className={percent === 100 ? 'zoom-reset frost btn btn-small fading' : 'zoom-reset frost btn btn-small'}
          data-hint={texts.preview.zoomReset} aria-label={`${texts.preview.zoom(percent)}. ${texts.preview.zoomReset}`}
          onClick={() => setZoom(1)} onAnimationEnd={(e) => e.animationName === 'zoom-fade' && setLingering(false)}>
          {texts.preview.zoom(percent)}
        </button>
      )}
    </>
  )
}

export default Preview
