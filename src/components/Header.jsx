import { useEffect, useRef, useState } from 'react'
import { LINKS } from '../data'

const NAV = [
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
]

/* The top letterbox bar. It stays put, so it doubles as site navigation. */
export default function Header() {
  const bar = useRef(null)
  const menu = useRef(null)
  const [active, setActive] = useState('')

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      frame ||= requestAnimationFrame(() => {
        frame = 0
        const top = document.getElementById('home')?.offsetHeight ?? 0
        const span = document.documentElement.scrollHeight - window.innerHeight - top
        bar.current?.style.setProperty('--read', Math.max(0, Math.min(1, (window.scrollY - top) / Math.max(1, span))).toFixed(4))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && setActive(`#${e.target.id}`)), { rootMargin: '-45% 0px -50% 0px' })
    for (const id of ['home', 'about', 'experience', 'projects', 'skills', 'process', 'credentials', 'contact']) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const openMenu = () => {
    menu.current.showModal()
    document.dispatchEvent(new Event('panel-open'))
  }

  return (
    <header ref={bar} className="site-head">
      <div className="site-head-status">
        <p>
          Founder, <a href={LINKS.twofolds} target="_blank" rel="noopener noreferrer">Twofolds</a>
        </p>
        <p>
          Product Engineer, <a href={LINKS.ruby} target="_blank" rel="noopener noreferrer">Ruby CRM</a>
        </p>
      </div>
      <a href="#home" className="site-head-mark" aria-label="INSIYA HUSAIN, back to the start">
        <b>INSIYA HUSAIN</b>
        <small>Full Stack and AI Engineer</small>
      </a>
      <nav aria-label="Sections">
        {NAV.map(([label, href]) => (
          <a key={href} href={href} aria-current={active === href ? 'true' : undefined}>{label}</a>
        ))}
      </nav>
      <button type="button" className="site-head-menu" onClick={openMenu} aria-label="Open menu"><span /><span /></button>
      <dialog ref={menu} className="menu" aria-label="Menu" onClick={e => (e.target === menu.current || e.target.closest('a')) && menu.current.close()}>
        <button type="button" className="panel-close" onClick={() => menu.current.close()} aria-label="Close menu"><span aria-hidden="true" /></button>
        <nav aria-label="Menu">
          {[['Start', '#home'], ...NAV].map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <p>Product Engineer, <a href={LINKS.ruby} target="_blank" rel="noopener noreferrer">Ruby CRM</a>. Founder, <a href={LINKS.twofolds} target="_blank" rel="noopener noreferrer">Twofolds</a>.</p>
      </dialog>
    </header>
  )
}
