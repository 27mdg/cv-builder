import { useRef, useState } from 'react'

/** True if the user asked their system for less motion: then nothing is animated. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * For lists whose items fade out before they are deleted (see Animated.jsx).
 * leave(id, remove) starts the exit; left(id) runs `remove` once the animation has ended.
 */
export function useLeaving() {
  const [leavingIds, setLeavingIds] = useState([])
  const removals = useRef({})

  function leave(id, remove) {
    // Without animation there would be no "animation ended" event to wait for
    if (prefersReducedMotion()) {
      remove()
      return
    }
    removals.current[id] = remove
    setLeavingIds((ids) => [...ids, id])
  }

  function left(id) {
    const remove = removals.current[id]
    delete removals.current[id]
    setLeavingIds((ids) => ids.filter((other) => other !== id))
    remove?.()
  }

  return { isLeaving: (id) => leavingIds.includes(id), leave, left }
}
