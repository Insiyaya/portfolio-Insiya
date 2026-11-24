import { useEffect, useRef } from 'react'

const LABELS = { open: 'Open', poke: 'Poke me', visit: 'Visit' }
const POINTS = 26

/* Custom cursor: an exact dot, a ring that lags behind it, and (below the
   stage) the same colour ribbon the 3D scenes have. It lives in the top layer
   as a manual popover, so it also works above open dialogs. */
export default function Cursor({ ribbon }) {
  const root = useRef(null)
  const canvasRef = useRef(null)
  const ribbonOn = useRef(ribbon)
  ribbonOn.current = ribbon

  useEffect(() => {
    const el = root.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || typeof el.showPopover !== 'function') return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const html = document.documentElement
    const [dot, ring, label] = el.querySelectorAll('.cursor-dot, .cursor-ring, .cursor-label')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let target = null
    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let seen = false
    let frame = 0
    let idle = 0
    let tick = 0
    const rope = Array.from({ length: POINTS }, () => ({ x, y }))

    el.showPopover()

    const size = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    size()

    const drawRibbon = time => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!ribbonOn.current || calm) return
      let length = 0
      for (let i = 1; i < POINTS; i++) length += Math.hypot(rope[i].x - rope[i - 1].x, rope[i].y - rope[i - 1].y)
      if (length < 6) return
      for (let i = 1; i < POINTS - 1; i++) {
        const t = i / (POINTS - 1)
        const a = rope[i - 1]
        const b = rope[i + 1]
        const speed = Math.hypot(b.x - a.x, b.y - a.y)
        const w = 13 * Math.min(1, t * 6) * (1 - t) * Math.min(1, speed / 26) * (0.45 + 0.55 * Math.abs(Math.cos(t * 5 - time * 0.0024)))
        if (w < 0.3) continue
        const hue = t < 0.5 ? [255, 45 + t * 60, 160] : [255 - (t - 0.5) * 180, 75 + (t - 0.5) * 130, 160 + (t - 0.5) * 190]
        ctx.strokeStyle = `rgba(${hue.map(Math.round).join(',')},${0.95 - t * 0.5})`
        ctx.lineWidth = w
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(rope[i].x, rope[i].y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }

    const loop = time => {
      frame = 0
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      rope[0].x = x
      rope[0].y = y
      for (let i = 1; i < POINTS; i++) {
        rope[i].x += (rope[i - 1].x - rope[i].x) * 0.46
        rope[i].y += (rope[i - 1].y - rope[i].y) * 0.46
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      label.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      // Things also move under a still cursor (3D scenes, scrolling, dialogs).
      if (++tick % 6 === 0 && seen) target = document.elementFromPoint(x, y)
      const hit = target?.isConnected ? target.closest('[data-cursor], a, button, summary, label, input, textarea') : null
      const mode = hit?.dataset.cursor || (hit?.matches('input, textarea') ? 'text' : hit && !hit.matches('.stage-canvas') ? 'link' : '')
      if (el.dataset.mode !== mode) {
        el.dataset.mode = mode
        if (LABELS[mode]) label.firstChild.textContent = LABELS[mode]
      }
      drawRibbon(time)
      idle = Math.abs(x - rx) + Math.abs(y - ry) + Math.abs(rope[POINTS - 1].x - x) < 0.4 ? idle + 1 : 0
      // Keep polling a little slower once everything has come to rest.
      if (idle > 20) setTimeout(() => (frame ||= requestAnimationFrame(loop)), 90)
      else frame = requestAnimationFrame(loop)
    }

    const move = e => {
      if (e.pointerType === 'touch') return
      x = e.clientX
      y = e.clientY
      target = e.target instanceof Element ? e.target : null
      if (!seen) {
        seen = true
        rx = x
        ry = y
        rope.forEach(p => Object.assign(p, { x, y }))
        html.classList.add('has-cursor')
        el.dataset.on = 'true'
      }
      idle = 0
      frame ||= requestAnimationFrame(loop)
    }
    const down = () => (el.dataset.down = 'true')
    const up = () => delete el.dataset.down
    const out = e => {
      if (!e.relatedTarget) el.dataset.on = 'false'
    }
    const over = () => seen && (el.dataset.on = 'true')
    // Dialogs open above everything already in the top layer; come back up.
    const raise = () => {
      el.hidePopover()
      el.showPopover()
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    document.addEventListener('pointerout', out, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('resize', size)
    document.addEventListener('panel-open', raise)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerout', out)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('resize', size)
      document.removeEventListener('panel-open', raise)
      html.classList.remove('has-cursor')
      if (el.matches(':popover-open')) el.hidePopover()
    }
  }, [])

  return (
    <div ref={root} className="cursor" popover="manual" aria-hidden="true" data-on="false" data-mode="">
      <canvas ref={canvasRef} className="cursor-ribbon" />
      <span className="cursor-ring"><i /></span>
      <span className="cursor-dot"><i /></span>
      <span className="cursor-label"><b /></span>
    </div>
  )
}
