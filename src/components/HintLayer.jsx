import { useEffect, useRef } from 'react'

// One glass hint for the whole web, instead of the browser's black title boxes, which cannot be
// styled. Any element with data-hint="…" gets it: after a short hover it frosts in beside the
// pointer and follows it, and frosts out on leaving, clicking, typing or scrolling. The element
// still needs its own aria-label for screen readers (data-hint is only for the eyes).
// A popover, so it also shows above the calendar, dropdown lists and dialogs (the top layer).

// In ms: before the first hint shows, and the time after one hides in which the next shows at
// once (moving along a row of icons)
const showDelay = 500
const warmTime = 300
// In px from the pointer: below and to the right, like the browser's own
const offsetX = 12
const offsetY = 20
const margin = 8

function HintLayer() {
  const bubble = useRef(null)

  useEffect(() => {
    const box = bubble.current
    let target = null
    let timer = 0
    let hiddenAt = 0
    let pointer = { x: 0, y: 0 }

    function place() {
      const { offsetWidth: width, offsetHeight: height } = box
      let left = pointer.x + offsetX
      let top = pointer.y + offsetY
      if (left + width > window.innerWidth - margin) left = Math.max(margin, pointer.x - offsetX - width)
      if (top + height > window.innerHeight - margin) top = Math.max(margin, pointer.y - offsetY / 2 - height)
      box.style.left = `${left}px`
      box.style.top = `${top}px`
    }

    function show() {
      const text = target?.getAttribute('data-hint')
      if (!text) return
      box.textContent = text
      // Shown again each time, so it goes above anything opened in the top layer since
      if (box.matches(':popover-open')) box.hidePopover()
      box.showPopover()
      place()
      box.classList.add('is-shown')
    }

    function hide() {
      clearTimeout(timer)
      if (box.classList.contains('is-shown')) hiddenAt = Date.now()
      box.classList.remove('is-shown')
      target = null
    }

    function handleOver(e) {
      if (e.pointerType === 'touch') return
      const next = e.target.closest?.('[data-hint]') ?? null
      if (next === target) return
      hide()
      if (!next) return
      target = next
      pointer = { x: e.clientX, y: e.clientY }
      timer = setTimeout(show, Date.now() - hiddenAt < warmTime ? 0 : showDelay)
    }

    function handleMove(e) {
      pointer = { x: e.clientX, y: e.clientY }
      if (box.classList.contains('is-shown')) place()
    }

    function handleOut(e) {
      // Leaving the window
      if (!e.relatedTarget) hide()
    }

    document.addEventListener('pointerover', handleOver)
    document.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerout', handleOut)
    document.addEventListener('pointerdown', hide, true)
    document.addEventListener('keydown', hide, true)
    document.addEventListener('scroll', hide, true)
    window.addEventListener('blur', hide)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerout', handleOut)
      document.removeEventListener('pointerdown', hide, true)
      document.removeEventListener('keydown', hide, true)
      document.removeEventListener('scroll', hide, true)
      window.removeEventListener('blur', hide)
    }
  }, [])

  return <div ref={bubble} className="hint frost tip" popover="manual" aria-hidden="true"/>
}

export default HintLayer
