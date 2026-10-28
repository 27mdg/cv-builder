import { useEffect, useRef } from 'react'

// width: shown size (CSS). drawWidth: the size it is drawn at, which catches up after resizing.
function PdfPage({ pdfDocument, number, width, drawWidth }) {
  const canvas = useRef(null)

  useEffect(() => {
    let cancelled = false
    let task = null

    async function draw() {
      const page = await pdfDocument.getPage(number)
      if (cancelled) return
      // devicePixelRatio: without it the page looks blurry on high-resolution screens
      const scale = (drawWidth / page.getViewport({ scale: 1 }).width) * (window.devicePixelRatio || 1)
      const viewport = page.getViewport({ scale })
      // Drawn first on a separate canvas and then copied in one go to the visible one:
      // that way the previous page stays visible while the new one is drawn (no flicker)
      const offscreen = document.createElement('canvas')
      offscreen.width = Math.floor(viewport.width)
      offscreen.height = Math.floor(viewport.height)
      task = page.render({ canvas: offscreen, viewport })
      await task.promise
      if (cancelled || !canvas.current) return
      canvas.current.width = offscreen.width
      canvas.current.height = offscreen.height
      canvas.current.getContext('2d').drawImage(offscreen, 0, 0)
    }

    draw().catch(() => {
      // Drawing cancelled because a newer version of the CV arrived: nothing to do
    })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [pdfDocument, number, drawWidth])

  return <canvas ref={canvas} className="pdf-page" style={{ width }}/>
}

export default PdfPage
