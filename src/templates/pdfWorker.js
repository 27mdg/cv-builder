import './workerWindow.js'
import { pdf } from '@react-pdf/renderer'
import { cvDocument } from './document.jsx'

// Builds the PDF away from the page (pdfClient.js), so typing never waits for it. It stays
// alive between requests: fonts are downloaded once.
self.onmessage = async ({ data: { id, cv } }) => {
  try {
    const buffer = await (await pdf(cvDocument(cv)).toBlob()).arrayBuffer()
    // Transferred, not copied
    self.postMessage({ id, buffer }, [buffer])
  } catch (e) {
    self.postMessage({ id, error: String(e?.message ?? e) })
  }
}
