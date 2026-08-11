import { useRef, useEffect } from 'react'

/**
 * Canvas particle constellation that reacts to the cursor.
 * Themed to the pink/lavender palette and kept faint so it reads as
 * ambient technical texture rather than a foreground effect.
 * Skipped entirely for reduced-motion users.
 */
export default function ParticleNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -9999, y: -9999 }
    let W, H

    /* Fewer nodes on small screens — cheaper and far less busy */
    const isSmall    = window.innerWidth < 768
    const COUNT      = isSmall ? 26 : 52
    const MAX_DIST   = isSmall ? 105 : 130
    const MOUSE_DIST = 170

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()

    const onMouse = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse, { passive: true })

    const particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * (W || 1200),
      y:  Math.random() * (H || 800),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.3 + 0.45,
      /* A few nodes lean lavender so the field isn't monochrome pink */
      lav: Math.random() > 0.72,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.lav ? 'rgba(192,132,252,0.42)' : 'rgba(255,45,170,0.42)'
        ctx.fill()
      }

      /* Connection lines between nearby particles */
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(217,70,239,${0.09 * (1 - d / MAX_DIST)})`
            ctx.lineWidth   = 0.5
            ctx.stroke()
          }
        }

        /* Lines connecting particle to the cursor */
        const dx = particles[i].x - mouse.x
        const dy = particles[i].y - mouse.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < MOUSE_DIST) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(255,45,170,${0.20 * (1 - d / MOUSE_DIST)})`
          ctx.lineWidth   = 0.7
          ctx.stroke()

          /* Glow up the particle near cursor */
          ctx.beginPath()
          ctx.arc(particles[i].x, particles[i].y, particles[i].r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,79,195,${0.13 * (1 - d / MOUSE_DIST)})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.4 }}
    />
  )
}
