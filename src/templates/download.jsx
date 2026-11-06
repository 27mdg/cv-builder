import { buildPdf } from './pdfClient.js'
import { baseName, downloadBlob } from '../data/file.js'

// Loaded with import() when "Download" is clicked

export async function downloadPdf(cv) {
  const bytes = await buildPdf(cv)
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), baseName(cv) + '.pdf')
}
