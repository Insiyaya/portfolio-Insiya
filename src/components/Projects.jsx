import { PROJECTS } from '../data'
import { Heading } from '../ui/kit'

/* The wall of screens from the work scene. Projects with a live site show it;
   the rest are lit signs. Any of them opens its details on the spot. */
export default function Projects({ onOpen }) {
  const open = item => onOpen({ type: 'project', item })
  const shown = PROJECTS.filter(p => p.shot)
  const signs = PROJECTS.filter(p => !p.shot)

  return (
    <section id="projects" className="section">
      <Heading text="PROJECTS" className="text-[clamp(2.6rem,7.4vw,7.5rem)]" />

      <div className="screens mt-16 lg:mt-24">
        {shown.map(p => (
          <article key={p.id} id={`project-${p.id}`} className="screen-wrap" style={{ '--accent': p.accent, '--shot': `url(${p.shot})` }}>
            <button type="button" className="screen" data-tilt="6" data-cursor="open" onClick={() => open(p)} aria-label={`Open details for ${p.title}`}>
              <span className="screen-face">
                <img src={p.shot} alt="" width="1200" height="750" loading="lazy" />
                <span className="screen-static" />
              </span>
            </button>
            <div className="screen-info">
              <div>
                <h3 className="display text-[clamp(1.6rem,2.7vw,2.6rem)]">{p.title}</h3>
                <p className="mt-1.5 text-dim">{p.kind}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="pill" onClick={() => open(p)}>Details</button>
                <a className="pill pill-solid" data-magnetic href={p.live} target="_blank" rel="noopener noreferrer">Visit</a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="tiles mt-6">
        {signs.map((p, i) => (
          <button key={p.id} id={`project-${p.id}`} type="button" className="tile" data-tilt="9" data-dark={i % 2 || undefined} data-cursor="open" onClick={() => open(p)}>
            <span className="tile-title" data-text={p.title}>{p.title}</span>
            <span className="tile-kind">{p.kind}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
