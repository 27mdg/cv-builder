import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { designValues } from '../../data/design.js'
import { hasText, join, personalDetails, filledSections, itemParts, sectionTitle } from '../format.js'
import { Dots } from '../parts/levels.jsx'
import { PdfIcon } from '../parts/icons.jsx'
import { Gradient } from '../parts/Gradient.jsx'
import { Timeline, TimelineItem } from '../parts/Timeline.jsx'
import { KeepWithFirst } from '../parts/blocks.jsx'

// Dark gradient sidebar holding the photo, the name and the short lists; the main column
// shows experience and education on a timeline. The name is in the sidebar, so the sidebar
// comes first in the code and ATS still read the name first.

const pageWidth = 595
const pageHeight = 842
const sidebarWidth = 205
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
    background: { position: 'absolute', top: 0, left: 0 },
    sidebar: { width: sidebarWidth, paddingHorizontal: 22, fontSize: fontSize(9.5), color: v.onAccent },
    photo: {
      width: 116,
      height: 116,
      borderRadius: 58,
      borderWidth: 4,
      borderColor: '#ffffff',
      alignSelf: 'center',
      objectFit: 'cover',
      marginBottom: 14,
    },
    name: { fontSize: fontSize(21), lineHeight: 1.1, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
    jobTitle: {
      marginTop: 6,
      fontSize: fontSize(10),
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      textAlign: 'center',
      color: v.onAccentMuted,
    },
    contact: { marginTop: 14 * v.sections },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 * v.paragraphs },
    contactIcon: {
      width: 18,
      height: 18,
      borderRadius: 9,
      marginRight: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    contactText: { flex: 1 },
    sidebarSection: { marginTop: 15 * v.sections },
    sidebarTitle: {
      marginBottom: 6,
      paddingVertical: 3,
      paddingHorizontal: 10,
      fontSize: fontSize(10),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: v.accentText,
      backgroundColor: '#ffffff',
    },
    bullet: { flexDirection: 'row', marginTop: 3 * v.paragraphs },
    bulletMark: { width: 10 },
    bulletText: { flex: 1 },
    skillRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    main: { flex: 1, paddingLeft: 24, paddingRight: 32 * v.margins },
    section: { marginTop: 22 * v.sections },
    firstSection: { marginTop: 0 },
    sectionHead: { marginBottom: 10 },
    sectionTitleBox: { position: 'absolute', top: 0, left: 0 },
    sectionTitle: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      fontSize: fontSize(10.5),
      lineHeight: 1.2,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: v.onAccent,
    },
    item: { marginTop: 10 * v.paragraphs },
    itemTitle: { fontWeight: 'bold', textTransform: 'uppercase', color: v.accentText },
    itemSubtitle: { color: v.accentText },
    itemDate: { fontSize: fontSize(9), color: '#555' },
    description: { marginTop: 3 },
  })
}

function Bullet({ s, children }) {
  return (
    <View style={s.bullet} wrap={false}>
      <Text style={s.bulletMark}>•</Text>
      <View style={s.bulletText}>{children}</View>
    </View>
  )
}

function SidebarSection({ s, title, children }) {
  return (
    <View style={s.sidebarSection}>
      <Text style={s.sidebarTitle} minPresenceAhead={30}>{title}</Text>
      {children}
    </View>
  )
}

function SidebarList({ s, v, sectionKey, list }) {
  if (sectionKey === 'skills') {
    return list.map((item) => (
      <Bullet key={item.id} s={s}>
        <View style={s.skillRow}>
          <Text>{item.skill}</Text>
          {item.level !== '' && <Dots level={item.level} color={v.onAccent} size={5}/>}
        </View>
      </Bullet>
    ))
  }
  if (sectionKey === 'languages') {
    return list.map((item) => (
      <Bullet key={item.id} s={s}>
        <Text>{join([item.language, texts.common.languageLevels[item.level]], ' — ')}</Text>
      </Bullet>
    ))
  }
  const field = sectionKey === 'hobbies' ? 'interest' : 'quality'
  return list
    .filter((item) => hasText(item[field]))
    .map((item) => <Bullet key={item.id} s={s}><Text>{item[field]}</Text></Bullet>)
}

