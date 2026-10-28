// A <select> can't hold the arrow itself, and a background image can't rotate,
// so the wrapper draws it (see `.select` in App.css)
function Select(props) {
  return (
    <span className="select">
      <select {...props}/>
    </span>
  )
}

export default Select
