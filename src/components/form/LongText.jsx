import texts from '../../locales/es.js'

function LongText({ value, hint, onChange }) {
  return (
    <label>
      {texts.common.description}
      <textarea
        className="long-text"
        rows={6}
        placeholder={hint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default LongText
