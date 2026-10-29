import { Fragment } from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import texts from '../../locales/es.js'
import { designValues } from '../../data/design.js'
import { hasText, join, personalDetails, filledSections, itemParts, sectionTitle, pageWithFooter, languageLevel } from '../format.js'
import { RichText } from '../parts/RichText.jsx'
import { Footer, Signature } from '../parts/closing.jsx'
import { PdfIcon } from '../parts/icons.jsx'
import { Dots } from '../parts/levels.jsx'
import { KeepWithFirst } from '../parts/blocks.jsx'

// Dark sidebar with the profile, extra details and contact, split by thin white rules and
// light uppercase headings; big name and dark rules in the main column, which ends with
// skills and languages side by side.

const sidebarWidth = 205
const inSidebar = ['profile', 'hobbies', 'qualities']
const sideBySide = ['skills', 'languages']

function createStyles(v) {
  const fontSize = (pt) => pt * v.scale
  const heading = {
    fontSize: fontSize(13),
    lineHeight: 1.2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  }
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
    sidebar: { width: sidebarWidth, paddingHorizontal: 24, fontSize: fontSize(9.5), color: v.onAccent },
    photo: { width: 130, height: 130, borderRadius: 65, alignSelf: 'center', objectFit: 'cover', marginBottom: 4 },
    sidebarRule: { height: 1.5, marginTop: 18 * v.sections, backgroundColor: v.onAccent },
    sidebarHeading: { ...heading, marginTop: 12, marginBottom: 6 },
    line: { marginTop: 3 * v.paragraphs },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 * v.paragraphs },
    contactIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: v.onAccent,
    },
    contactText: { flex: 1 },
    main: { flex: 1, paddingLeft: 28, paddingRight: 32 * v.margins },
    name: { fontSize: fontSize(32), lineHeight: 1.1, fontWeight: 'bold', color: v.accentText },
    jobTitle: { marginTop: 4, fontSize: fontSize(15), lineHeight: 1.3, color: v.accentText },
    section: { marginTop: 20 * v.sections },
    rule: { height: 1.5, backgroundColor: '#222' },
    heading: { ...heading, marginTop: 14, color: v.accentText },
    item: { marginTop: 10 * v.paragraphs },
    itemTitle: { fontWeight: 'bold', color: v.accentText },
    description: { marginTop: 3, fontSize: fontSize(9.5) },
    columns: { flexDirection: 'row', marginTop: 20 * v.sections },
    column: { flex: 1 },
    columnGap: { width: 20 },
    skillRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 * v.paragraphs },
    languageName: { marginTop: 6 * v.paragraphs, fontWeight: 'bold', color: v.accentText },
  })
}

// The rule and the heading move together
function Heading({ ruleStyle, headingStyle, title }) {
  return (
    <View wrap={false}>
      <View style={ruleStyle}/>
      <Text style={headingStyle}>{title}</Text>
    </View>
  )
}

function SidebarSection({ s, title, children }) {
  return (
    <View>
      <Heading ruleStyle={s.sidebarRule} headingStyle={s.sidebarHeading} title={title}/>
      {children}
    </View>
  )
}

function Section({ s, title, style, items }) {
  const head = (
    <View>
      <View style={s.rule}/>
      <Text style={s.heading}>{title}</Text>
    </View>
  )
  return (
    <View style={style ?? s.section}>
      <KeepWithFirst head={head} items={items}/>
    </View>
  )
}

function itemList(s, sectionKey, list) {
  return list.map((item) => {
    const parts = itemParts(sectionKey, item)
    const detail = join([parts.subtitle, join([parts.date, parts.place])], ' | ')
    return (
      <View key={item.id} style={s.item} wrap={false}>
        {hasText(parts.title) && <Text style={s.itemTitle}>{parts.title}</Text>}
        {hasText(detail) && <Text>{detail}</Text>}
        {hasText(item.description) && <RichText style={s.description} text={item.description}/>}
      </View>
    )
  })
}

function skillItems(s, v, list) {
  return list.map((item) => (
    <View key={item.id} style={s.skillRow} wrap={false}>
      <Text>- {item.skill}</Text>
      {item.level !== '' && <Dots level={item.level} color={v.accentText} size={5}/>}
    </View>
  ))
}

function languageItems(s, list) {
  return list.map((item) => (
    <View key={item.id} wrap={false}>
      {hasText(item.language) && <Text style={s.languageName}>{item.language}:</Text>}
      {hasText(languageLevel(item)) && <Text>{languageLevel(item)}.</Text>}
    </View>
  ))
}

function Minimal({ cv, template }) {
  const v = designValues(cv.design, template)
  const s = createStyles(v)
  const p = cv.personal
  const details = personalDetails(p)
  const filled = filledSections(cv)
  const sidebar = filled.filter(({ key }) => inSidebar.includes(key))
  const columns = filled.filter(({ key }) => sideBySide.includes(key))
  const main = filled.filter(({ key }) => !inSidebar.includes(key) && !sideBySide.includes(key))
  const field = { hobbies: 'interest', qualities: 'quality' }

  return (
    <Document title={details.fullName} author={details.fullName}>
      <Page size="A4" style={pageWithFooter(s.page, cv)}>
        <View style={s.background} fixed/>

        <View style={s.main}>
          {hasText(details.fullName) && <Text style={s.name}>{details.fullName}</Text>}
          {hasText(p.jobTitle) && <Text style={s.jobTitle}>{p.jobTitle}</Text>}
          {main.map(({ key, list, text }) => (
            <Section
              key={key}
              s={s}
              title={sectionTitle(cv, key)}
              items={list ? itemList(s, key, list) : [<RichText key="text" style={s.item} text={text}/>]}
            />
          ))}
          {columns.length > 0 && (
            <View style={s.columns}>
              {columns.map(({ key, list }, i) => (
                <Fragment key={key}>
                  {i > 0 && <View style={s.columnGap}/>}
                  <Section
                    s={s}
                    title={sectionTitle(cv, key)}
                    style={s.column}
                    items={key === 'skills' ? skillItems(s, v, list) : languageItems(s, list)}
                  />
                </Fragment>
              ))}
            </View>
          )}
          <Signature cv={cv}/>
        </View>

        <View style={s.sidebar}>
          {p.photo && <Image style={s.photo} src={p.photo}/>}
          {sidebar.map(({ key, list, text }) => (
            <SidebarSection key={key} s={s} title={sectionTitle(cv, key)}>
              {list
                ? list.filter((item) => hasText(item[field[key]])).map((item) => (
                  <Text key={item.id} style={s.line}>- {item[field[key]]}</Text>
                ))
                : <RichText style={s.line} text={text}/>}
            </SidebarSection>
          ))}
          {details.otherDetails.length > 0 && (
            <SidebarSection s={s} title={texts.personal.title}>
              {details.otherDetails.map((line, i) => <Text key={i} style={s.line}>- {line}</Text>)}
            </SidebarSection>
          )}
          {details.contact.length > 0 && (
            <SidebarSection s={s} title={texts.common.contact}>
              {details.contact.map((c) => (
                <View key={c.key} style={s.contactRow} wrap={false}>
                  <View style={s.contactIcon}><PdfIcon name={c.type} size={11} color={v.accent}/></View>
                  <Text style={s.contactText}>{c.text}</Text>
                </View>
              ))}
            </SidebarSection>
          )}
        </View>
        <Footer cv={cv}/>
      </Page>
    </Document>
  )
}

export default Minimal
