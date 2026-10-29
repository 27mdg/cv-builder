import { createContext, useContext } from 'react'

// offerUndo(message, restore): after removing something, shows the "Deshacer" notice.
// `restore` puts it back; it must use functional updates, as the CV may have changed since.
export const UndoContext = createContext(() => {})

/** The function that offers to undo a removal (see App.jsx). */
export function useUndo() {
  return useContext(UndoContext)
}

/** Puts `item` back at `index` (or at the end, if the list got shorter). */
export function insertAt(list, index, item) {
  const next = [...list]
  next.splice(Math.min(index, next.length), 0, item)
  return next
}
