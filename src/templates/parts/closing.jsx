import { View, Text, Image } from '@react-pdf/renderer'
import { hasText, join, formatBirthDate } from '../format.js'

/** Small text at the bottom of every page (e.g. the data protection clause). Last child of <Page>. */
export function Footer({ cv, color = '#8a8a8a' }) {
  if (!hasText(cv.footer)) return null
  return (
    <Text
      fixed
      style={{ position: 'absolute', bottom: 12, left: 40, right: 40, fontSize: 6.5, lineHeight: 1.35, color, textAlign: 'center' }}
    >
      {cv.footer.trim()}
    </Text>
  )
}

/** The signature with place and date, right-aligned. Last child of the template's main column. */
export function Signature({ cv, color = '#555555' }) {
  const { image, place, date } = cv.signature
  const line = join([place, formatBirthDate(date)], ', ')
  if (!image && !hasText(line)) return null
  return (
    // Kept in one piece: half a signature at the bottom of a page would look odd
    <View wrap={false} style={{ marginTop: 24, alignItems: 'flex-end' }}>
      {image && <Image src={image} style={{ height: 52, maxWidth: 180, objectFit: 'contain' }}/>}
      {hasText(line) && <Text style={{ marginTop: 4, fontSize: 9, color }}>{line}</Text>}
    </View>
  )
}
