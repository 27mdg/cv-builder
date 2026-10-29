import { useState } from 'react'
import { prefersReducedMotion } from './useLeaving.js'

// Grows open and fades in when `appear` (only for things added in this visit, so nothing
// animates on page load), and fades out and shrinks when `leaving`, then calls onLeft.
// The height animates through a grid row (0fr ↔ 1fr), which works in every current browser
// without measuring anything in JavaScript.
function Animated({ appear, leaving, onLeft, className, children }) {
  // The inner box hides what overflows only while animating: afterwards it would cut off the
  // focus rings of the fields
  const [appearing, setAppearing] = useState(() => Boolean(appear) && !prefersReducedMotion())

  function handleAnimationEnd(e) {
    // Animations of the children (e.g. an arrow turning) also bubble up here
    if (e.target !== e.currentTarget) return
    if (leaving) onLeft()
    else setAppearing(false)
  }

  const classes = ['animated', appearing && 'appearing', leaving && 'leaving', className].filter(Boolean)
  return (
    // inert: a leaving item can no longer be clicked or typed into
    <div className={classes.join(' ')} inert={leaving} onAnimationEnd={handleAnimationEnd}>
      <div className="animated-inner">{children}</div>
    </div>
  )
}

export default Animated
