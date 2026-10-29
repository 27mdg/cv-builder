import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { designValues } from '../../data/design.js'
import { hasText, personalDetails, filledSections, sectionTitle, pageWithFooter } from '../format.js'
import { RichText } from '../parts/RichText.jsx'
import { Footer, Signature } from '../parts/closing.jsx'
import { KeepWithFirst } from '../parts/blocks.jsx'
import { sectionItems } from '../parts/sectionItems.jsx'
import { Bar } from '../parts/levels.jsx'
import { PdfIcon } from '../parts/icons.jsx'

// Full-width header band with the name; round photo resting on the band; grey sidebar
// with titles in white boxes; skills as level bars in the main column.

const sidebarWidth = 205
const headerHeight = 150
const photoSize = 136
const inSidebar = ['languages', 'hobbies', 'qualities']

function createStyles(v) {
  const fontSize = (pt) => pt * v.scale
  const pagePadding = 36 * v.margins
  return StyleSheet.create({
    page: {
      paddingVertical: pagePadding,
      fontFamily: v.font,
      fontSize: fontSize(10),
      lineHeight: v.lineHeight,
      color: '#222',
    },
    background: { position: 'absolute', top: 0, bottom: 0, left: 0, width: sidebarWidth, backgroundColor: '#e6e8ec' },
    // Negative margin so the band starts at the very top of the page, above the page padding
    header: {
      marginTop: -pagePadding,
      height: headerHeight,
      paddingLeft: sidebarWidth + 26,
      paddingRight: 32 * v.margins,
      paddingBottom: 22,
      justifyContent: 'flex-end',
      backgroundColor: v.accent,
    },
    name: { fontSize: fontSize(30), lineHeight: 1.1, fontWeight: 'bold', color: v.onAccent },
    jobTitle: {
      marginTop: 6,
      fontSize: fontSize(11),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: v.onAccentMuted,
    },
    photoRing: {
      position: 'absolute',
      top: headerHeight - photoSize + 34,
      left: (sidebarWidth - photoSize) / 2,
      width: photoSize,
      height: photoSize,
      borderRadius: photoSize / 2,
      borderWidth: 5,
      borderColor: '#ffffff',
      backgroundColor: '#ffffff',
    },
    photo: { width: photoSize - 10, height: photoSize - 10, borderRadius: (photoSize - 10) / 2, objectFit: 'cover' },
    // The main column comes first in the code so ATS read it first; row-reverse draws it on the right
    body: { flexDirection: 'row-reverse' },
    sidebar: { width: sidebarWidth, fontSize: fontSize(9.5) },
    sidebarBelowPhoto: { paddingTop: 34 },
    sidebarSection: { marginTop: 18 * v.sections },
    sidebarTitle: {
      marginHorizontal: 14,
      marginBottom: 8,
      paddingVertical: 4,
      paddingHorizontal: 12,
      fontSize: fontSize(11),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: v.accentText,
      backgroundColor: '#ffffff',
    },
    sidebarContent: { paddingHorizontal: 26 },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 * v.paragraphs },
    contactIcon: { width: 18 },
    contactText: { flex: 1 },
    bullet: { flexDirection: 'row', marginTop: 3 * v.paragraphs },
    bulletMark: { width: 10 },
    bulletText: { flex: 1 },
    languageRow: { flexDirection: 'row', marginTop: 3 * v.paragraphs },
    languageName: { width: 72, fontWeight: 'bold', fontSize: fontSize(8.5), textTransform: 'uppercase', color: v.accentText },
    languageLevel: { flex: 1, paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: v.accentText },
    main: { flex: 1, paddingLeft: 26, paddingRight: 32 * v.margins },
    section: { marginTop: 18 * v.sections },
    sectionTitle: {
      fontSize: fontSize(17),
      lineHeight: 1.2,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: v.accentText,
      marginBottom: 2,
    },
    skillRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 * v.paragraphs },
    skillName: { flex: 1, paddingRight: 10, fontSize: fontSize(9), fontWeight: 'bold', textTransform: 'uppercase', color: v.accentText },
  })
}

function mainTextStyles(v) {
  const fontSize = (pt) => pt * v.scale
  return {
    item: { marginTop: 10 * v.paragraphs },
    itemTitle: { fontWeight: 'bold', textTransform: 'uppercase', color: v.accentText },
    // No italics: only regular and bold are registered for each font (src/templates/fonts.js)
    detail: { fontWeight: 'bold', fontSize: fontSize(9.5), color: v.accentText },
    description: { marginTop: 3, fontSize: fontSize(9.5) },
    line: { marginTop: 3 * v.paragraphs },
  }
}

