function Slider({ title, label, value, min, max, step = 1, onChange }) {
  return (
    <label className="slider">
      <span className="slider-title">{title}</span>
      <span className="slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="slider-value">{label}</span>
      </span>
    </label>
  )
}

export default Slider
