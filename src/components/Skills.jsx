import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SKILLS } from '../data'
import { rating } from '../ratings'
import { Heading, Wall } from '../ui/kit'

/* One backlight colour per group. */
const LIGHTS = ['#efeaff', '#a488ff', '#ff5cb6', '#8df5d6', '#ffb14a', '#6cc7ff']
const GROUPS = SKILLS.map((g, i) => ({ id: g.category, name: g.category.replace(' / ', ' and '), light: LIGHTS[i], items: g.items.map(s => s.name) }))
const KEYS = GROUPS.flatMap(g => g.items.map(name => ({ name, group: g.id, groupName: g.name, light: g.light, ...rating(name) })))
const BARS = Array.from({ length: 10 }, (_, i) => i)
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Scrolls only if part of `el` is out of sight, and only as far as needed. */
function reveal(el, until) {
  const css = getComputedStyle(document.documentElement)
  const top = (parseFloat(css.getPropertyValue('--bar')) || 0) + 14
  const bottom = window.innerHeight - 14
  const from = el.getBoundingClientRect().top
  const whole = el.getBoundingClientRect().bottom
  const to = whole - from <= bottom - top ? whole : until // too tall for the screen: at least up to the lit keys
  let by = 0
  if (to - from > bottom - top || from < top) by = from - top
  else if (to > bottom) by = to - bottom
  if (Math.abs(by) > 2) window.scrollBy({ top: by, behavior: calm() ? 'instant' : 'smooth' })
}

/* Light runs outward from the pressed key. */
function ripple(board, from) {
  if (calm()) return
  const a = from.getBoundingClientRect()
  const x = a.left + a.width / 2
  const y = a.top + a.height / 2
  board.querySelectorAll('.key > button').forEach(el => {
    const b = el.getBoundingClientRect()
    const far = Math.hypot(b.left + b.width / 2 - x, (b.top + b.height / 2 - y) * 1.6)
    el.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.85)' }, { filter: 'brightness(1)' }], { duration: 420, delay: far * 0.75, easing: 'ease-out' })
  })
}

/* A backlit keyboard. Picking a group lights its keys; picking it again, or
   the space bar, lights them all. Pressing a key shows its rating. */
export default function Skills() {
  const board = useRef(null)
  const bar = useRef(null)
  const asked = useRef(false)
  const [group, setGroup] = useState(null)
  const [picked, setPicked] = useState(null)
  const chosen = GROUPS.find(g => g.id === group)
  const shown = KEYS.find(k => k.name === picked)

  const pick = id => {
    asked.current = true
    const next = group === id ? null : id
    setGroup(next)
    if (next && shown && shown.group !== next) setPicked(null)
  }

  const press = (k, e) => {
    ripple(board.current, e.currentTarget)
    setPicked(picked === k.name ? null : k.name)
    const r = board.current.getBoundingClientRect()
    if (r.height < window.innerHeight - 110) reveal(board.current, r.bottom)
  }

  /* The white thumb slides under the pressed switch. */
  useLayoutEffect(() => {
    const place = () => {
      const on = bar.current?.querySelector('[aria-pressed="true"]')
      if (!on) return
      for (const [k, v] of Object.entries({ x: on.offsetLeft, y: on.offsetTop, w: on.offsetWidth, h: on.offsetHeight })) bar.current.style.setProperty(`--${k}`, `${v}px`)
    }
    place()
    document.fonts?.ready.then(place)
    const size = new ResizeObserver(place)
    size.observe(bar.current)
    return () => size.disconnect()
  }, [group])

  useEffect(() => {
    if (!asked.current) return
    const lit = [...board.current.querySelectorAll('.key[data-lit]')]
    reveal(board.current, Math.max(...lit.map(k => k.getBoundingClientRect().bottom), board.current.getBoundingClientRect().top))
  }, [group])

  const showAll = () => {
    pick(null)
    bar.current.querySelector('button').focus({ preventScroll: true }) // the space bar goes quiet
  }

  const glow = shown?.light ?? chosen?.light
  return (
    <section id="skills" className="skills">
      <Wall className="skills-wall" rows={[['PYTHON', 'TYPESCRIPT', 'REACT', 'FLUTTER'], ['RAG', 'LANGGRAPH', 'DOCKER', 'TERRAFORM'], ['FASTAPI', 'DJANGO', 'NODE.JS', 'SQL']]} />
      <div className="section relative">
        <Heading text="Skills" className="text-[clamp(4.2rem,10vw,10.5rem)]" />

        <div ref={board} className="board mt-8 lg:mt-10" data-glow style={glow && { '--led-a': glow, '--led-b': glow }}>
          <div ref={bar} className="switch" role="group" aria-label="Filter skills">
            <span className="switch-thumb" aria-hidden="true" />
            <button type="button" aria-pressed={!group} onClick={() => pick(null)}>All</button>
            {GROUPS.map(g => (
              <button key={g.id} type="button" aria-pressed={group === g.id} title={group === g.id ? 'Show all skills' : undefined} onClick={() => pick(g.id)} style={{ '--c': g.light }}>
                {g.name}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">{chosen ? `Showing ${chosen.items.length} skills in ${chosen.name}` : ''}</p>

          <div className="readout" data-on={shown ? true : undefined} style={{ '--c': shown?.light ?? '#a488ff' }} aria-live="polite">
            <div className="readout-name">
              <strong>{shown ? shown.name : 'Press a key'}</strong>
              <span>{shown ? shown.groupName : 'See how far I have taken each skill'}</span>
            </div>
            <div className="readout-rate">
              <div className="meter" key={picked} role={shown ? 'meter' : undefined} aria-label={shown ? `${shown.name} rating` : undefined} aria-valuemin={shown ? 0 : undefined} aria-valuemax={shown ? 10 : undefined} aria-valuenow={shown?.level}>
                {BARS.map(i => <i key={i} data-full={(shown && i < shown.level) || undefined} style={{ '--n': i }} />)}
              </div>
              <b>{shown ? <>{shown.level}<small> out of 10</small></> : ''}</b>
            </div>
            <p className="readout-use">{shown ? shown.text : 'Ratings come from the projects and roles on this page and on my GitHub.'}</p>
          </div>

          <ul className="keys" aria-label="Skills">
            {KEYS.map((k, i) => (
              <li key={k.name} className="key" style={{ '--c': k.light, '--i': i }} data-lit={group === k.group || undefined} data-off={(group && group !== k.group && picked !== k.name) || undefined} data-picked={picked === k.name || undefined}>
                <button type="button" aria-pressed={picked === k.name} onClick={e => press(k, e)}>{k.name}</button>
              </li>
            ))}
            <li className="key key-space" aria-hidden={!group || undefined}>
              <button type="button" disabled={!group} onClick={showAll}>{group ? 'Show all skills' : ''}</button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
