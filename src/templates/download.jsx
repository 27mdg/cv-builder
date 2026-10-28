import { pdf } from '@react-pdf/renderer'
import { cvDocument } from './document.jsx'
import { baseName, downloadBlob } from '../data/file.js'

// The PDF library is heavy: this file is only loaded when "Download" is clicked.

export async function downloadPdf(cv) {
  const blob = await pdf(cvDocument(cv)).toBlob()
  downloadBlob(blob, baseName(cv) + '.pdf')
}
