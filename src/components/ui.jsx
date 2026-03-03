import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const ease = [0.21, 0.47, 0.32, 0.98]

/* Scroll-triggered entrance: blur → focus, slide up, fade in — REVERSES on scroll out */
export function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      animate={inView
        ? { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y: 32, filter: 'blur(6px)' }}
      transition={{ duration: 0.75, delay: inView ? delay : 0, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay: inView ? delay : 0, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: inView ? delay : 0, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Section header — highlight word reveals letter-by-letter, reverses on scroll out */
export function SectionHeader({ tag, title, highlight, sub }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-60px' })
  const letters = highlight.split('')

  return (
    <FadeUp className="text-center mb-14">
      <span className="section-tag">{tag}</span>
      <h2 className="font-display text-4xl md:text-[3rem] font-black tracking-[-0.04em] mb-3">
        {title}{' '}
        <span ref={ref} className="inline-flex" style={{ perspective: '600px' }}>
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="grad-text inline-block"
              animate={inView
                ? { opacity: 1, rotateX: 0, y: 0 }
                : { opacity: 0, rotateX: -80, y: 10 }}
              transition={{ duration: 0.45, delay: inView ? i * 0.055 : 0, ease }}
              style={{ transformOrigin: 'top center' }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </motion.span>
          ))}
        </span>
      </h2>
      {sub && <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">{sub}</p>}
    </FadeUp>
  )
}

/* Spotlight card — cursor-tracked radial glow follows the mouse */
export function SpotlightCard({ children, className = '', glowColor = 'rgba(129,140,248,0.13)' }) {
  const ref    = useRef(null)
  const [pos,    setPos]    = useState({ x: 0, y: 0 })
  const [inside, setInside] = useState(false)

  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => setInside(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width:     300,
          height:    300,
          left:      pos.x,
          top:       pos.y,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity:    inside ? 1 : 0,
          transition: 'opacity 0.3s',
          zIndex:     5,
        }}
      />
      {children}
    </div>
  )
}

export function GlowCard({ children, className = '', glowColor = 'rgba(129,140,248,0.12)' }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: `0 20px 50px ${glowColor}` }}
      transition={{ duration: 0.25 }}
      className={`glass rounded-2xl transition-colors duration-300 hover:border-indigo-400/25 hover:bg-white/[0.05] ${className}`}
    >
      {children}
    </motion.div>
  )
}
