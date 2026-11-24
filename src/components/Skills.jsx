import { useEffect, useRef, useState } from 'react'
import { SKILLS } from '../data'
import { Heading, Wall } from '../ui/kit'

const TONES = ['ink', 'violet', 'pink', 'mint', 'paper', 'ink']
const label = s => s.replace(' / ', ' and ')

/* The white world as a keyboard. Hover a key, pick a group, or press a letter. */
export default function Skills() {
  const root = useRef(null)
  const [group, setGroup] = useState(null)
  const [letter, setLetter] = useState('')

  useEffect(() => {
    let seen = false
    let timer = 0
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { rootMargin: '-20% 0px' })
    io.observe(root.current)
    const onKey = e => {
      if (!seen || e.ctrlKey || e.metaKey || e.altKey || document.querySelector('dialog[open]') || e.target.closest('input, textarea') || !/^[a-z]$/i.test(e.key)) return
      setLetter(e.key.toLowerCase())
      clearTimeout(timer)
      timer = setTimeout(() => setLetter(''), 700)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <section id="skills" ref={root} className="skills">
      <Wall className="skills-wall" rows={[['PYTHON', 'TYPESCRIPT', 'REACT', 'FLUTTER'], ['RAG', 'LANGGRAPH', 'DOCKER', 'TERRAFORM'], ['FASTAPI', 'DJANGO', 'NODE.JS', 'SQL']]} />
      <div className="section relative">
        <Heading text="SKILLS" className="text-[clamp(2.6rem,7.4vw,7.5rem)]" />
        <div className="mt-10 flex flex-wrap gap-2 lg:mt-14" role="group" aria-label="Show a group">
          {SKILLS.map(g => (
            <button key={g.category} type="button" className="chip" aria-pressed={group === g.category} onClick={() => setGroup(group === g.category ? null : g.category)}>
              {label(g.category)}
            </button>
          ))}
        </div>
        <div className="keys mt-10 lg:mt-14">
          {SKILLS.map((g, gi) => (
            <ul key={g.category} className="keys-row" aria-label={label(g.category)} data-dim={(group && group !== g.category) || undefined}>
              {g.items.map(s => (
                <li key={s.name} className="key" data-tone={TONES[gi]} data-down={(letter && s.name.toLowerCase().startsWith(letter)) || undefined}>
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <p className="keys-hint">Press a letter on your keyboard.</p>
      </div>
    </section>
  )
}
