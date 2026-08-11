import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { LINKS } from '../data'

const NAV = ['About','Skills','Experience','Projects','Certifications','Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [active,   setActive]   = useState('')

  /* Shrink-on-scroll. rAF-coalesced and state is only written when the
     boolean actually flips, so scrolling costs at most one cheap read. */
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 55)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* Active section via IntersectionObserver instead of measuring every
     section's offsetTop on each scroll event — that forced a synchronous
     layout per tick, which is the main cause of scroll stutter. */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'))
    if (!sections.length) return

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      /* Only the section crossing the viewport's middle band counts */
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            /* blur-md rather than blur-2xl: backdrop-filter is re-sampled as the
               page moves underneath, and a large radius on a full-width bar is
               one of the costlier things you can do during a scroll. */
            ? 'bg-void/90 backdrop-blur-md border-b border-line py-2.5'
            : 'py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Wordmark */}
          <a
            href="#home"
            className="font-display font-bold text-lg tracking-[-0.04em] grad-text hover:opacity-80 transition-opacity"
          >
            IH.
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV.map(n => {
              const isActive = active === n.toLowerCase()
              return (
                <li key={n}>
                  <a
                    href={`#${n.toLowerCase()}`}
                    className={`text-[0.8rem] font-medium tracking-tight transition-all duration-200 relative group ${
                      isActive
                        ? 'text-neon [text-shadow:0_0_14px_rgba(255,45,170,0.45)]'
                        : 'text-dim hover:text-ink hover:[text-shadow:0_0_12px_rgba(255,45,170,0.35)]'
                    }`}
                  >
                    {n}
                    <span
                      className={`absolute -bottom-1 left-0 h-[1.5px] rounded-full bg-grad-brand transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
            <li>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-ink px-3.5 py-1.5 rounded-lg
                           bg-hotpink transition-all duration-200 hover:bg-neon hover:-translate-y-0.5
                           shadow-[0_3px_14px_rgba(255,45,170,0.28)] hover:shadow-[0_6px_22px_rgba(255,45,170,0.45)]"
              >
                <SiGithub className="text-sm" /> GitHub
              </a>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden text-dim hover:text-neon transition-colors p-1"
          >
            {open ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[56px] inset-x-0 z-40 bg-void/95 backdrop-blur-2xl border-b border-line md:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {NAV.map(n => {
                const isActive = active === n.toLowerCase()
                return (
                  <li key={n}>
                    <a
                      href={`#${n.toLowerCase()}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-neon bg-hotpink/[0.09] border border-hotpink/20'
                          : 'text-dim hover:text-ink hover:bg-surface2 border border-transparent'
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isActive ? 'bg-hotpink' : 'bg-line2'}`} />
                      {n}
                    </a>
                  </li>
                )
              })}
              <li className="mt-2 pt-3 border-t border-line">
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full"
                >
                  <SiGithub /> GitHub
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
