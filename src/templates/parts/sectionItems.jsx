import { View, Text } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { hasText, itemSummary, languageLevel } from '../format.js'
import { Item } from './blocks.jsx'

const simpleField = { hobbies: 'interest', qualities: 'quality' }

// Any list section as an array of stacked blocks, styled with the template's `styles`
// (item, itemTitle, detail, description, line). `renderLevel(item)` lets a template draw
// skill levels its own way (dots, bars); without it, levels are written as text.
export function sectionItems({ styles, sectionKey, list, renderLevel }) {
  if (sectionKey === 'skills') {
    return withCategories(list, (item) => (
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
        {hasText(languageLevel(item)) && <Text style={styles.detail}>{languageLevel(item)}</Text>}
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

/**
 * Skills drawn by `render(item)`, with each category's name above its first skill
 * (`categoryHead`, see filledSections). The name and that skill stay together on a page.
 */
export function withCategories(list, render) {
  return list.map((item) => (item.categoryHead
    ? (
      <View key={item.id} wrap={false}>
        <Text style={{ marginTop: 6, marginBottom: 2, fontWeight: 'bold' }}>{item.categoryHead}</Text>
        {render(item)}
      </View>
    )
    : render(item)))
}
