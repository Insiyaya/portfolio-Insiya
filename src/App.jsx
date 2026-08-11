import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
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

/* Cursor spotlight — pointer-device only, and disabled for reduced-motion users */
function Spotlight() {
  const [pos,     setPos]     = useState({ x: -999, y: -999 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine   = window.matchMedia('(pointer: fine)').matches
    const calm   = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return
    setEnabled(true)

    const h = e => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])

  if (!enabled) return null

  return (
    <div
      className="pointer-events-none fixed z-0 rounded-full"
      style={{
        width: 520,
        height: 520,
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle, rgba(255,45,170,0.055) 0%, rgba(192,132,252,0.025) 42%, transparent 68%)',
        transition: 'left 0.06s, top 0.06s',
        willChange: 'left, top',
      }}
    />
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
    </>
  )
}
