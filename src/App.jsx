import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import { loadCv, saveCv } from './data/storage.js'
import { baseName } from './data/file.js'
import initialCv from './data/initialCv.js'
import texts from './locales/es.js'
import PersonalDetails from './components/form/PersonalDetails.jsx'
import LongText from './components/form/LongText.jsx'
import sections from './data/sections.js'
import Section from './components/form/Section.jsx'
import ListSection from './components/form/ListSection.jsx'
import SortableSections from './components/form/SortableSections.jsx'
import DownloadButton from './components/DownloadButton.jsx'
import ClearButton from './components/ClearButton.jsx'
import ImportButton from './components/ImportButton.jsx'
import ExportButton from './components/ExportButton.jsx'
import Toolbar from './components/Toolbar.jsx'

// The preview is loaded separately (lazy) because the PDF library is heavy:
// the form shows up instantly and the PDF a moment later.
const Preview = lazy(() => import('./components/Preview.jsx'))

function App() {
  const [cv, setCv] = useState(loadCv)

  useEffect(() => {
    saveCv(cv)
  }, [cv])

  const [fullScreen, setFullScreen] = useState(false)

  useEffect(() => {
    if (!fullScreen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape') setFullScreen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullScreen])

  // Changes always start from the latest version of the CV (previous), not from `cv`.
  // That way, if two changes arrive almost at once (e.g. the photo, which takes a moment
  // to resize), the second one does not wipe out the first.
  function changeSection(key, value) {
    setCv((previous) => ({ ...previous, [key]: value }))
  }

  function changeDesign(field, value) {
    setCv((previous) => ({ ...previous, design: { ...previous.design, [field]: value } }))
  }

  function changePersonal(field, value) {
    setCv((previous) => ({ ...previous, personal: { ...previous.personal, [field]: value } }))
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
  }

  function sectionContent(key) {
    const listSection = sections.find((section) => section.key === key)
    if (!listSection) {
      return <LongText value={cv[key]} hint={texts[key].hint} onChange={(value) => changeSection(key, value)}/>
    }
    return (
      <ListSection
        sectionKey={key}
        fields={listSection.fields}
        list={cv[key]}
        onChange={(list) => changeSection(key, list)}
      />
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        {/* Temporary logo: it will link to the home page once there is one */}
        <a href="/" className="logo">{texts.app.title}</a>
        {/* The placeholder shows the automatic name that is used if left empty */}
        <input
          className="file-name"
          aria-label={texts.file.name}
          placeholder={baseName({ ...cv, fileName: '' })}
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
          <p className="notice">{texts.storage.notice}</p>
          <Section title={texts.personal.title} open>
            <PersonalDetails data={cv.personal} onChange={changePersonal}/>
          </Section>
          <SortableSections
            order={cv.sectionOrder}
            onReorder={(order) => changeSection('sectionOrder', order)}
            renderContent={sectionContent}
          />
        </section>
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
            onFullScreenChange={setFullScreen}
          />
        </section>
      </main>
    </div>
  )
}

export default App
