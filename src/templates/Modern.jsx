import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../locales/es.js'
import sections from '../data/sections.js'
import { designValues } from '../data/design.js'
import { defaultColor } from './list.js'
import { hasText, itemsWithContent, itemSummary, personalDetails } from './format.js'

// In points; A4 is 595 pt wide
const sidebarWidth = 180

const inSidebar = ['skills', 'languages', 'hobbies', 'qualities']

function createStyles(v) {
  const fontSize = (pt) => pt * v.scale
  return StyleSheet.create({
    page: {
      flexDirection: 'row',
      paddingVertical: 36 * v.margins,
      fontFamily: v.font,
      fontSize: fontSize(10),
      lineHeight: v.lineHeight,
      color: '#222',
    },
    // Separate from the sidebar and `fixed` so the colour repeats on every page
    background: { position: 'absolute', top: 0, bottom: 0, left: 0, width: sidebarWidth, backgroundColor: v.sidebar },
    sidebar: { width: sidebarWidth, paddingHorizontal: 18 * v.margins, fontSize: fontSize(9), color: v.sidebarText },
    main: { flex: 1, paddingHorizontal: 28 * v.margins },
    photo: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, alignSelf: 'center', objectFit: 'cover' },
    name: { fontSize: fontSize(24), lineHeight: 1.2, fontWeight: 'bold', color: v.main },
    jobTitle: { fontSize: fontSize(13), lineHeight: 1.3, marginTop: 2, color: '#555' },
    // Space ABOVE each section (marginTop). With marginBottom, react-pdf cannot
    // split a long section across two pages and moves it whole to the next one.
    section: { marginTop: 14 * v.sections },
    // The sidebar is never split across pages, so here the margin can go below
    sidebarSection: { marginBottom: 14 * v.sections },
    sectionTitle: {
      fontSize: fontSize(11),
      fontWeight: 'bold',
      color: v.main,
      textTransform: 'uppercase',
      paddingBottom: 2,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: v.main,
    },
    sidebarTitle: {
      fontSize: fontSize(10),
      fontWeight: 'bold',
      color: v.main,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    item: { marginBottom: 8 * v.paragraphs },
    itemTitle: { fontWeight: 'bold' },
    detail: { fontSize: fontSize(9), color: '#666' },
    sidebarDetail: { fontSize: fontSize(9), color: v.sidebarMutedText },
    line: { marginBottom: 2 * v.paragraphs },
    skill: { marginBottom: 4 * v.paragraphs },
    dots: { flexDirection: 'row', marginTop: 2 },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 3, borderWidth: 0.5, borderColor: v.main },
    filledDot: { backgroundColor: v.main },
  })
}

function Dots({ styles, level }) {
  return (
    <View style={styles.dots}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View key={n} style={n <= level ? [styles.dot, styles.filledDot] : styles.dot}/>
      ))}
    </View>
  )
}

function SidebarSection({ styles, title, children }) {
  return (
    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarTitle} minPresenceAhead={30}>{title}</Text>
      {children}
    </View>
  )
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

function SidebarContent({ styles, sectionKey, list }) {
  if (sectionKey === 'skills') {
    return list.map((item) => (
      <View key={item.id} style={styles.skill} wrap={false}>
        {hasText(item.skill) && <Text>{item.skill}</Text>}
        {item.level !== '' && <Dots styles={styles} level={item.level}/>}
      </View>
    ))
  }
  if (sectionKey === 'languages') {
    return list.map((item) => (
      <View key={item.id} style={styles.skill} wrap={false}>
        {hasText(item.language) && <Text>{item.language}</Text>}
        {item.level !== '' && <Text style={styles.sidebarDetail}>{texts.common.languageLevels[item.level]}</Text>}
      </View>
    ))
  }
  const field = sectionKey === 'hobbies' ? 'interest' : 'quality'
  return list
    .filter((item) => hasText(item[field]))
    .map((item) => <Text key={item.id} style={styles.line}>{item[field]}</Text>)
}

function Modern({ cv }) {
  const styles = createStyles(designValues(cv.design, defaultColor.modern))
  const p = cv.personal
  const details = personalDetails(p)

  const withContent = sections
    .map(({ key }) => ({ key, list: itemsWithContent(cv[key]) }))
    .filter(({ list }) => list.length > 0)
  const sidebar = withContent.filter(({ key }) => inSidebar.includes(key))
  const main = withContent.filter(({ key }) => !inSidebar.includes(key))

  return (
    <Document title={details.fullName} author={details.fullName}>
      <Page size="A4" style={styles.page}>
        <View style={styles.background} fixed/>

        <View style={styles.sidebar}>
          {p.photo && <Image style={styles.photo} src={p.photo}/>}
          {details.contact.length > 0 && (
            <SidebarSection styles={styles} title={texts.templates.contact}>
              {details.contact.map((text, i) => <Text key={i} style={styles.line}>{text}</Text>)}
            </SidebarSection>
          )}
          {details.otherDetails.length > 0 && (
            <SidebarSection styles={styles} title={texts.personal.title}>
              {details.otherDetails.map((text, i) => <Text key={i} style={styles.line}>{text}</Text>)}
            </SidebarSection>
          )}
          {sidebar.map(({ key, list }) => (
            <SidebarSection key={key} styles={styles} title={texts[key].title}>
              <SidebarContent styles={styles} sectionKey={key} list={list}/>
            </SidebarSection>
          ))}
        </View>

        <View style={styles.main}>
          {(hasText(details.fullName) || hasText(p.jobTitle)) && (
            <View>
              {hasText(details.fullName) && <Text style={styles.name}>{details.fullName}</Text>}
              {hasText(p.jobTitle) && <Text style={styles.jobTitle}>{p.jobTitle}</Text>}
            </View>
          )}
          {hasText(cv.profile) && (
            <Section styles={styles} title={texts.profile.title}>
              <Text>{cv.profile}</Text>
            </Section>
          )}
          {main.map(({ key, list }) => (
            <Section key={key} styles={styles} title={texts[key].title}>
              {list.map((item) => {
                const [title, detail] = itemSummary(key, item)
                return <Item key={item.id} styles={styles} title={title} detail={detail} description={item.description}/>
              })}
            </Section>
          ))}
          {hasText(cv.achievements) && (
            <Section styles={styles} title={texts.achievements.title}>
              <Text>{cv.achievements}</Text>
            </Section>
          )}
        </View>
      </Page>
    </Document>
  )
}

export default Modern
