import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { isPublicMode, loadCv, saveCv, setPublicMode } from './data/storage.js'
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
import { PublicModeBar, PublicModeButton } from './components/PublicMode.jsx'
import ImportButton from './components/ImportButton.jsx'
import ExportButton from './components/ExportButton.jsx'
import PreviewPanel from './components/PreviewPanel.jsx'
import UndoToast from './components/UndoToast.jsx'
import HintLayer from './components/HintLayer.jsx'
import { UndoContext, insertAt } from './components/undo.js'
import Splitter from './components/Splitter.jsx'
import { prefersReducedMotion, useLeaving } from './components/useLeaving.js'
import { LayersIcon, PlusIcon } from './components/Icons.jsx'

// In ms
const saveDelay = 300
// Removals the undo notice keeps; older ones can no longer be brought back
const maxUndos = 10

function App() {
  const [cv, setCv] = useState(loadCv)

  const [publicMode, setPublicModeState] = useState(isPublicMode)

  // Saving writes the whole CV, photo included, so it waits for a pause in typing instead of
  // running on every key. Also on a change of mode, so the CV moves to its new place (see
  // setPublicMode). `unsaved` is what still waits: it is saved at once if the tab is hidden or
  // closed meanwhile, so nothing is lost.
  const unsaved = useRef(null)
  useEffect(() => {
    unsaved.current = cv
    const timer = setTimeout(() => {
      saveCv(cv)
      unsaved.current = null
    }, saveDelay)
    return () => clearTimeout(timer)
  }, [cv, publicMode])

  useEffect(() => {
    function saveNow() {
      if (!unsaved.current) return
      saveCv(unsaved.current)
      unsaved.current = null
    }
    function handleVisibility() {
      if (document.visibilityState === 'hidden') saveNow()
    }
    window.addEventListener('pagehide', saveNow)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('pagehide', saveNow)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  // Only what changes in this visit animates, never on page load
  const [publicAnimated, setPublicAnimated] = useState(false)
  const [publicButtonLeaving, setPublicButtonLeaving] = useState(false)
  const { isLeaving: isPublicLeaving, leave: leavePublic, left: publicLeft } = useLeaving()

  function changePublicMode(on) {
    setPublicMode(on)
    setPublicModeState(on)
  }

  // The button shrinks away while the strip slides out from under the top bar
  function turnOnPublicMode() {
    setPublicAnimated(true)
    if (!prefersReducedMotion()) setPublicButtonLeaving(true)
    changePublicMode(true)
  }

  // The strip hides behind the top bar first; the mode changes once it has gone
  function turnOffPublicMode() {
    setPublicAnimated(true)
    leavePublic('bar', () => changePublicMode(false))
  }

  // Optional sections the user added in this visit and has not filled yet. Those with content
  // are always shown, so this does not need to be saved in the CV.
  const [addedSections, setAddedSections] = useState([])
  const { isLeaving: isSectionLeaving, leave: leaveSection, left: sectionLeft } = useLeaving()

  // Removals that can still be undone, oldest first ({ id, message, restore }), and the one the
  // notice shows. Each can be undone on its own, in any order: a restore only puts back its own
  // thing, with functional updates.
  const [undos, setUndos] = useState({ list: [], shown: -1 })
  const closeUndo = useCallback(() => setUndos({ list: [], shown: -1 }), [])
  const showUndo = useCallback((shown) => setUndos((current) => ({ ...current, shown })), [])

  // Stable (useCallback), like the change functions below: the form's sections only redraw when
  // what they receive changes (memo), and a new function on every render would count as a change
  const offerUndo = useCallback((message, restore) => {
    setUndos(({ list }) => {
      const next = [...list, { id: crypto.randomUUID(), message, restore }].slice(-maxUndos)
      return { list: next, shown: next.length - 1 }
    })
  }, [])

  const runUndo = useCallback(() => {
    const undo = undos.list[undos.shown]
    if (!undo) return
    // Outside the state update, which React may run twice
    undo.restore()
    setUndos(({ list, shown }) => {
      const next = list.filter((other) => other.id !== undo.id)
      return { list: next, shown: Math.min(shown, next.length - 1) }
    })
  }, [undos])

  // Ctrl+Z outside the fields; inside them it is the browser's own undo of the typing
  useEffect(() => {
    if (!undos.list.length) return
    function handleKeyDown(e) {
      const typing = e.target.closest('input, textarea, select, [contenteditable="true"]')
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !typing) {
        e.preventDefault()
        runUndo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undos, runUndo])

  // The bar floats over the panels, which start their content below it. Its height changes when
  // the public mode strip slides in or the bar wraps on a narrow window, so it is measured.
  const topLayer = useRef(null)
  useEffect(() => {
    const layer = topLayer.current
    const observer = new ResizeObserver(() => {
      layer.parentElement.style.setProperty('--top-height', `${layer.offsetHeight}px`)
    })
    observer.observe(layer)
    return () => observer.disconnect()
  }, [])

  // Changes always start from the latest version of the CV (previous), not from `cv`.
  // That way, if two changes arrive almost at once (e.g. the photo, which takes a moment
  // to resize), the second one does not wipe out the first.
  // `value` can also be a function of the section's latest value: an item that fades out is
  // removed a moment later, and by then the user may have typed something else
  const changeSection = useCallback((key, value) => {
    setCv((previous) => ({ ...previous, [key]: typeof value === 'function' ? value(previous[key]) : value }))
  }, [])

  // One onChange per section, made once and kept, so its section (memo) can skip redrawing
  const sectionChangers = useRef(new Map())
  function changerFor(key) {
    if (!sectionChangers.current.has(key)) sectionChangers.current.set(key, (value) => changeSection(key, value))
    return sectionChangers.current.get(key)
  }

  const changeDesign = useCallback((field, value) => {
    setCv((previous) => ({ ...previous, design: { ...previous.design, [field]: value } }))
  }, [])

  // Like changeSection, `value` can be a function of the field's latest value
  const changePersonal = useCallback((field, value) => {
    setCv((previous) => {
      const next = typeof value === 'function' ? value(previous.personal[field]) : value
      return { ...previous, personal: { ...previous.personal, [field]: next } }
    })
  }, [])

  const changeSignature = useCallback((field, value) => {
    changeSection('signature', (signature) => ({ ...signature, [field]: value }))
  }, [changeSection])

  // A new template starts with its own colour and font, so it looks like its thumbnail
  const changeTemplate = useCallback((id) => {
    setCv((previous) => ({
      ...previous,
      template: id,
      design: { ...previous.design, color: '', font: '' },
    }))
  }, [])

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

  // Public computer mode: leaves nothing behind, not even what "Deshacer" could bring back.
  // Then the mode turns off, as there is nothing left to protect.
  function finishPublicSession() {
    setCv(initialCv)
    setAddedSections([])
    closeUndo()
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
        ? <ListSection sectionKey="customSection" fields={customFields} list={cv[key]} onChange={changerFor(key)}/>
        : <LongText label={sectionTitle(cv, key)} value={cv[key]} hint={texts.customSection.hint} onChange={changerFor(key)}/>
    }
    const listSection = sections.find((section) => section.key === key)
    if (!listSection) {
      return <LongText label={sectionTitle(cv, key)} value={cv[key]} hint={texts[key].hint} onChange={changerFor(key)}/>
    }
    const list = (
      <ListSection
        sectionKey={key}
        fields={listSection.fields}
        list={cv[key]}
        onChange={changerFor(key)}
      />
    )
    if (key === 'skills') {
      return (
        <>
          <label className="switch-label section-switch">
            <input
              type="checkbox"
              role="switch"
              className="toggle"
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
            className="toggle"
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
      {/* Every field inherits it; set here because Firefox only checks multi-line boxes on its own */}
      <div className="app" spellCheck>
        <div className="top-layer" ref={topLayer}>
          <header className="topbar frost-behind">
            {/* Temporary logo: it will link to the home page once there is one */}
            <a href="/" className="logo">{texts.app.title}</a>
            <input
              className="file-name"
              spellCheck={false}
              aria-label={texts.file.name}
              placeholder={texts.file.placeholder}
              value={cv.fileName}
              onChange={(e) => changeSection('fileName', e.target.value)}
            />
            <div className="actions">
              {(!publicMode || publicButtonLeaving) && (
                <PublicModeButton
                  appear={publicAnimated}
                  leaving={publicButtonLeaving}
                  onLeft={() => setPublicButtonLeaving(false)}
                  onTurnOn={turnOnPublicMode}
                />
              )}
              <ClearButton onClear={clearCv}/>
              <span className="actions-divider" aria-hidden="true"/>
              <ImportButton currentCv={cv} onImport={setCv}/>
              <ExportButton cv={cv}/>
              <DownloadButton cv={cv} publicMode={publicMode}/>
            </div>
          </header>
          {publicMode && (
            <PublicModeBar
              appear={publicAnimated}
              leaving={isPublicLeaving('bar')}
              onLeft={() => publicLeft('bar')}
              onFinish={() => {
                finishPublicSession()
                turnOffPublicMode()
              }}
              onTurnOff={turnOffPublicMode}
            />
          )}
        </div>
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
                    ? <SignatureField value={cv.signature} onChange={changeSignature}/>
                    : (
                      <>
                        <label>
                          {texts.footer.label}
                          <textarea className="long-text" rows={4} placeholder={texts.footer.hint} value={cv.footer}
                            onChange={(e) => changeSection('footer', e.target.value)}/>
                        </label>
                        <div className="chips footer-actions">
                          <button type="button" className="chip" onClick={() => changeSection('footer', texts.footer.dataProtection)}>
                            <span className="chip-plus"><PlusIcon/></span>{texts.footer.useDataProtection}
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
          <Splitter/>
          <PreviewPanel cv={cv} onTemplateChange={changeTemplate} onDesignChange={changeDesign}/>
        </main>
        <UndoToast undos={undos.list} shown={undos.shown} onShow={showUndo} onUndo={runUndo} onClose={closeUndo}/>
        <HintLayer/>
      </div>
    </UndoContext>
  )
}

export default App
