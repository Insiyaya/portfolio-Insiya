import { useEffect, useRef } from 'react'

/* Headline whose letters grow heavier and wider as the cursor nears them.
   Archivo is a variable font, so this is real type, not scaling. */
export default function ProximityType({ as: Tag = 'h2', lines, className = '', rest = [700, 100], peak = [900, 124], radius = 240 }) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const letters = [...el.querySelectorAll('i')].map(node => ({ node, v: 0 }))
    let x = -9999
    let y = -9999
    let frame = 0
    let seen = false

    const loop = () => {
      frame = 0
      // Read everything first, then write, so this costs one layout per frame.
      const boxes = letters.map(l => l.node.getBoundingClientRect())
      let busy = false
      letters.forEach((l, i) => {
        const b = boxes[i]
        const d = Math.hypot(b.left + b.width / 2 - x, (b.top + b.height / 2 - y) * 1.15)
        const goal = Math.max(0, 1 - d / radius)
        const next = l.v + (goal * goal * (3 - 2 * goal) - l.v) * 0.2
        if (Math.abs(next - l.v) > 0.002) {
          busy = true
          l.v = next
          l.node.style.fontWeight = Math.round(rest[0] + (peak[0] - rest[0]) * next)
          l.node.style.fontStretch = `${(rest[1] + (peak[1] - rest[1]) * next).toFixed(1)}%`
          l.node.style.color = next > 0.05 ? `color-mix(in oklab, var(--pink) ${Math.round(next * 100)}%, currentColor)` : ''
        }
      })
      if (busy && seen) frame = requestAnimationFrame(loop)
    }
    const wake = () => {
      if (seen) frame ||= requestAnimationFrame(loop)
    }
    const move = e => {
      x = e.clientX
      y = e.clientY
      wake()
    }
    const away = e => {
      if (e.relatedTarget) return
      x = y = -9999
      wake()
    }
    const io = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting
      wake()
    })
    io.observe(el)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', away, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', away)
    }
  }, [radius, rest, peak])

  return (
    <Tag ref={root} className={`proximity ${className}`} aria-label={lines.join(' ')}>
      {lines.map(line => (
        <span key={line} className="block whitespace-nowrap" aria-hidden="true">
          {[...line].map((ch, i) => (
            <i key={i} style={{ fontWeight: rest[0], fontStretch: `${rest[1]}%` }}>{ch === ' ' ? ' ' : ch}</i>
          ))}
        </span>
      ))}
    </Tag>
  )
}
