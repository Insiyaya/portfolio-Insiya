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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 55)
      let cur = ''
      document.querySelectorAll('section[id]').forEach(s => {
        if (window.scrollY >= s.offsetTop - 220) cur = s.id
      })
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#030712]/90 backdrop-blur-2xl border-b border-white/[0.05] py-3' : 'py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="font-display font-black text-xl tracking-[-0.04em] grad-text">
            IH.
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV.map(n => (
              <li key={n}>
                <a
                  href={`#${n.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    active === n.toLowerCase() ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {n}
                  <span className={`absolute -bottom-0.5 left-0 h-[1.5px] rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 transition-all duration-300 ${
                    active === n.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </a>
              </li>
            ))}
            <li>
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(129,140,248,0.4)]"
                style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)' }}
              >
                <SiGithub className="text-sm" /> GitHub
              </a>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden text-slate-300 hover:text-white transition-colors"
          >
            {open ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>
        
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[60px] inset-x-0 z-40 bg-[#030712]/95 backdrop-blur-2xl border-b border-white/[0.06] md:hidden"
          >
            <ul className="flex flex-col gap-1 p-5">
              {NAV.map(n => (
                <li key={n}>
                  <a
                    href={`#${n.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 px-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.04] text-sm font-medium transition-all"
                  >
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
