import { ABOUT, RECRUITER_FACTS, SERVICES } from '../data'
import { Buddy } from '../ui/kit'
import ProximityType from '../ui/ProximityType'

const LINES = ['I DON’T JUST', 'WRITE CODE.', 'I CONNECT', 'THE DOTS.']
const keep = s => s.replace('AI-900', 'AI‑900') // no break inside the code
const sentence = s => s.charAt(0).toUpperCase() + s.slice(1)

/* Line icons from the work scene, one per service. */
const SHAPES = ['50,8 92,82 8,82', '50,6 88,28 88,72 50,94 12,72 12,28', '14,14 86,14 86,86 14,86', '50,5 95,50 50,95 5,50']

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="about-hero">
        <ProximityType lines={LINES} className="text-[clamp(2.9rem,9.4vw,10.5rem)]" />
        <Buddy className="about-buddy" size={190} />
      </div>

      <div className="mt-20 grid gap-x-16 gap-y-16 lg:mt-28 lg:grid-cols-12">
        <div className="prose-block lg:col-span-6">
          <p className="lead">{ABOUT.lead}</p>
          <div className="mt-9 space-y-6">
            {ABOUT.body.map(text => <p key={text} className="max-w-[56ch]">{text}</p>)}
          </div>
          <p className="signature" aria-hidden="true">Insiya Husain</p>
        </div>

        {/* Lit signs, like the ones in the work scene */}
        <dl className="signs lg:col-span-6">
          {RECRUITER_FACTS.map((f, i) => (
            <div key={f.value} className="sign" data-tilt="7" data-dark={i % 3 === 1 || undefined}>
              <dt>{sentence(f.key)}</dt>
              <dd className="sign-value">
                {f.href ? <a href={f.href} target="_blank" rel="noopener noreferrer" data-cursor="visit">{keep(f.value)}</a> : keep(f.value)}
              </dd>
              <dd>{f.sub.replaceAll(' · ', ', ').replace(' — ', ', ')}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h3 className="display mt-28 text-[clamp(2rem,3.2vw,3rem)] text-ink lg:mt-40">What I offer</h3>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <li key={s.title} className="hud service" data-glow data-tilt="5">
            <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points={SHAPES[i]} pathLength="100" /></svg>
            <p className="card-title">{s.title}</p>
            <p className="mt-2 leading-relaxed text-dim">{s.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
