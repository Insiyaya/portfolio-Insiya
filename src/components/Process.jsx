import { useEffect, useRef, useState } from 'react'
import { WORKFLOW } from '../data'
import { Heading } from '../ui/kit'

/* A pipeline on the floor grid: a signal runs the steps until you point at one. */
export default function Process() {
  const root = useRef(null)
  const [at, setAt] = useState(0)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer)
      if (e.isIntersecting) timer = setInterval(() => setAt(n => (n + 1) % WORKFLOW.length), 1900)
    }, { threshold: 0.2 })
    io.observe(root.current)
    return () => {
      clearInterval(timer)
      io.disconnect()
    }
  }, [held])

  return (
    <section id="process" ref={root} className="process">
      <span className="floor" aria-hidden="true" />
      <div className="section relative">
        <Heading text="HOW I WORK" className="text-[clamp(2.6rem,7.4vw,7.5rem)]" />
        <ol className="pipe mt-16 lg:mt-24" style={{ '--at': at }} onPointerLeave={() => setHeld(false)}>
          <span className="pipe-line" aria-hidden="true" />
          {WORKFLOW.map((s, i) => (
            <li
              key={s.step}
              className="pipe-step"
              data-on={i === at || undefined}
              data-past={i < at || undefined}
              onPointerEnter={e => {
                if (e.pointerType !== 'mouse') return
                setHeld(true)
                setAt(i)
              }}
            >
              <span className="pipe-node">{s.step}</span>
              <div className="hud pipe-card" data-glow>
                <h3 className="text-xl font-bold leading-tight text-ink">{s.title.replace('&', 'and')}</h3>
                <p className="mt-3 leading-[1.6] text-dim">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
