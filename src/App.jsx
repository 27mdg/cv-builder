import { lazy, Suspense, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import './App.css'
import { loadCv, saveCv } from './data/storage.js'
import initialCv from './data/initialCv.js'
import texts from './locales/es.js'
import PersonalDetails from './components/form/PersonalDetails.jsx'
import LongText from './components/form/LongText.jsx'
import sections, { optionalSections } from './data/sections.js'
import { hasText } from './templates/format.js'
import Section from './components/form/Section.jsx'
import ListSection from './components/form/ListSection.jsx'
import SortableSections from './components/form/SortableSections.jsx'
import sectionIcons from './components/form/sectionIcons.js'
import { sectionSummary } from './components/form/sectionSummary.js'
import DownloadButton from './components/DownloadButton.jsx'
import ClearButton from './components/ClearButton.jsx'
import ImportButton from './components/ImportButton.jsx'
import ExportButton from './components/ExportButton.jsx'
import Toolbar from './components/Toolbar.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import Splitter from './components/Splitter.jsx'
import { prefersReducedMotion, useLeaving } from './components/useLeaving.js'
import { PlusIcon } from './components/Icons.jsx'

// The preview is loaded separately (lazy) because the PDF library is heavy:
// the form shows up instantly and the PDF a moment later.
const Preview = lazy(() => import('./components/Preview.jsx'))

// The browser animates from a snapshot of the page before to the page after (for full screen:
// pages and toolbar glide, the form fades out). flushSync: React must finish the change inside
// the callback, or the "after" snapshot would still be the old page. Without support it just switches.
function withTransition(update) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}

