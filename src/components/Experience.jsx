import { useEffect, useRef, useState } from 'react'
import { EXPERIENCE } from '../data'
import { Buddy, Heading } from '../ui/kit'

/* The mascot rides a rail past every role as you scroll. */
export default function Experience() {
  const list = useRef(null)
  const [reached, setReached] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const el = list.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const mark = window.innerHeight * 0.52
      el.style.setProperty('--p', Math.max(0, Math.min(1, (mark - r.top) / r.height)).toFixed(4))
      const items = [...el.querySelectorAll('[data-stop]')]
      setReached(items.filter(i => i.getBoundingClientRect().top + 34 < mark).length)
    }
    const onScroll = () => (frame ||= requestAnimationFrame(measure))
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="experience" className="section">
      <Heading text="EXPERIENCE" className="text-[clamp(2.6rem,7.4vw,7.5rem)]" />

      <div ref={list} className="rail mt-16 lg:mt-24">
        <span className="rail-line" aria-hidden="true" />
        <span className="rail-rider" aria-hidden="true"><Buddy size={84} /></span>
        <ol>
          {EXPERIENCE.map((job, i) => (
            <li key={job.id} id={`role-${job.id}`} data-stop data-on={i < reached || undefined} className="stop">
              <span className="stop-node" aria-hidden="true" />
              <article className="hud role" data-glow>
                <div className="role-head">
                  <div>
                    <h3 className="display text-[clamp(1.9rem,3.6vw,3.4rem)]">
                      {job.href ? <a className="link" href={job.href} target="_blank" rel="noopener noreferrer" data-cursor="visit">{job.company}</a> : job.company}
                    </h3>
                    <p className="mt-2 text-lg text-violet-soft">{job.role}</p>
                  </div>
                  <p className="role-when">
                    {job.current ? <span className="pulse">Current</span> : job.period?.replace('–', 'to')}
                  </p>
                </div>
                {job.points.length > 0 && (
                  <ul className="mt-7 grid gap-x-10 gap-y-4 leading-[1.6] text-soft lg:grid-cols-3">
                    {job.points.map(p => <li key={p} className="bullet">{p}</li>)}
                  </ul>
                )}
                {job.tags.length > 0 && (
                  <ul className="tags mt-7">
                    {job.tags.map(t => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
