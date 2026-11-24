import { EMAIL, LINKS } from '../data'
import { Buddy } from '../ui/kit'
import ProximityType from '../ui/ProximityType'

const LINES = ['LET’S', 'CONNECT']

export default function Footer() {
  return (
    <footer id="contact" className="end">
      <span className="floor" aria-hidden="true" />
      <div className="section relative pb-8">
        <div className="end-hero">
          <ProximityType lines={LINES} className="text-[clamp(3.6rem,15.5vw,18rem)]" />
          <Buddy className="end-buddy" size={210} />
        </div>
        <p className="mt-10 max-w-[44ch] text-xl leading-relaxed text-soft">
          Have a project in mind or a role to discuss? I&rsquo;d love to hear about it.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a className="pill pill-solid pill-big" data-magnetic href={LINKS.email} target="_blank" rel="noopener noreferrer">Email me</a>
          <a className="pill pill-big" data-magnetic href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="pill pill-big" data-magnetic href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="pill pill-big" data-magnetic href={LINKS.twofolds} target="_blank" rel="noopener noreferrer">Twofolds</a>
        </div>
        <p className="mt-7 text-lg text-soft"><a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        <div className="mt-24 flex flex-wrap justify-between gap-4 text-sm text-dim">
          <p>Designed and built by INSIYA HUSAIN in Indore, India. © 2026</p>
          <a className="hover:text-ink" href="#home">Back to the start</a>
        </div>
      </div>
    </footer>
  )
}
