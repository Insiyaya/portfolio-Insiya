import { useState } from 'react'
import { SKILLS } from '../data'
import { Heading, Wall } from '../ui/kit'

const TONES = ['ink', 'violet', 'pink', 'mint', 'paper', 'ink']
const label = s => s.replace(' / ', ' and ')

/* The white world as a keyboard. Hover a key, or pick a group. */
export default function Skills() {
  const [group, setGroup] = useState(null)

  return (
    <section id="skills" className="skills">
      <Wall className="skills-wall" rows={[['PYTHON', 'TYPESCRIPT', 'REACT', 'FLUTTER'], ['RAG', 'LANGGRAPH', 'DOCKER', 'TERRAFORM'], ['FASTAPI', 'DJANGO', 'NODE.JS', 'SQL']]} />
      <div className="section relative">
        <Heading text="Skills" className="text-[clamp(4.2rem,10vw,10.5rem)]" />
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
                <li key={s.name} className="key" data-tone={TONES[gi]}>
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
