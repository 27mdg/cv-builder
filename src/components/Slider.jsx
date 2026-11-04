function Slider({ title, label, value, min, max, step = 1, onChange }) {
  return (
    <label className="slider">
      <span className="slider-title">{title}</span>
      <span className="slider-row">
        <input
          type="range"
          className="range"
          // How far along the value is: the track is forest up to there (kit.css)
          style={{ '--fill': `${((value - min) / (max - min)) * 100}%` }}
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
