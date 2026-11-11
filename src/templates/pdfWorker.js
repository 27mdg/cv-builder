import './workerWindow.js'
import { pdf } from '@react-pdf/renderer'
import { cvDocument } from './document.jsx'
import { switchLanguage } from '../locales/index.js'

// Builds the PDF away from the page (pdfClient.js), so typing never waits for it. It stays
// alive between requests: fonts are downloaded once.
self.onmessage = async ({ data: { id, cv, language } }) => {
  try {
    // A worker has no page to tell its language: the page sends its own
    switchLanguage(language)
    const buffer = await (await pdf(cvDocument(cv)).toBlob()).arrayBuffer()
    // Transferred, not copied
    self.postMessage({ id, buffer }, [buffer])
  } catch (e) {
    self.postMessage({ id, error: String(e?.message ?? e) })
  }
}
