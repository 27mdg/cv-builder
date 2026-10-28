// Separate from document.jsx so the selector does not load the PDF library.
// The first one is the default.
const templates = ['classic', 'modern']

// ids from `colors` in src/data/design.js
export const defaultColor = {
  classic: 'navy',
  modern: 'teal',
}

export default templates
