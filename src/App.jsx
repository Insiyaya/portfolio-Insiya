import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa6'
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import About          from './components/About'
import Skills         from './components/Skills'
import Experience     from './components/Experience'
import HowIWork      from './components/HowIWork'
import Projects       from './components/Projects'
import Certifications from './components/Certifications'
import OpenSource     from './components/OpenSource'
import Education      from './components/Education'
import Contact        from './components/Contact'
import Footer         from './components/Footer'
import Ticker         from './components/Ticker'
import ParticleNetwork from './components/ParticleNetwork'

/* Thin scroll-progress bar at top */
function ScrollBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[999] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(to right, #FF2DAA, #D946EF, #C084FC)',
        boxShadow: '0 0 12px rgba(255,45,170,0.5)',
      }}
    />
  )
}

/* Cursor spotlight — pointer-device only, and disabled for reduced-motion users.
 *
 * Written straight to the DOM inside a single rAF instead of through React
 * state, and moved with `transform` rather than `left`/`top`. The previous
 * version re-rendered the tree on every mousemove and animated layout
 * properties, which competed with scrolling for main-thread time. */
const SPOT = 520

function Spotlight() {
  const ref = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    let x = -9999
    let y = -9999

    const paint = () => {
      frame = 0
      const el = ref.current
      if (el) el.style.transform = `translate3d(${x - SPOT / 2}px, ${y - SPOT / 2}px, 0)`
    }

    const onMove = e => {
      x = e.clientX
      y = e.clientY
      if (!frame) frame = requestAnimationFrame(paint)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 rounded-full"
      style={{
        width: SPOT,
        height: SPOT,
        transform: `translate3d(-9999px, -9999px, 0)`,
        background: 'radial-gradient(circle, rgba(255,45,170,0.055) 0%, rgba(192,132,252,0.025) 42%, transparent 68%)',
        willChange: 'transform',
      }}
    />
  )
}

/* Back-to-top — appears once the hero is behind you */
function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setShow(window.scrollY > window.innerHeight * 1.2)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-xl flex items-center justify-center
                     text-softpink bg-surface2/80 backdrop-blur-sm border border-line2
                     hover:text-ink hover:border-hotpink/50 hover:shadow-[0_6px_20px_rgba(255,45,170,0.22)]
                     transition-colors duration-200"
        >
          <FaArrowUp className="text-xs" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollBar />
      <Spotlight />
      <ParticleNetwork />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <About />
        <Skills />
        <Experience />
        <HowIWork />
        <Projects />
        <Certifications />
        <OpenSource />
        <Education />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
