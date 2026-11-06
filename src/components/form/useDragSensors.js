import { KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

// Outside the hook, so they are the same objects on every render: the library rebuilds its
// sensors when their options change, and with them the listeners of every drag handle, which
// made every entry of a list redraw on each keystroke.
// A small distance or delay before dragging starts, so a plain click or a scroll still work.
const pointerOptions = { activationConstraint: { distance: 5 } }
const touchOptions = { activationConstraint: { delay: 200, tolerance: 5 } }
const keyboardOptions = { coordinateGetter: sortableKeyboardCoordinates }

/** How dragging starts, shared by sections and by the items inside them (mouse, finger, keyboard). */
export function useDragSensors() {
  return useSensors(
    useSensor(PointerSensor, pointerOptions),
    useSensor(TouchSensor, touchOptions),
    useSensor(KeyboardSensor, keyboardOptions),
  )
}
