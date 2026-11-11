import { createContext, useContext } from 'react'

// The CV's language, for the boxes where the user writes (spellcheck). Only on them: labels
// and help are the site's language, and screen readers read each part in its own.
export const CvLanguage = createContext(undefined)

/** The `lang` a box where the CV is written should have. */
export function useCvLanguage() {
  return useContext(CvLanguage)
}
