import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../locales/es.js'
import sections from '../data/sections.js'
import { designValues } from '../data/design.js'
import { defaultColor } from './list.js'
import { hasText, itemsWithContent, join, itemSummary, personalDetails } from './format.js'

function createStyles(v) {
  const fontSize = (pt) => pt * v.scale
  return StyleSheet.create({
    page: {
      padding: 40 * v.margins,
      fontFamily: v.font,
      fontSize: fontSize(10),
      lineHeight: v.lineHeight,
      color: '#222',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: v.main,
    },
    photo: { width: 70, height: 70, borderRadius: 35, marginRight: 16, objectFit: 'cover' },
    // Own lineHeight: the page one is meant for body text and would overlap here
    name: { fontSize: fontSize(22), lineHeight: 1.2, fontWeight: 'bold', color: v.main },
    jobTitle: { fontSize: fontSize(12), lineHeight: 1.3, marginTop: 2 },
    contact: { fontSize: fontSize(9), color: '#555', marginTop: 4 },
    // Space ABOVE each section (with marginBottom, react-pdf does not split a long
    // section across two pages properly)
    section: { marginTop: 14 * v.sections },
    sectionTitle: {
      fontSize: fontSize(11),
      fontWeight: 'bold',
      color: v.main,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    item: { marginBottom: 6 * v.paragraphs },
    itemTitle: { fontWeight: 'bold' },
    detail: { fontSize: fontSize(9), color: '#666' },
  })
}

function Section({ styles, title, children }) {
  return (
    <View style={styles.section}>
      {/* minPresenceAhead: keeps the title from being left alone at the bottom of a page */}
      <Text style={styles.sectionTitle} minPresenceAhead={40}>{title}</Text>
      {children}
    </View>
  )
}

// wrap={false}: a job or degree split across two pages is hard to read
function Item({ styles, title, detail, description }) {
  return (
    <View style={styles.item} wrap={false}>
      {hasText(title) && <Text style={styles.itemTitle}>{title}</Text>}
      {hasText(detail) && <Text style={styles.detail}>{detail}</Text>}
      {hasText(description) && <Text>{description}</Text>}
    </View>
  )
}

function ListContent({ styles, sectionKey, list }) {
  if (sectionKey === 'skills') {
    return list.map((item) => (
      <Text key={item.id}>{join([item.skill, texts.common.skillLevels[item.level]], ' — ')}</Text>
    ))
  }
  if (sectionKey === 'languages') {
    return list.map((item) => (
      <Text key={item.id}>{join([item.language, texts.common.languageLevels[item.level]], ' — ')}</Text>
    ))
  }
  if (sectionKey === 'hobbies') {
    return <Text>{join(list.map((item) => item.interest))}</Text>
  }
  if (sectionKey === 'qualities') {
    return <Text>{join(list.map((item) => item.quality))}</Text>
  }
  return list.map((item) => {
    const [title, detail] = itemSummary(sectionKey, item)
    return <Item key={item.id} styles={styles} title={title} detail={detail} description={item.description}/>
  })
}

function Classic({ cv }) {
  const styles = createStyles(designValues(cv.design, defaultColor.classic))
  const p = cv.personal
  const details = personalDetails(p)
  const fullName = details.fullName
  const contact = join(details.contact)
  const otherDetails = join(details.otherDetails)

  const hasHeader = p.photo || fullName || p.jobTitle || contact || otherDetails

  return (
    <Document title={fullName} author={fullName}>
      <Page size="A4" style={styles.page}>
        {hasHeader && (
          <View style={styles.header}>
            {p.photo && <Image style={styles.photo} src={p.photo}/>}
            <View>
              {hasText(fullName) && <Text style={styles.name}>{fullName}</Text>}
              {hasText(p.jobTitle) && <Text style={styles.jobTitle}>{p.jobTitle}</Text>}
              {hasText(contact) && <Text style={styles.contact}>{contact}</Text>}
              {hasText(otherDetails) && <Text style={styles.contact}>{otherDetails}</Text>}
            </View>
          </View>
        )}

        {hasText(cv.profile) && (
          <Section styles={styles} title={texts.profile.title}>
            <Text>{cv.profile}</Text>
          </Section>
        )}

        {sections.map(({ key }) => {
          const list = itemsWithContent(cv[key])
          if (list.length === 0) return null
          return (
            <Section key={key} styles={styles} title={texts[key].title}>
              <ListContent styles={styles} sectionKey={key} list={list}/>
            </Section>
          )
        })}

        {hasText(cv.achievements) && (
          <Section styles={styles} title={texts.achievements.title}>
            <Text>{cv.achievements}</Text>
          </Section>
        )}
      </Page>
    </Document>
  )
}

export default Classic
