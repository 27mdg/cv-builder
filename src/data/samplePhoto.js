let photo = null

/**
 * A neutral silhouette (JPEG data URL) for the sample CV: the template thumbnails and the example
 * CV. Drawn on the fly, so it needs no stock photo or licence; made once per visit.
 */
export function samplePhoto() {
  if (photo) return photo
  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = 240
  const context = canvas.getContext('2d')
  context.fillStyle = '#cfd4da'
  context.fillRect(0, 0, 240, 240)
  context.fillStyle = '#eef0f3'
  context.beginPath()
  context.arc(120, 96, 46, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.ellipse(120, 240, 92, 84, 0, Math.PI, 0)
  context.fill()
  photo = canvas.toDataURL('image/jpeg', 0.9)
  return photo
}
