import { lazy, Suspense, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import texts from '../locales/es.js'
import Toolbar from './Toolbar.jsx'
import { prefersReducedMotion } from './useLeaving.js'

// Loaded separately (lazy) because the PDF library is heavy: the form shows up instantly and
// the PDF a moment later.
const Preview = lazy(() => import('./Preview.jsx'))

// The browser animates from a snapshot of the page before to the page after (for full screen:
// pages and toolbar glide, the form fades out). flushSync: React must finish the change inside
// the callback, or the "after" snapshot would still be the old page. Without support it just switches.
// `direction` ('enter' or 'exit') is marked on the page meanwhile: the top bar's frosted backdrop
// fades out or in by it (App.css).
function withTransition(update, direction) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update()
    return
  }
  const root = document.documentElement
  root.dataset.fullScreenTransition = direction
  const transition = document.startViewTransition(() => flushSync(update))
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

  function changeFullScreen(value) {
    withTransition(() => setFullScreen(value), value ? 'enter' : 'exit')
  }

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
