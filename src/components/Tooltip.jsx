// Speech bubble under a button, shown on hover and also on keyboard focus so it is not
// mouse-only. The button should point to it with aria-describedby={id} so screen readers
// read the explanation too. alignRight: for buttons at the right edge of the screen, where
// a centred bubble would overflow.
function Tooltip({ id, text, alignRight, children }) {
  return (
    <span className="has-tooltip">
      {children}
      <span className={alignRight ? 'tooltip frost tip align-right' : 'tooltip frost tip'} id={id} role="tooltip">{text}</span>
    </span>
  )
}

export default Tooltip
