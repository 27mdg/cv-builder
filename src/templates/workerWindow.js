// Imported first by pdfWorker.js. In development, React's hot reload helper (added to every .jsx
// file) expects `window`, which a worker does not have. It is set before the templates load;
// the real build has no such helper.
if (import.meta.env.DEV) self.window ??= self
