import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { designValues } from '../../data/design.js'
import { hasText, join, personalDetails, filledSections, itemParts } from '../format.js'
import { PdfIcon } from '../parts/icons.jsx'
import { KeepWithFirst } from '../parts/blocks.jsx'

// Very dark sidebar with icon headings; big two-line name with the surname in bold;
// job title inside a dark bar; main sections hang from a round icon and a thin line.

const sidebarWidth = 205
const iconSize = 22
const inSidebar = ['skills', 'languages', 'hobbies', 'qualities']
const sectionIcons = {
  personal: 'info',
  profile: 'person',
  education: 'education',
  courses: 'education',
  certificates: 'education',
  experience: 'briefcase',
  internships: 'briefcase',
  activities: 'briefcase',
  skills: 'star',
  qualities: 'star',
  hobbies: 'star',
  languages: 'chat',
  achievements: 'star',
}

function createStyles(v) {
  const fontSize = (pt) => pt * v.scale
  return StyleSheet.create({
    page: {
      // The main column comes first in the code so ATS read the name first;
      // row-reverse still draws it on the right
      flexDirection: 'row-reverse',
      paddingVertical: 36 * v.margins,
      fontFamily: v.font,
      fontSize: fontSize(10),
      lineHeight: v.lineHeight,
      color: '#222',
    },
    background: { position: 'absolute', top: 0, bottom: 0, left: 0, width: sidebarWidth, backgroundColor: v.accent },
    sidebar: { width: sidebarWidth, paddingHorizontal: 26, fontSize: fontSize(9.5), color: v.onAccent },
    photo: {
      width: 130,
      height: 130,
      borderRadius: 65,
      borderWidth: 3,
      borderColor: '#ffffff',
      alignSelf: 'center',
      objectFit: 'cover',
      marginBottom: 6,
    },
    sidebarSection: { marginTop: 22 * v.sections },
    sidebarHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    sidebarTitle: { marginLeft: 8, fontSize: fontSize(13), fontWeight: 'bold' },
    line: { marginTop: 4 * v.paragraphs },
    bullet: { flexDirection: 'row', marginTop: 4 * v.paragraphs },
    bulletMark: { width: 10 },
    bulletText: { flex: 1 },
    muted: { color: v.onAccentMuted },
    main: { flex: 1, paddingLeft: 28, paddingRight: 32 * v.margins },
    firstName: { fontSize: fontSize(34), lineHeight: 1.05, textTransform: 'uppercase', color: v.accentText },
    lastName: { fontSize: fontSize(34), lineHeight: 1.05, fontWeight: 'bold', textTransform: 'uppercase', color: v.accentText },
    jobBar: { marginTop: 10, paddingVertical: 3, paddingHorizontal: 10, backgroundColor: v.accent },
    jobTitle: {
      fontSize: fontSize(9),
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      textAlign: 'right',
      color: v.onAccent,
    },
    section: { marginTop: 22 * v.sections },
    sectionHead: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: {
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: v.accent,
    },
    sectionTitle: { marginLeft: 10, fontSize: fontSize(15), fontWeight: 'bold', color: v.accentText },
    // The thin line that runs under the round icon, along the whole section
    sectionBody: {
      marginLeft: iconSize / 2,
      paddingLeft: iconSize / 2 + 10,
      paddingTop: 4,
      borderLeftWidth: 1,
      borderLeftColor: '#b5b9bf',
    },
    sectionBodyRest: { paddingTop: 0 },
    item: { marginTop: 10 * v.paragraphs },
    itemTitle: { fontSize: fontSize(11.5), textTransform: 'uppercase', letterSpacing: 0.5 },
    itemDetail: { marginTop: 1, fontWeight: 'bold' },
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

function SidebarSection({ s, v, icon, title, children }) {
  return (
    <View style={s.sidebarSection}>
      <View style={s.sidebarHead} wrap={false} minPresenceAhead={30}>
        <PdfIcon name={icon} size={14} color={v.onAccent}/>
        <Text style={s.sidebarTitle}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

function SidebarList({ s, sectionKey, list }) {
  if (sectionKey === 'skills') {
    return list.map((item) => (
      <Bullet key={item.id} s={s}>
        <Text>{item.skill}</Text>
        {item.level !== '' && <Text style={s.muted}>{texts.common.skillLevels[item.level]}</Text>}
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

function Section({ s, v, icon, title, items }) {
  const head = (
    <View style={s.sectionHead}>
      <View style={s.iconCircle}><PdfIcon name={icon} size={12} color={v.onAccent}/></View>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  )
  return (
    <View style={s.section}>
      <KeepWithFirst
        head={head}
        items={items}
        container={(children, isFirst) => (
          <View style={isFirst ? s.sectionBody : [s.sectionBody, s.sectionBodyRest]}>{children}</View>
        )}
      />
    </View>
  )
}

// 'Estudio Lumen (03/2021 – Presente · Valencia)'
function detailLine(parts) {
  const when = join([parts.date, parts.place])
  if (hasText(parts.subtitle) && hasText(when)) return `${parts.subtitle} (${when})`
  return hasText(parts.subtitle) ? parts.subtitle : when
}

function itemElements(s, sectionKey, list) {
  return list.map((item) => {
    const parts = itemParts(sectionKey, item)
    const detail = detailLine(parts)
    return (
      <View key={item.id} style={s.item} wrap={false}>
        {hasText(parts.title) && <Text style={s.itemTitle}>{parts.title}</Text>}
        {hasText(detail) && <Text style={s.itemDetail}>{detail}</Text>}
        {hasText(item.description) && <Text style={s.description}>{item.description}</Text>}
      </View>
    )
  })
}

function Contrast({ cv, template }) {
  const v = designValues(cv.design, template)
  const s = createStyles(v)
  const p = cv.personal
  const details = personalDetails(p)
  const filled = filledSections(cv)
  const sidebar = filled.filter(({ key }) => inSidebar.includes(key))
  const main = filled.filter(({ key }) => !inSidebar.includes(key))

  const mainBlocks = [
    hasText(cv.profile) && { key: 'profile', items: [<Text key="text">{cv.profile}</Text>] },
    ...main.map(({ key, list }) => ({ key, items: itemElements(s, key, list) })),
    hasText(cv.achievements) && { key: 'achievements', items: [<Text key="text">{cv.achievements}</Text>] },
  ].filter(Boolean)

  return (
    <Document title={details.fullName} author={details.fullName}>
      <Page size="A4" style={s.page}>
        <View style={s.background} fixed/>

        <View style={s.main}>
          {hasText(p.firstName) && <Text style={s.firstName}>{p.firstName}</Text>}
          {hasText(p.lastName) && <Text style={s.lastName}>{p.lastName}</Text>}
          {hasText(p.jobTitle) && (
            <View style={s.jobBar}>
              <Text style={s.jobTitle}>{p.jobTitle}</Text>
            </View>
          )}
          {mainBlocks.map((block) => (
            <Section key={block.key} s={s} v={v} icon={sectionIcons[block.key]} title={texts[block.key].title} items={block.items}/>
          ))}
        </View>

        <View style={s.sidebar}>
          {p.photo && <Image style={s.photo} src={p.photo}/>}
          {details.contact.length > 0 && (
            <SidebarSection s={s} v={v} icon="phone" title={texts.common.contact}>
              {details.contact.map((c) => <Text key={c.type} style={s.line}>{c.text}</Text>)}
            </SidebarSection>
          )}
          {details.otherDetails.length > 0 && (
            <SidebarSection s={s} v={v} icon={sectionIcons.personal} title={texts.personal.title}>
              {details.otherDetails.map((line, i) => <Text key={i} style={s.line}>{line}</Text>)}
            </SidebarSection>
          )}
          {sidebar.map(({ key, list }) => (
            <SidebarSection key={key} s={s} v={v} icon={sectionIcons[key]} title={texts[key].title}>
              <SidebarList s={s} sectionKey={key} list={list}/>
            </SidebarSection>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export default Contrast
