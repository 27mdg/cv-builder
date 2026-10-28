import { View, Text } from '@react-pdf/renderer'
import { hasText } from '../format.js'

// Content blocks every template reuses; each one passes its own `styles`
// so the look stays template-specific.

// wrap={false}: a job or degree split across two pages is hard to read
export function Item({ styles, title, detail, description }) {
  return (
    <View style={styles.item} wrap={false}>
      {hasText(title) && <Text style={styles.itemTitle}>{title}</Text>}
      {hasText(detail) && <Text style={styles.detail}>{detail}</Text>}
      {hasText(description) && <Text style={styles.description}>{description}</Text>}
    </View>
  )
}

// The heading and the first item form one block that cannot be split, so a heading is never
// left alone at the bottom of a page (minPresenceAhead proved unreliable for this).
// `items` is an array of elements; `container(children, isFirst)` wraps them when the template
// draws something around the items (e.g. a timeline line).
export function KeepWithFirst({ head, items, container = (children) => children }) {
  const [first, ...rest] = items
  return (
    <>
      <View wrap={false}>
        {head}
        {first !== undefined && container(first, true)}
      </View>
      {rest.length > 0 && container(rest, false)}
    </>
  )
}