function App() {
  const [cv, setCv] = useState(loadCv)

  useEffect(() => {
    saveCv(cv)
  }, [cv])

  const [fullScreen, setFullScreen] = useState(false)

  // Optional sections the user added in this visit and has not filled yet. Those with content
  // are always shown, so this does not need to be saved in the CV.
  const [addedSections, setAddedSections] = useState([])
  const [removingSection, setRemovingSection] = useState(null)
  const { isLeaving: isSectionLeaving, leave: leaveSection, left: sectionLeft } = useLeaving()

  function changeFullScreen(value) {
    withTransition(() => setFullScreen(value))
  }

  useEffect(() => {
    if (!fullScreen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') withTransition(() => setFullScreen(false))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullScreen])

  // Changes always start from the latest version of the CV (previous), not from `cv`.
  // That way, if two changes arrive almost at once (e.g. the photo, which takes a moment
  // to resize), the second one does not wipe out the first.
  // `value` can also be a function of the section's latest value: an item that fades out is
  // removed a moment later, and by then the user may have typed something else
  function changeSection(key, value) {
    setCv((previous) => ({ ...previous, [key]: typeof value === 'function' ? value(previous[key]) : value }))
  }

  function changeDesign(field, value) {
    setCv((previous) => ({ ...previous, design: { ...previous.design, [field]: value } }))
  }

  // Like changeSection, `value` can be a function of the field's latest value
  function changePersonal(field, value) {
    setCv((previous) => {
      const next = typeof value === 'function' ? value(previous.personal[field]) : value
      return { ...previous, personal: { ...previous.personal, [field]: next } }
    })
  }

  // A new template starts with its own colour and font, so it looks like its thumbnail
  function changeTemplate(id) {
    setCv((previous) => ({
      ...previous,
      template: id,
      design: { ...previous.design, color: '', font: '' },
    }))
  }

  // Only what the user typed is cleared; template, design and section order are not personal data
  function clearCv() {
    setCv((previous) => ({
      ...initialCv,
      template: previous.template,
      design: previous.design,
      sectionOrder: previous.sectionOrder,
    }))
    setAddedSections([])
  }

  const hasContent = (key) => (key === 'references' && cv.referencesOnRequest)
    || (Array.isArray(cv[key]) ? cv[key].length > 0 : hasText(cv[key]))
  const visibleOrder = cv.sectionOrder.filter(
    (key) => !optionalSections.includes(key) || hasContent(key) || addedSections.includes(key),
  )
  const hiddenSections = optionalSections.filter((key) => !visibleOrder.includes(key))

  // Dragging only sees the visible sections; hidden ones keep their place in the full order
  function reorderVisible(newVisible) {
    let next = 0
    changeSection('sectionOrder', cv.sectionOrder.map((key) => (visibleOrder.includes(key) ? newVisible[next++] : key)))
  }

  // The new section goes right after the last visible one, just above the "+" buttons the
  // user clicked, instead of somewhere up the form
  function addSection(key) {
    const lastVisible = visibleOrder[visibleOrder.length - 1]
    const order = cv.sectionOrder.filter((k) => k !== key)
    order.splice(order.indexOf(lastVisible) + 1, 0, key)
    changeSection('sectionOrder', order)
    setAddedSections((added) => [...added, key])
  }

  // The section fades out and shrinks first; its content is cleared once it has gone
  function hideSection(key) {
    leaveSection(key, () => {
      changeSection(key, initialCv[key])
      if (key === 'references') changeSection('referencesOnRequest', false)
      setAddedSections((added) => added.filter((k) => k !== key))
    })
  }

  function removeSection(key) {
    if (hasContent(key)) setRemovingSection(key)
    else hideSection(key)
  }

  function changeSectionSetting(key, name, value) {
    changeSection('sectionSettings', (settings) => ({ ...settings, [key]: { ...settings[key], [name]: value } }))
  }

  function sectionProps(key) {
    const summary = sectionSummary(key, cv)
    const hidden = Boolean(cv.sectionSettings[key]?.hidden)
    return {
      icon: sectionIcons[key],
      summary,
      done: summary !== '',
      hidden,
      customTitle: cv.sectionSettings[key]?.title ?? '',
      // The personal details always go in the CV, with their usual title
      onRename: key === 'personal' ? undefined : (title) => changeSectionSetting(key, 'title', title),
      onToggleHidden: key === 'personal' ? undefined : () => changeSectionSetting(key, 'hidden', !hidden),
    }
  }

  function sectionContent(key) {
    const listSection = sections.find((section) => section.key === key)
    if (!listSection) {
      return <LongText value={cv[key]} hint={texts[key].hint} onChange={(value) => changeSection(key, value)}/>
    }
    const list = (
      <ListSection
        sectionKey={key}
        fields={listSection.fields}
        list={cv[key]}
        onChange={(value) => changeSection(key, value)}
      />
    )
    if (key !== 'references') return list
    // The list is kept while hidden, so unticking brings it back
    return (
      <>
        <label className="current references-on-request">
          <input
            type="checkbox"
            checked={cv.referencesOnRequest}
            onChange={(e) => changeSection('referencesOnRequest', e.target.checked)}
          />
          {texts.references.onRequest}
        </label>
        {!cv.referencesOnRequest && list}
      </>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        {/* Temporary logo: it will link to the home page once there is one */}
        <a href="/" className="logo">{texts.app.title}</a>
        <input
          className="file-name"
          aria-label={texts.file.name}
          placeholder={texts.file.placeholder}
          value={cv.fileName}
          onChange={(e) => changeSection('fileName', e.target.value)}
        />
        <div className="actions">
          <ClearButton onClear={clearCv}/>
          <ImportButton currentCv={cv} onImport={setCv}/>
          <ExportButton cv={cv}/>
          <DownloadButton cv={cv}/>
        </div>
      </header>
      <main className="workspace">
        <section className="form-panel">
          <Section title={texts.personal.title} open {...sectionProps('personal')}>
            <PersonalDetails data={cv.personal} onChange={changePersonal}/>
          </Section>
          <SortableSections
            order={visibleOrder}
            onReorder={reorderVisible}
            renderContent={sectionContent}
            sectionProps={sectionProps}
            removable={optionalSections}
            onRemove={removeSection}
            openKeys={addedSections}
            isLeaving={isSectionLeaving}
            onLeft={sectionLeft}
          />
          {hiddenSections.length > 0 && (
            <div className="extra-sections">
              <p className="extra-sections-title">{texts.extraSections.title}</p>
              <div className="chips">
                {hiddenSections.map((key) => (
                  <button type="button" className="chip" key={key} onClick={() => addSection(key)}>
                    <PlusIcon/>{texts[key].title}
                  </button>
                ))}
              </div>
            </div>
          )}
          <ConfirmDialog
            open={removingSection !== null}
            title={removingSection ? texts.extraSections.confirmTitle(texts[removingSection].title) : ''}
            message={texts.extraSections.confirmMessage}
            cancelLabel={texts.extraSections.cancel}
            confirmLabel={texts.extraSections.confirm}
            onConfirm={() => {
              hideSection(removingSection)
              setRemovingSection(null)
            }}
            onCancel={() => setRemovingSection(null)}
          />
        </section>
        {!fullScreen && <Splitter/>}
        <section className={fullScreen ? 'preview-panel full-screen' : 'preview-panel'}>
          <Suspense fallback={<p className="loading">{texts.preview.loading}</p>}>
            <Preview cv={cv}/>
          </Suspense>
          <Toolbar
            template={cv.template}
            onTemplateChange={changeTemplate}
            design={cv.design}
            onDesignChange={changeDesign}
            fullScreen={fullScreen}
            onFullScreenChange={changeFullScreen}
          />
        </section>
      </main>
    </div>
  )
}

export default App
