import { useEffect, useRef, useState } from 'react'
import texts from '../locales/es.js'
import templates from '../templates/list.js'

const thumbnailWidth = 150

function Thumbnail({ id }) {
  const box = useRef(null)
  const [src, setSrc] = useState(null)

  // Drawn only when the card scrolls into view: with many templates, drawing them all at once is slow
  useEffect(() => {
    let cancelled = false
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      try {
        const { templateThumbnail } = await import('../templates/thumbnail.js')
        const image = await templateThumbnail(id, thumbnailWidth)
        if (!cancelled) setSrc(image)
      } catch (e) {
        console.error(e)
      }
    })
    observer.observe(box.current)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [id])

  return (
    <span className="template-thumbnail" ref={box}>
      {src && <img src={src} alt=""/>}
    </span>
  )
}

function TemplatePicker({ selected, onSelect }) {
  return (
    <div className="template-picker">
      {templates.map(({ id }) => (
        <button
          key={id}
          type="button"
          className={id === selected ? 'template-card selected' : 'template-card'}
          aria-pressed={id === selected}
          onClick={() => onSelect(id)}
        >
          <Thumbnail id={id}/>
          <span className="template-name">{texts.templates[id]}</span>
        </button>
      ))}
    </div>
  )
}

export default TemplatePicker
