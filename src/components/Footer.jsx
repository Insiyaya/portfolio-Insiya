import { SiGithub, SiLinkedin } from 'react-icons/si'
import { LINKS } from '../data'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-void py-7 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-faint text-xs order-2 sm:order-1">
          Designed &amp; built by{' '}
          <span className="grad-text-static font-semibold">Insiya Husain</span>
          {' '}· © 2026
        </span>

        {/* System footer note — quiet technical signature */}
        <span className="order-1 sm:order-2 flex items-center gap-2 font-mono text-[9.5px] tracking-[0.2em] uppercase text-faint/70">
          <span className="w-1 h-1 rounded-full bg-cyber animate-pulse-dot" />
          all systems operational
        </span>

        <div className="flex items-center gap-3 order-3">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-faint hover:text-neon transition-colors text-sm"
          >
            <SiGithub />
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-faint hover:text-neon transition-colors text-sm"
          >
            <SiLinkedin />
          </a>
        </div>
      </div>
    </footer>
  )
}
