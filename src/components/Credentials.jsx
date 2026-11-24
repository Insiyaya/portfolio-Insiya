import { CERTS, EDUCATION, LINKS, OPEN_SOURCE } from '../data'
import { Heading } from '../ui/kit'

export default function Credentials() {
  return (
    <section id="credentials" className="section">
      <Heading text="CREDENTIALS" className="text-[clamp(2.4rem,6.6vw,6.75rem)]" />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20">
        {CERTS.map(c => (
          <article key={c.id} className="holo" data-tilt="10">
            <p className="text-base">{c.issuer}</p>
            <h3 className="display mt-auto text-[clamp(1.9rem,3.4vw,3.2rem)]">{c.name}</h3>
            <p className="mt-2 text-lg">{c.level}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="hud p-7 lg:p-9" data-glow>
          <h3 className="text-2xl font-bold">Education</h3>
          <ul className="mt-5">
            {EDUCATION.map(e => (
              <li key={e.degree} className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-line py-4">
                <span>
                  <span className="block text-lg font-semibold">{e.degree}</span>
                  <span className="text-dim">{e.institution}, {e.year.replace('–', 'to')}</span>
                </span>
                <span className="text-lg font-bold text-mint">{e.score.replace('GPA: ', '').replace('8.8 / 10.0', '8.8 / 10')}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hud p-7 lg:p-9" data-glow>
          <h3 className="text-2xl font-bold">Open source</h3>
          <p className="display mt-6 text-[clamp(3.4rem,7vw,6rem)] text-violet">40+</p>
          <p className="mt-1 text-lg">public repositories</p>
          <ul className="tags mt-6">
            {OPEN_SOURCE.achievements.map(a => <li key={a}>{a}</li>)}
          </ul>
          <a className="pill mt-8 inline-block" data-magnetic href={LINKS.github} target="_blank" rel="noopener noreferrer">View GitHub profile</a>
        </div>
      </div>
    </section>
  )
}
