import { useEffect, useRef, useState } from 'react'
import { useScramble } from '../stage/useScramble'

const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* True once the element has come into view. */
export function useSeen(margin = '-12% 0px') {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setSeen(true)
      io.disconnect()
    }, { rootMargin: margin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [margin])
  return [ref, seen]
}

/* Section heading that decodes itself, like the subtitles on the stage. The
   full text stays in the layout, so nothing shifts and it is always readable
   to assistive tech. */
export function Heading({ text, as: Tag = 'h2', className = '' }) {
  const [ref, seen] = useSeen()
  const shown = useScramble(seen ? text : '', calm())
  return (
    <Tag ref={ref} className={`heading ${className}`}>
      <span className={seen ? 'invisible' : 'opacity-0'}>{text}</span>
      <span className="heading-live" aria-hidden="true">{shown}</span>
    </Tag>
  )
}

/* A slanted band of moving type, as in the white world. Scrolling speeds it up. */
export function Wall({ rows, className = '' }) {
  const root = useRef(null)
  useEffect(() => {
    if (calm()) return
    const moving = [...root.current.querySelectorAll('.wall-track')].flatMap(el => el.getAnimations())
    let frame = 0
    let last = window.scrollY
    let boost = 0
    const loop = () => {
      frame = 0
      boost *= 0.93
      moving.forEach(a => (a.playbackRate = 1 + boost))
      if (boost > 0.02) frame = requestAnimationFrame(loop)
    }
    const onScroll = () => {
      boost = Math.min(7, boost + Math.abs(window.scrollY - last) * 0.014)
      last = window.scrollY
      frame ||= requestAnimationFrame(loop)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return (
    <div ref={root} className={`wall ${className}`} aria-hidden="true">
      {rows.map((words, i) => (
        <div key={i} className="wall-row" data-tone={i % 2 ? 'soft' : 'ink'}>
          <div className="wall-track" style={{ animationDirection: i % 2 ? 'reverse' : 'normal', animationDuration: `${34 + i * 9}s` }}>
            {[0, 1].map(n => (
              <span key={n}>{words.map(w => `${w} / `).join('')}{words.map(w => `${w} / `).join('')}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* The mascot as line art. Its eyes follow the cursor; click it and it hops. */
export function Buddy({ className = '', size = 136 }) {
  const svg = useRef(null)
  const eyes = useRef(null)
  const [hop, setHop] = useState(0)
  useEffect(() => {
    let frame = 0
    const move = e => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = svg.current?.getBoundingClientRect()
        if (!r || !eyes.current || r.bottom < -200 || r.top > window.innerHeight + 200) return
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 260)
        eyes.current.style.transform = `translate(${((dx / d) * 6 * k).toFixed(1)}px, ${((dy / d) * 4 * k).toFixed(1)}px)`
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
    }
  }, [])
  return (
    <span key={hop} className={`buddy ${hop ? 'is-hopping' : ''} ${className}`} data-cursor="poke" onClick={() => setHop(n => n + 1)} aria-hidden="true">
      <svg ref={svg} width={size} height={size} viewBox="0 0 136 136" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(12 68 82)">
          <path d="M10 82a58 15 0 0 1 116 0" stroke="var(--pink)" strokeWidth="11" />
          <path d="M10 82a58 15 0 0 1 116 0" stroke="#000" strokeWidth="6" />
        </g>
        <g fill="#000" stroke="var(--violet)" strokeWidth="2.6">
          <rect x="47" y="112" width="17" height="14" rx="7" />
          <rect x="72" y="112" width="17" height="14" rx="7" />
        </g>
        <g className="buddy-antenna">
          <path d="M70 46c1-12 6-20 15-25" stroke="var(--violet)" strokeWidth="8" />
          <path d="M70 46c1-12 6-20 15-25" stroke="#000" strokeWidth="3.4" />
          <circle cx="89" cy="18" r="7.5" fill="var(--mint)" />
        </g>
        <path d="M68 41c24 0 37 14 37 37s-13 37-37 37-37-14-37-37 13-37 37-37Z" fill="#000" stroke="var(--violet)" strokeWidth="2.6" />
        <g ref={eyes} className="buddy-eyes" fill="var(--violet)">
          <ellipse cx="57" cy="69" rx="4.4" ry="6.8" />
          <ellipse cx="79" cy="69" rx="4.4" ry="6.8" />
        </g>
        <g transform="rotate(12 68 82)">
          <path d="M10 82a58 15 0 0 0 116 0" stroke="var(--pink)" strokeWidth="11" />
          <path d="M10 82a58 15 0 0 0 116 0" stroke="#000" strokeWidth="6" />
        </g>
      </svg>
    </span>
  )
}
