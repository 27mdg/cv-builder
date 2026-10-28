# CV Gratis

A free CV builder: fill in a form, pick a template and download your CV as a PDF.
No sign-up, no watermark, no payment.

The interface is in Spanish (the site targets Spanish speakers); the code is ready for more languages.

## Highlights

- **Private by design**: the CV is generated in the browser and stored only in `localStorage`.
  No data is ever sent to a server.
- **ATS-friendly PDFs**: real, selectable text (not images), built with
  [@react-pdf/renderer](https://react-pdf.org/).
- **Live preview**: the same template renders the preview and the download, drawn page by page
  with [pdf.js](https://mozilla.github.io/pdf.js/) and regenerated shortly after you stop typing.
- **Customisable design**: templates, 13 open-licence fonts, font size, line height, spacing,
  margins and colour schemes (or a custom colour).
- **Import / export**: save a copy of your CV as a `.json` file and load it again later.
- **Open licences only**: fonts come from [Fontsource](https://fontsource.org/) (OFL) and are
  self-hosted, never loaded from third-party servers.

## Tech stack

- React 19 + Vite (JavaScript)
- @react-pdf/renderer for the PDF, pdfjs-dist for the preview
- Plain CSS

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173
npm run lint
npm run build
```

## Project structure

```
src/
  App.jsx            CV state; joins the form and the preview
  components/        UI (top bar, toolbar, menus, preview)
    form/            form sections
  data/              CV shape, form sections, design options, storage, import/export
  templates/         PDF templates and shared formatting helpers
  locales/           UI and PDF texts, one file per language
```

To add a template: create it in `src/templates/` and register it in `document.jsx`,
`list.js` and the locale file.