function SidebarSection({ s, title, children }) {
  return (
    <View style={s.sidebarSection}>
      <Text style={s.sidebarTitle} minPresenceAhead={30}>{title}</Text>
      <View style={s.sidebarContent}>{children}</View>
    </View>
  )
}

function Section({ s, title, items }) {
  return (
    <View style={s.section}>
      <KeepWithFirst head={<Text style={s.sectionTitle}>{title}</Text>} items={items}/>
    </View>
  )
}

// A row, so a long line wraps under its own text and not under the bullet
function Bullet({ s, children }) {
  return (
    <View style={s.bullet} wrap={false}>
      <Text style={s.bulletMark}>•</Text>
      <Text style={s.bulletText}>{children}</Text>
    </View>
  )
}

function SidebarList({ s, sectionKey, list }) {
  if (sectionKey === 'languages') {
    return list.map((item) => (
      <View key={item.id} style={s.languageRow} wrap={false}>
        <Text style={s.languageName}>{item.language}</Text>
        <Text style={s.languageLevel}>{texts.common.languageLevels[item.level] ?? ''}</Text>
      </View>
    ))
  }
  const field = sectionKey === 'hobbies' ? 'interest' : 'quality'
  return list
    .filter((item) => hasText(item[field]))
    .map((item) => <Bullet key={item.id} s={s}>{item[field]}</Bullet>)
}

function Banner({ cv, template }) {
  const v = designValues(cv.design, template)
  const s = createStyles(v)
  const mainText = mainTextStyles(v)
  const p = cv.personal
  const details = personalDetails(p)
  const filled = filledSections(cv)
  const sidebar = filled.filter(({ key }) => inSidebar.includes(key))
  const main = filled.filter(({ key }) => !inSidebar.includes(key))

  function mainItems(key, list, text) {
    if (!list) return [<RichText key="text" text={text}/>]
    if (key !== 'skills') return sectionItems({ styles: mainText, sectionKey: key, list })
    return list.map((item) => (
      <View key={item.id} style={s.skillRow} wrap={false}>
        <Text style={s.skillName}>{item.skill}</Text>
        {item.level !== '' && <Bar level={item.level} color={v.accent} trackColor="#dcdfe4" width={110}/>}
      </View>
    ))
  }

  const mainBlocks = main.map(({ key, list, text }) => ({
    key,
    title: sectionTitle(cv, key),
    items: mainItems(key, list, text),
  }))

  return (
    <Document title={details.fullName} author={details.fullName}>
      <Page size="A4" style={pageWithFooter(s.page, cv)}>
        <View style={s.background} fixed/>

        <View style={s.header}>
          {hasText(details.fullName) && <Text style={s.name}>{details.fullName}</Text>}
          {hasText(p.jobTitle) && <Text style={s.jobTitle}>{p.jobTitle}</Text>}
          {p.photo && (
            <View style={s.photoRing}>
              <Image style={s.photo} src={p.photo}/>
            </View>
          )}
        </View>

        <View style={s.body}>
          <View style={s.main}>
            {mainBlocks.map((block) => (
              <Section key={block.key} s={s} title={block.title} items={block.items}/>
            ))}
            <Signature cv={cv}/>
          </View>

          <View style={p.photo ? [s.sidebar, s.sidebarBelowPhoto] : s.sidebar}>
            {details.contact.length > 0 && (
              <SidebarSection s={s} title={texts.common.contact}>
                {details.contact.map((c) => (
                  <View key={c.key} style={s.contactRow} wrap={false}>
                    <View style={s.contactIcon}><PdfIcon name={c.type} size={10} color={v.accentText}/></View>
                    <Text style={s.contactText}>{c.text}</Text>
                  </View>
                ))}
              </SidebarSection>
            )}
            {details.otherDetails.length > 0 && (
              <SidebarSection s={s} title={texts.personal.title}>
                {details.otherDetails.map((line, i) => <Bullet key={i} s={s}>{line}</Bullet>)}
              </SidebarSection>
            )}
            {sidebar.map(({ key, list }) => (
              <SidebarSection key={key} s={s} title={sectionTitle(cv, key)}>
                <SidebarList s={s} sectionKey={key} list={list}/>
              </SidebarSection>
            ))}
          </View>
        </View>
        <Footer cv={cv}/>
      </Page>
    </Document>
  )
}

export default Banner
