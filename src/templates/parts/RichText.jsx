import { View, Text, Link } from '@react-pdf/renderer'
import { parseRichText, fullUrl } from '../format.js'

function Segments({ segments }) {
  return segments.map((s, i) => {
    if (s.href) return <Link key={i} src={fullUrl(s.href)} style={{ color: 'inherit', textDecoration: 'underline' }}>{s.text}</Link>
    if (s.bold) return <Text key={i} style={{ fontWeight: 'bold' }}>{s.text}</Text>
    return s.text
  })
}

/**
 * A description with its bullets, bold and links, as real text (readable by ATS).
 * `style` is the template's text style for it; the lines inherit it.
 */
export function RichText({ text, style }) {
  return (
    <View style={style}>
      {parseRichText(text).map((line, i) => (line.bullet
        ? (
          <View key={i} style={{ flexDirection: 'row' }}>
            <Text style={{ width: 10 }}>•</Text>
            <Text style={{ flex: 1 }}><Segments segments={line.segments}/></Text>
          </View>
        )
        // An empty line keeps its height, as a gap between paragraphs
        : <Text key={i}>{line.segments.length ? <Segments segments={line.segments}/> : ' '}</Text>))}
    </View>
  )
}
