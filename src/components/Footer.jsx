import { SiGithub, SiLinkedin } from 'react-icons/si'
import { LINKS } from '../data'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] py-6 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-slate-500 text-xs">
          Designed &amp; built by{' '}
          <span className="grad-text font-semibold">Insiya Husain</span>
          {' '}· © 2026
        </span>
        <div className="flex items-center gap-3">
          <a href={LINKS.github}   target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm"><SiGithub /></a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm"><SiLinkedin /></a>
        </div>
      </div>
    </footer>
  )
}
