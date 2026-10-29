# CV Gratis

A free CV builder that aims to be the most complete one you can use: fill in a form, pick a
template and download your CV as a PDF. No sign-up, no watermark, no payment, and no data
leaving your browser.

The interface is in Spanish, as the site is aimed at Spanish speakers first. The code and every
data key are in English, and all visible texts live in locale files, ready for more languages.

## Principles

- **Free for good.** Every feature is available to everyone. There is no paywall at the
  download step.
- **Private by design.** The PDF is generated in the browser and the CV is stored only in
  `localStorage`. Nothing is sent to a server, not even the photo or the signature.
- **Deterministic, no AI.** What you type is what you get: form → data → template → PDF.
- **ATS-friendly.** The PDF has real, selectable text in reading order, not images. Templates
  avoid tricks that confuse applicant tracking systems: no wide letter spacing, no hyphenation,
  and the main column comes first in the text.
- **Open licences only.** Fonts are self-hosted open-licence fonts, never loaded from
  third-party servers. Icons are hand-drawn SVG.

## Features

### The form
- **Every common section.** Profile, education, experience, skills, languages, hobbies,
  courses, internships, extracurricular activities, certificates, qualities, achievements,
  projects, volunteering, awards, publications and references, plus as many custom sections as
  you want, either as lists or as free text.
- **Personal details.** Photo, a list of links (LinkedIn, GitHub, portfolio, website…), and
  optional fields often asked for in Spain: availability, own vehicle, work permit, ID number,
  willingness to travel, and the driving licence as category tags.
- **Rich descriptions.** Bullets, bold and links, edited as they will look and stored as plain
  text with light marks.
- **Order everything.** Drag sections and the items inside them, with the mouse, a finger or
  the keyboard.
- **Hide without deleting.** Hide a whole section or a single item from the PDF, rename any
  section, and add optional details such as a link per item, schedule and work mode, grade,
  official language certificates or skill categories.
- **Closing touches.** A signature, drawn or uploaded, with place and date, and a page footer
  for the data protection clause.
- **Own date picker and fields.** A calendar in a bubble for the birth date, month and year
  menus side by side, and a "Present" switch for ongoing positions.

### The design
- **Five original templates** with live thumbnails.
- **Design controls.** 15 open-licence fonts, font size, line height, paragraph, section and
  page spacing, colour schemes or any custom colour, and the date format.
- **Live preview.** The same template draws the preview and the download, redrawn shortly after
  you stop typing, with a full-screen mode and a resizable split between form and preview.

### Your data
- **Saved automatically** in the browser.
- **Export and import** the CV as a JSON file, photo included, to continue later or on another
  computer.
- **Clear everything** with one button, after a confirmation.

### Interface
A calm, neutral interface with colour only in the details. It has accessible focus states,
screen-reader announcements and short CSS-only animations that switch off for users who prefer
reduced motion.

## Roadmap

- Letter page size, besides A4.
- Import and export in the open JSON Resume format.
- Several CVs saved side by side, one per job offer.
- A cover letter with the same design as the CV.
- A home page and a mobile layout.
- The CV's own texts (section titles, "Present", months) in other languages.
- Idea: a rule-based (non-AI) review that points out missing or overly long content.

## Tech stack

- **React 19 + Vite**, in plain JavaScript.
- **@react-pdf/renderer** builds the PDF, and **pdfjs-dist** draws the preview on canvas.
- **@dnd-kit** handles drag and drop with mouse, touch and keyboard.
- **Fontsource** packages provide the open-licence fonts: DM Sans and Fraunces for the
  interface, and fifteen fonts for the CV.
- **Plain CSS** with design tokens (`src/index.css`). No UI framework and no animation library.

## Project structure

```
src/
  App.jsx               CV state; joins the form, the preview and the toolbar
  index.css, App.css    design tokens and styles
  components/           top bar, toolbar and its menus, preview, splitter, dialogs, icons
    form/               form sections: personal details, list sections, rich text editor,
                        date picker, signature, section library, drag and drop
  data/                 CV shape (initialCv), section fields, design options,
                        storage and import/export
  templates/            everything that becomes PDF
    designs/            one file per template (loaded automatically)
    parts/              shared PDF pieces: rich text, icons, levels, timeline, signature, footer
    format.js           shared formatting: dates, sections in order, contact details…
  locales/              every visible text (es.js) and the sample CV used for thumbnails
```

Adding a template takes three steps: a file in `src/templates/designs/`, a line in
`src/templates/list.js` with its default colour and font, and its name in the locale file.
