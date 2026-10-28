import { View, Text } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { hasText, itemSummary } from '../format.js'

// Content blocks every template reuses; each one passes its own `styles`
// (item, itemTitle, detail, line) so the look stays template-specific.

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

const simpleField = { hobbies: 'interest', qualities: 'quality' }

// Any list section as stacked blocks. `renderLevel(item)` lets a template draw skill levels
// its own way (dots, bars); without it, levels are written as text.
export function SectionItems({ styles, sectionKey, list, renderLevel }) {
  if (sectionKey === 'skills') {
    return list.map((item) => (
      <View key={item.id} style={styles.line} wrap={false}>
        {hasText(item.skill) && <Text>{item.skill}</Text>}
        {item.level !== '' && (renderLevel
          ? renderLevel(item)
          : <Text style={styles.detail}>{texts.common.skillLevels[item.level]}</Text>)}
      </View>
    ))
  }
  if (sectionKey === 'languages') {
    return list.map((item) => (
      <View key={item.id} style={styles.line} wrap={false}>
        {hasText(item.language) && <Text>{item.language}</Text>}
        {item.level !== '' && <Text style={styles.detail}>{texts.common.languageLevels[item.level]}</Text>}
      </View>
    ))
  }
  if (simpleField[sectionKey]) {
    const field = simpleField[sectionKey]
    return list
      .filter((item) => hasText(item[field]))
      .map((item) => <Text key={item.id} style={styles.line}>{item[field]}</Text>)
  }
  return list.map((item) => {
    const [title, detail] = itemSummary(sectionKey, item)
    return <Item key={item.id} styles={styles} title={title} detail={detail} description={item.description}/>
  })
}
