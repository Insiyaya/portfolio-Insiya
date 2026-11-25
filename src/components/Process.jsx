import { useEffect, useRef, useState } from 'react'
import { WORKFLOW } from '../data'
import { Buddy, Heading } from '../ui/kit'

const COLORS = ['#ff5cb6', '#a488ff', '#8df5d6', '#ffb14a', '#6cc7ff']
const STAY = 5600 // ms on each step

/* One moving drawing per step. They only run while their step is open. */
const ART = [
  // Discover: a radar finding things
  <g key="discover">
    <g className="art-faint"><circle cx="160" cy="112" r="34" /><circle cx="160" cy="112" r="68" /><circle cx="160" cy="112" r="100" /><path d="M60 112h200M160 12v200" /></g>
    <path className="art-sweep" d="M160 112 L160 12 A100 100 0 0 1 247 62 Z" />
    <g className="art-dots"><circle cx="205" cy="70" r="6" /><circle cx="112" cy="84" r="5" /><circle cx="186" cy="160" r="7" /><circle cx="98" cy="150" r="4" /></g>
  </g>,
  // Architect: a blueprint drawing itself
  <g key="architect">
    <g className="art-draw">
      <path pathLength="1" d="M160 56v28M160 84H74v28M160 84v28M160 84h86v28" />
      <path pathLength="1" d="M74 152v24h86M246 152v24h-86M160 152v34" />
    </g>
    <g className="art-boxes"><rect x="118" y="16" width="84" height="40" rx="4" /><rect x="38" y="112" width="72" height="40" rx="4" /><rect x="124" y="112" width="72" height="40" rx="4" /><rect x="210" y="112" width="72" height="40" rx="4" /><ellipse cx="160" cy="198" rx="40" ry="13" /></g>
  </g>,
  // Build: code being typed
  <g key="build">
    <rect x="44" y="16" width="232" height="188" rx="10" /><path d="M44 46h232" />
    <g className="art-fill"><circle cx="62" cy="31" r="4" /><circle cx="77" cy="31" r="4" /><circle cx="92" cy="31" r="4" /></g>
    <g className="art-code">{[[62, 66, 96], [78, 88, 150], [78, 110, 118], [94, 132, 92], [78, 154, 134], [62, 176, 60]].map(([x, y, w], n) => <rect key={y} x={x} y={y - 5} width={w} height="9" rx="4.5" style={{ '--n': n }} />)}</g>
  </g>,
  // Deploy: a launch
  <g key="deploy">
    <g className="art-faint"><path d="M30 190 C110 186 190 140 268 30" strokeDasharray="3 8" /><path d="M20 206h280" /></g>
    <g className="art-crates"><rect x="28" y="172" width="30" height="30" rx="3" /><rect x="62" y="172" width="30" height="30" rx="3" /><rect x="45" y="140" width="30" height="30" rx="3" /></g>
    <g className="art-rocket"><path d="M-20 -11 L18 0 L-20 11 L-12 0 Z" /><path className="art-flame" d="M-22 0h-22" /></g>
    <circle cx="276" cy="34" r="20" /><ellipse cx="276" cy="34" rx="34" ry="9" transform="rotate(-20 276 34)" />
  </g>,
  // Measure: a chart growing
  <g key="measure">
    <g className="art-faint"><path d="M44 16v180h240" /><path d="M44 60h240M44 105h240M44 150h240" strokeDasharray="2 8" /></g>
    <g className="art-bars">{[60, 92, 74, 116, 138, 160].map((h, n) => <rect key={n} x={60 + n * 37} y={196 - h} width="20" height={h} style={{ '--n': n }} />)}</g>
    <g className="art-draw"><path pathLength="1" d="M56 150 L107 120 L144 132 L181 88 L218 70 L268 34" /></g>
    <circle className="art-pulse" cx="268" cy="34" r="7" />
  </g>,
]

/* Five panels on one line. The open one tells the step; the rest wait. */
export default function Process() {
  const root = useRef(null)
  const [at, setAt] = useState(0)
  const [held, setHeld] = useState(false)
  const [auto, setAuto] = useState(false)
  const wait = useRef(0)

  useEffect(() => {
    const roomy = window.matchMedia('(min-width: 900px) and (hover: hover)')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => setAuto(e.isIntersecting && roomy.matches), { threshold: 0.35 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  const running = auto && !held
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setAt(n => (n + 1) % WORKFLOW.length), STAY)
    return () => clearTimeout(timer)
  }, [running, at])

  const enter = (i, e) => {
    if (e.pointerType !== 'mouse') return
    setHeld(true)
    clearTimeout(wait.current)
    wait.current = setTimeout(() => setAt(i), 90) // not while merely passing over
  }
  const leave = () => {
    clearTimeout(wait.current)
    setHeld(false)
  }

  return (
    <section id="process" className="process">
      <span className="floor" aria-hidden="true" />
      <div className="section relative">
        <Heading text="How I work" className="text-[clamp(4.2rem,10vw,10.5rem)]" />
        <ol ref={root} className="steps mt-12 lg:mt-16" style={{ '--stay': `${STAY}ms` }} onPointerLeave={leave} onFocus={() => setHeld(true)} onBlur={leave}>
          {WORKFLOW.map((s, i) => {
            const on = i === at
            return (
              <li key={s.step} className="hud step" data-glow data-on={on || undefined} style={{ '--c': COLORS[i] }} onPointerEnter={e => enter(i, e)}>
                <h3 className="step-head">
                  <button type="button" aria-expanded={on} aria-controls={`step-${s.step}`} onClick={() => setAt(i)}>
                    <span className="step-no">{s.step}</span>
                    <span className="step-name">{s.title}</span>
                  </button>
                </h3>
                <div id={`step-${s.step}`} className="step-body">
                  <div className="step-inner">
                    <svg className="art" viewBox="0 0 320 220" fill="none" aria-hidden="true">{ART[i]}</svg>
                    <p className="step-title" aria-hidden="true">{s.title}</p>
                    <p className="step-text">{s.desc}</p>
                  </div>
                </div>
                {on && <Buddy className="step-buddy" size={74} />}
                {on && running && <span className="step-time" aria-hidden="true" />}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
