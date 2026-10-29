import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { designValues } from '../../data/design.js'
import { hasText, personalDetails, filledSections, sectionTitle, pageWithFooter } from '../format.js'
import { Footer, Signature } from '../parts/closing.jsx'
import { KeepWithFirst } from '../parts/blocks.jsx'
import { sectionItems } from '../parts/sectionItems.jsx'
import { Dots } from '../parts/levels.jsx'

// Light sidebar with the photo inside an arch; name and contact at the top of the main column.

const sidebarWidth = 200
const inSidebar = ['skills', 'languages', 'hobbies', 'qualities']

function createStyles(v) {
  const fontSize = (pt) => pt * v.scale
  const pagePadding = 36 * v.margins
  const text = {
    item: { marginTop: 8 * v.paragraphs },
    itemTitle: { fontWeight: 'bold' },
    detail: { color: '#555' },
    description: { marginTop: 3 },
  }
  return StyleSheet.create({
    page: {
      // The main column comes first in the code so ATS read the name first; row-reverse
      // still draws it on the right
      flexDirection: 'row-reverse',
      paddingVertical: pagePadding,
      fontFamily: v.font,
      fontSize: fontSize(10),
      lineHeight: v.lineHeight,
      color: '#222',
    },
    background: { position: 'absolute', top: 0, bottom: 0, left: 0, width: sidebarWidth, backgroundColor: v.accentLight },
    sidebar: { width: sidebarWidth, fontSize: fontSize(9.5) },
    // Negative margin so the arch starts at the very top of the page, above the page padding
    arch: {
      marginTop: -pagePadding,
      paddingTop: 34,
      paddingBottom: 30,
      alignItems: 'center',
      backgroundColor: v.accentSoft,
      borderBottomLeftRadius: sidebarWidth / 2,
      borderBottomRightRadius: sidebarWidth / 2,
    },
    photo: { width: 132, height: 132, borderRadius: 66, objectFit: 'cover' },
    sidebarSection: { marginTop: 12, paddingHorizontal: 22 },
    // A white strip between sidebar blocks
    sidebarDivider: { height: 4, marginTop: 14 * v.sections, backgroundColor: '#ffffff' },
    sidebarTitle: {
      fontSize: fontSize(10.5),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 5,
    },
    sidebarText: { ...text, line: { marginTop: 4 * v.paragraphs }, detail: { color: '#555' } },
    main: { flex: 1, paddingLeft: 26, paddingRight: 34 * v.margins },
    name: { fontSize: fontSize(30), lineHeight: 1.1, fontWeight: 'bold', color: v.accentText },
    jobTitle: { fontSize: fontSize(15), lineHeight: 1.3, marginTop: 4, fontWeight: 'bold', color: v.accentText },
    contact: { marginTop: 10, fontSize: fontSize(10.5) },
    // Space ABOVE each section: with marginBottom, react-pdf moves a long section whole to the next page
    section: { marginTop: 16 * v.sections },
    firstSection: { marginTop: 18 * v.sections },
    sectionHead: { paddingTop: 12, borderTopWidth: 3, borderTopColor: v.accentSoft },
    sectionTitle: {
      fontSize: fontSize(11.5),
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 2,
    },
    mainText: text,
  })
}

function SidebarSection({ s, title, divider, children }) {
  return (
    <>
      {divider && <View style={s.sidebarDivider}/>}
      <View style={s.sidebarSection}>
        <Text style={s.sidebarTitle} minPresenceAhead={30}>{title}</Text>
        {children}
      </View>
    </>
  )
}

function Section({ s, title, first, items }) {
  const head = (
    <View style={s.sectionHead}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  )
  return (
    <View style={first ? [s.section, s.firstSection] : s.section}>
      <KeepWithFirst head={head} items={items}/>
    </View>
  )
}

function Arch({ cv, template }) {
  const v = designValues(cv.design, template)
  const s = createStyles(v)
  const p = cv.personal
  const details = personalDetails(p)
  const filled = filledSections(cv)
  const sidebar = filled.filter(({ key }) => inSidebar.includes(key))
  const main = filled.filter(({ key }) => !inSidebar.includes(key))

  const sidebarBlocks = [
    details.otherDetails.length > 0 && {
      key: 'personal',
      title: texts.personal.title,
      content: details.otherDetails.map((line, i) => <Text key={i} style={s.sidebarText.line}>{line}</Text>),
    },
    ...sidebar.map(({ key, list }) => ({
      key,
      title: sectionTitle(cv, key),
      content: sectionItems({
        styles: s.sidebarText,
        sectionKey: key,
        list,
        renderLevel: (item) => <Dots level={item.level} color={v.accentText}/>,
      }),
    })),
  ].filter(Boolean)

  const mainBlocks = main.map(({ key, list, text }) => ({
    key,
    title: sectionTitle(cv, key),
    items: list ? sectionItems({ styles: s.mainText, sectionKey: key, list }) : [<Text key="text">{text}</Text>],
  }))

  return (
    <Document title={details.fullName} author={details.fullName}>
      <Page size="A4" style={pageWithFooter(s.page, cv)}>
        <View style={s.background} fixed/>

        <View style={s.main}>
          {hasText(details.fullName) && <Text style={s.name}>{details.fullName}</Text>}
          {hasText(p.jobTitle) && <Text style={s.jobTitle}>{p.jobTitle}</Text>}
          {details.contact.length > 0 && (
            <View style={s.contact}>
              {details.contact.map((c) => (
                <Text key={c.type}>{texts.personal[c.type]}: {c.text}</Text>
              ))}
            </View>
          )}
          {mainBlocks.map((block, i) => (
            <Section key={block.key} s={s} title={block.title} first={i === 0} items={block.items}/>
          ))}
          <Signature cv={cv}/>
        </View>

        <View style={s.sidebar}>
          {p.photo && (
            <View style={s.arch}>
              <Image style={s.photo} src={p.photo}/>
            </View>
          )}
          {sidebarBlocks.map((block, i) => (
            <SidebarSection key={block.key} s={s} title={block.title} divider={i > 0 || Boolean(p.photo)}>
              {block.content}
            </SidebarSection>
          ))}
        </View>
        <Footer cv={cv}/>
      </Page>
    </Document>
  )
}

export default Arch
