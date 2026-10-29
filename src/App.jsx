import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import './App.css'
import { loadCv, saveCv } from './data/storage.js'
import initialCv from './data/initialCv.js'
import texts from './locales/es.js'
import PersonalDetails from './components/form/PersonalDetails.jsx'
import LongText from './components/form/LongText.jsx'
import SignatureField from './components/form/SignatureField.jsx'
import Animated from './components/Animated.jsx'
import SectionLibrary from './components/form/SectionLibrary.jsx'
import sections, { optionalSections, customFields, isCustomKey, newCustomKey } from './data/sections.js'
import { hasText, sectionTitle } from './templates/format.js'
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
import UndoToast from './components/UndoToast.jsx'
import { UndoContext, insertAt } from './components/undo.js'
import Splitter from './components/Splitter.jsx'
import { prefersReducedMotion, useLeaving } from './components/useLeaving.js'
import { LayersIcon, PlusIcon } from './components/Icons.jsx'

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
  const { isLeaving: isSectionLeaving, leave: leaveSection, left: sectionLeft } = useLeaving()

  // The last removal that can still be undone: { id, message, restore }
  const [undo, setUndo] = useState(null)
  const closeUndo = useCallback(() => setUndo(null), [])

  function offerUndo(message, restore) {
    setUndo({ id: crypto.randomUUID(), message, restore })
  }

  function runUndo() {
    undo?.restore()
    setUndo(null)
  }

  // Ctrl+Z outside the fields; inside them it is the browser's own undo of the typing
  useEffect(() => {
    if (!undo) return
    function handleKeyDown(e) {
      const typing = e.target.closest('input, textarea, select, [contenteditable="true"]')
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !typing) {
        e.preventDefault()
        undo.restore()
        setUndo(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo])

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
      // Custom sections are the user's own content: they go too
      sectionOrder: previous.sectionOrder.filter((key) => !isCustomKey(key)),
    }))
    setAddedSections([])
  }

  const hasContent = (key) => (key === 'references' && cv.referencesOnRequest)
    || (Array.isArray(cv[key]) ? cv[key].length > 0 : hasText(cv[key]))
  const visibleOrder = cv.sectionOrder.filter(
    (key) => !optionalSections.includes(key) || hasContent(key) || addedSections.includes(key),
  )
  const hiddenSections = optionalSections.filter((key) => !visibleOrder.includes(key))

  // Signature and footer: not sections of the order, they have fixed places in the CV
  const closingSections = ['signature', 'footer']
  const hasClosing = (key) => (key === 'signature' ? Object.values(cv.signature).some(Boolean) : hasText(cv.footer))
  const visibleClosing = closingSections.filter((key) => hasClosing(key) || addedSections.includes(key))
  const hiddenClosing = closingSections.filter((key) => !visibleClosing.includes(key))

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

  function addCustomSection(type) {
    const key = newCustomKey()
    changeSection(key, type === 'list' ? [] : '')
    addSection(key)
  }

  // A custom section is deleted for good: its content, its place and its settings
  function deleteCustomSection(key) {
    setCv((previous) => {
      const next = { ...previous, sectionOrder: previous.sectionOrder.filter((k) => k !== key) }
      delete next[key]
      next.sectionSettings = { ...previous.sectionSettings }
      delete next.sectionSettings[key]
      return next
    })
  }

  // The section fades out and shrinks first; its content is cleared once it has gone. Instead of
  // asking before, the notice lets the user bring back whatever it had.
  function removeSection(key) {
    const custom = isCustomKey(key)
    const filled = (closingSections.includes(key) ? hasClosing(key) : hasContent(key))
      || (custom && hasText(cv.sectionSettings[key]?.title))
    const saved = {
      content: cv[key],
      onRequest: cv.referencesOnRequest,
      index: cv.sectionOrder.indexOf(key),
      settings: cv.sectionSettings[key],
    }
    const title = sectionTitle(cv, key)
    leaveSection(key, () => {
      if (custom) deleteCustomSection(key)
      else changeSection(key, initialCv[key])
      if (key === 'references') changeSection('referencesOnRequest', false)
      setAddedSections((added) => added.filter((k) => k !== key))
      if (filled) offerUndo(texts.undo.section(title), () => restoreSection(key, saved))
    })
  }

  // What comes back has content (or, for a custom section, its place in the order), so it is
  // shown without adding it to addedSections
  function restoreSection(key, saved) {
    setCv((previous) => {
      const next = { ...previous, [key]: saved.content }
      if (key === 'references') next.referencesOnRequest = saved.onRequest
      if (isCustomKey(key)) {
        next.sectionOrder = insertAt(previous.sectionOrder.filter((k) => k !== key), saved.index, key)
        next.sectionSettings = { ...previous.sectionSettings, [key]: saved.settings }
      }
      return next
    })
  }

  function changeSectionSetting(key, name, value) {
    changeSection('sectionSettings', (settings) => ({ ...settings, [key]: { ...settings[key], [name]: value } }))
  }

  function sectionProps(key) {
    const summary = sectionSummary(key, cv)
    const hidden = Boolean(cv.sectionSettings[key]?.hidden)
    const custom = isCustomKey(key)
    return {
      // The usual title; the one the user wrote is customTitle
      title: custom ? texts.customSection.untitled : texts[key].title,
      icon: custom ? LayersIcon : sectionIcons[key],
      // A new custom section asks for its title straight away
      startRenaming: custom && addedSections.includes(key),
      // Whether it has content (its icon fills in); the summary text itself is not shown
      filled: summary !== '',
      hidden,
      customTitle: cv.sectionSettings[key]?.title ?? '',
      // The personal details always go in the CV, with their usual title
      onRename: key === 'personal' ? undefined : (title) => changeSectionSetting(key, 'title', title),
      onToggleHidden: key === 'personal' ? undefined : () => changeSectionSetting(key, 'hidden', !hidden),
    }
  }

  function sectionContent(key) {
    if (isCustomKey(key)) {
      return Array.isArray(cv[key])
        // Its labels come from texts.customSection, as it has none of its own
        ? <ListSection sectionKey="customSection" fields={customFields} list={cv[key]} onChange={(value) => changeSection(key, value)}/>
        : <LongText value={cv[key]} hint={texts.customSection.hint} onChange={(value) => changeSection(key, value)}/>
    }
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
    if (key === 'skills') {
      return (
        <>
          <label className="switch-label section-switch">
            <input
              type="checkbox"
              role="switch"
              className="switch"
              checked={!cv.sectionSettings.skills?.hideLevel}
              onChange={(e) => changeSectionSetting('skills', 'hideLevel', !e.target.checked)}
            />
            {texts.skills.showLevel}
          </label>
          {list}
        </>
      )
    }
    if (key !== 'references') return list
    // The list is kept while hidden, so unticking brings it back
    return (
      <>
        <label className="switch-label references-on-request">
          <input
            type="checkbox"
            role="switch"
            className="switch"
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
    <UndoContext value={offerUndo}>
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
              removable={[...optionalSections, ...visibleOrder.filter(isCustomKey)]}
              titleOf={(key) => sectionTitle(cv, key)}
              onRemove={removeSection}
              openKeys={addedSections}
              isLeaving={isSectionLeaving}
              onLeft={sectionLeft}
            />
            {visibleClosing.map((key) => (
              <Animated key={key} appear={addedSections.includes(key)} leaving={isSectionLeaving(key)} onLeft={() => sectionLeft(key)}>
                <Section
                  title={texts[key].title}
                  icon={sectionIcons[key]}
                  filled={hasClosing(key)}
                  open={addedSections.includes(key) || undefined}
                  onRemove={() => removeSection(key)}
                >
                  {key === 'signature'
                    ? <SignatureField value={cv.signature} onChange={(field, value) => changeSection('signature', (s) => ({ ...s, [field]: value }))}/>
                    : (
                      <>
                        <label>
                          {texts.footer.label}
                          <textarea className="long-text" rows={4} placeholder={texts.footer.hint} value={cv.footer}
                            onChange={(e) => changeSection('footer', e.target.value)}/>
                        </label>
                        <div className="chips footer-actions">
                          <button type="button" className="chip" onClick={() => changeSection('footer', texts.footer.dataProtection)}>
                            <PlusIcon/>{texts.footer.useDataProtection}
                          </button>
                        </div>
                      </>
                    )}
                </Section>
              </Animated>
            ))}
            {/* Always there: custom sections can be added as many times as the user wants */}
            <SectionLibrary
              keys={[...hiddenSections, ...hiddenClosing]}
              onAdd={(key) => (closingSections.includes(key) ? setAddedSections((added) => [...added, key]) : addSection(key))}
              onAddCustom={addCustomSection}
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
        <UndoToast undo={undo} onUndo={runUndo} onClose={closeUndo}/>
      </div>
    </UndoContext>
  )
}

export default App
