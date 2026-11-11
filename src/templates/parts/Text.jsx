import { Text as PdfText } from '@react-pdf/renderer'

// Templates use this Text instead of react-pdf's. react-pdf splits a word wherever its font
// changes (a letter like "ł" comes from the extended font, see fonts.js) and may break the line
// there with a hyphen: "Ș- / TEFAN". The highest penalty (react-pdf's "infinity") forbids those
// breaks, so lines only break between words.
export default function Text(props) {
  return <PdfText hyphenationPenalty={10000} {...props}/>
}
