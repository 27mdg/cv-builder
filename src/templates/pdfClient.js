// Building the PDF takes up to a second on a modest computer; on the page itself it froze typing
// meanwhile. It is built in a worker (pdfWorker.js) instead. If the browser cannot start the
// worker, or it breaks, it is built on the page as before.

import { language } from '../locales/index.js'

let worker = null
let broken = false
let lastId = 0
// id → { resolve, reject, onPage } of the requests the worker has not answered yet
const waiting = new Map()

async function buildOnPage(cv) {
  const [{ pdf }, { cvDocument }] = await Promise.all([import('@react-pdf/renderer'), import('./document.jsx')])
  return new Uint8Array(await (await pdf(cvDocument(cv)).toBlob()).arrayBuffer())
}

function startWorker() {
  try {
    const started = new Worker(new URL('./pdfWorker.js', import.meta.url), { type: 'module' })
    started.onmessage = ({ data }) => {
      const request = waiting.get(data.id)
      if (!request) return
      waiting.delete(data.id)
      // A failure inside a template would fail on the page too, so it is passed on as it is
      if (data.error) request.reject(new Error(data.error))
      else request.resolve(new Uint8Array(data.buffer))
    }
    // The worker could not load or crashed: from now on, and for what it left waiting, the page
    started.onerror = (event) => {
      event.preventDefault()
      broken = true
      started.terminate()
      for (const request of waiting.values()) request.onPage()
      waiting.clear()
    }
    return started
  } catch {
    broken = true
    return null
  }
}

/** The PDF of `cv`, as bytes. */
export function buildPdf(cv) {
  if (!broken) worker ??= startWorker()
  if (broken) return buildOnPage(cv)
  return new Promise((resolve, reject) => {
    const id = ++lastId
    waiting.set(id, { resolve, reject, onPage: () => buildOnPage(cv).then(resolve, reject) })
    worker.postMessage({ id, cv, language })
  })
}
