import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import texts from '../locales/es.js'
import Toolbar from './Toolbar.jsx'
import { prefersReducedMotion } from './useLeaving.js'

// Loaded separately (lazy) because the PDF library is heavy: the form shows up instantly and
// the PDF a moment later.
const Preview = lazy(() => import('./Preview.jsx'))

// When the browser draws without the graphics card (hardware acceleration turned off), the
// full-screen animation runs at a few frames per second and the screen flashes empty for a
// moment. The browser does not say how it draws, so the first animation is timed: if it was
// that slow, full screen switches instantly on this computer for a week (acceleration may be
// turned back on).
const slowKey = 'cv-gratis-slow-animation'
const slowFor = 7 * 24 * 60 * 60 * 1000
// Median time between frames, in ms. Smooth is about 16 (60 per second); without the graphics
// card it was 55.
const slowFrame = 34

function isSlow() {
  try {
    return Date.now() - Number(localStorage.getItem(slowKey) ?? 0) < slowFor
  } catch {
    return false
  }
}

function timeFrames(transition) {
  const gaps = []
  let last = null
  let running = true
  const tick = (time) => {
    if (!running) return
    if (last !== null) gaps.push(time - last)
    last = time
    requestAnimationFrame(tick)
  }
  transition.ready.then(() => requestAnimationFrame(tick), () => { running = false })
  transition.finished.finally(() => {
    running = false
    // A hidden tab draws no frames at all: nothing to learn from it
    if (gaps.length < 3 || document.hidden) return
    gaps.sort((a, b) => a - b)
    if (gaps[Math.floor(gaps.length / 2)] > slowFrame) {
      try {
        localStorage.setItem(slowKey, String(Date.now()))
      } catch {
        // Without storage it is just timed again next time
      }
    }
  })
}

// The browser animates from a snapshot of the page before to the page after (for full screen:
// pages and toolbar glide, the form fades out). flushSync: React must finish the change inside
// the callback, or the "after" snapshot would still be the old page. Without support it just switches.
// `direction` ('enter' or 'exit') is marked on the page meanwhile: the top bar's frosted backdrop
// fades out or in by it (App.css).
function withTransition(update, direction) {
  if (!document.startViewTransition || prefersReducedMotion() || isSlow()) {
    update()
    return
  }
  const root = document.documentElement
  root.dataset.fullScreenTransition = direction
  const transition = document.startViewTransition(() => flushSync(update))
  timeFrames(transition)
  transition.finished.finally(() => {
    if (root.dataset.fullScreenTransition === direction) delete root.dataset.fullScreenTransition
  })
}

/**
 * The preview with its toolbar. Full screen lives here and not in App: the animation waits
 * for React to redraw what changed, and from App that was the whole form, which froze the
 * start of the animation on modest computers.
 */
function PreviewPanel({ cv, onTemplateChange, onDesignChange }) {
  const [fullScreen, setFullScreen] = useState(false)

  // Stable, so the toolbar (memo) does not redraw on every keystroke
  const changeFullScreen = useCallback((value) => {
    withTransition(() => setFullScreen(value), value ? 'enter' : 'exit')
  }, [])

  useEffect(() => {
    if (!fullScreen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') withTransition(() => setFullScreen(false), 'exit')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullScreen])

  return (
    <section className={fullScreen ? 'preview-panel full-screen' : 'preview-panel'}>
      <Suspense fallback={<p className="loading">{texts.preview.loading}</p>}>
        <Preview cv={cv}/>
      </Suspense>
      <Toolbar
        template={cv.template}
        onTemplateChange={onTemplateChange}
        design={cv.design}
        onDesignChange={onDesignChange}
        fullScreen={fullScreen}
        onFullScreenChange={changeFullScreen}
      />
    </section>
  )
}

export default PreviewPanel