function Section({ s, v, id, title, titleWidth, first, items, container }) {
  // Same height as the title text: fontSize × lineHeight + vertical padding
  const barHeight = 10.5 * v.scale * 1.2 + 8
  const head = (
    <View style={s.sectionHead}>
      <View style={s.sectionTitleBox}>
        <Gradient width={titleWidth} height={barHeight} from={v.accentDark} to={v.accent} id={`bar-${id}`}/>
      </View>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  )
  return (
    <View style={first ? [s.section, s.firstSection] : s.section}>
      <KeepWithFirst head={head} items={items} container={container}/>
    </View>
  )
}

function timelineItems(s, v, sectionKey, list) {
  return list.map((item) => {
    const parts = itemParts(sectionKey, item)
    return (
      <TimelineItem key={item.id} color={v.accentText} style={s.item}>
        {hasText(parts.title) && <Text style={s.itemTitle}>{parts.title}</Text>}
        {hasText(parts.subtitle) && <Text style={s.itemSubtitle}>{parts.subtitle}</Text>}
        {hasText(join([parts.date, parts.place])) && <Text style={s.itemDate}>{join([parts.date, parts.place])}</Text>}
        {hasText(item.description) && <Text style={s.description}>{item.description}</Text>}
      </TimelineItem>
    )
  })
}

function TimelineTemplate({ cv, template }) {
  const v = designValues(cv.design, template)
  const s = createStyles(v)
  const p = cv.personal
  const details = personalDetails(p)
  const filled = filledSections(cv)
  const sidebar = filled.filter(({ key }) => inSidebar.includes(key))
  const main = filled.filter(({ key }) => !inSidebar.includes(key))
  const titleWidth = pageWidth - sidebarWidth - 24 - 32 * v.margins

  const mainBlocks = main.map(({ key, list, text }) => (list
    ? {
      key,
      title: sectionTitle(cv, key),
      items: timelineItems(s, v, key, list),
      container: (children) => <Timeline color={v.accentText}>{children}</Timeline>,
    }
    : { key, title: sectionTitle(cv, key), items: [<Text key="text">{text}</Text>] }))

  return (
    <Document title={details.fullName} author={details.fullName}>
      <Page size="A4" style={s.page}>
        <View style={s.background} fixed>
          <Gradient width={sidebarWidth} height={pageHeight} from={v.accentDark} to={v.accent} id="sidebar"/>
        </View>

        <View style={s.sidebar}>
          {p.photo && <Image style={s.photo} src={p.photo}/>}
          {hasText(details.fullName) && <Text style={s.name}>{details.fullName}</Text>}
          {hasText(p.jobTitle) && <Text style={s.jobTitle}>{p.jobTitle}</Text>}
          {details.contact.length > 0 && (
            <View style={s.contact}>
              {details.contact.map((c) => (
                <View key={c.type} style={s.contactRow} wrap={false}>
                  <View style={s.contactIcon}><PdfIcon name={c.type} size={10} color={v.accentDark}/></View>
                  <Text style={s.contactText}>{c.text}</Text>
                </View>
              ))}
            </View>
          )}
          {details.otherDetails.length > 0 && (
            <SidebarSection s={s} title={texts.personal.title}>
              {details.otherDetails.map((line, i) => <Bullet key={i} s={s}><Text>{line}</Text></Bullet>)}
            </SidebarSection>
          )}
          {sidebar.map(({ key, list }) => (
            <SidebarSection key={key} s={s} title={sectionTitle(cv, key)}>
              <SidebarList s={s} v={v} sectionKey={key} list={list}/>
            </SidebarSection>
          ))}
        </View>

        <View style={s.main}>
          {mainBlocks.map((block, i) => (
            <Section
              key={block.key}
              s={s}
              v={v}
              id={block.key}
              title={block.title}
              titleWidth={titleWidth}
              first={i === 0}
              items={block.items}
              container={block.container}
            />
          ))}
        </View>
      </Page>
    </Document>
  )
}

export default TimelineTemplate
