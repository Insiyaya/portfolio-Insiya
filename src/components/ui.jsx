import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const ease = [0.21, 0.47, 0.32, 0.98]

/* Theme glow defaults — pink is the signature, so it leads. */
export const GLOW = {
  pink:     'rgba(255,45,170,0.13)',
  magenta:  'rgba(217,70,239,0.12)',
  lavender: 'rgba(192,132,252,0.11)',
  cyber:    'rgba(103,232,249,0.10)',
}

/* Scroll-triggered entrance: slide up + fade in — REVERSES on scroll out.
 *
 * Deliberately limited to opacity and transform, which the compositor can
 * handle off the main thread. The earlier version also animated
 * `filter: blur()`, which forces a repaint of the whole subtree on every
 * frame — with a reveal on nearly every block, that was a major source of
 * scroll stutter. */
export function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: inView ? delay : 0, ease }}
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

/* Thin corner brackets — technical framing, used on key surfaces */
export function CornerFrame({ color = 'rgba(255,45,170,0.30)' }) {
  const base = 'absolute w-3 h-3 pointer-events-none'
  return (
    <>
      <span className={`${base} top-0 left-0  border-t border-l rounded-tl-lg`} style={{ borderColor: color }} />
      <span className={`${base} top-0 right-0 border-t border-r rounded-tr-lg`} style={{ borderColor: color }} />
      <span className={`${base} bottom-0 left-0  border-b border-l rounded-bl-lg`} style={{ borderColor: color }} />
      <span className={`${base} bottom-0 right-0 border-b border-r rounded-br-lg`} style={{ borderColor: color }} />
    </>
  )
}

/* Small monospace system label — e.g. "SYSTEM ONLINE", "RAG PIPELINE" */
export function SystemLabel({ children, pulse = false, tone = 'cyber', className = '' }) {
  const tones = {
    cyber: { color: '#67E8F9', bg: 'rgba(103,232,249,0.05)', bd: 'rgba(103,232,249,0.18)' },
    pink:  { color: '#F9A8D4', bg: 'rgba(255,45,170,0.06)',  bd: 'rgba(255,45,170,0.20)'  },
  }
  const t = tones[tone] || tones.cyber
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md font-mono text-[9.5px] tracking-[0.16em] uppercase ${className}`}
      style={{ color: t.color, background: t.bg, border: `1px solid ${t.bd}` }}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60" style={{ background: t.color }} />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
        </span>
      )}
      {children}
    </span>
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
      <h2 className="font-display text-4xl md:text-[3rem] font-bold tracking-[-0.04em] mb-4 text-ink">
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
              {letter === ' ' ? ' ' : letter}
            </motion.span>
          ))}
        </span>
      </h2>

      {/* Hairline flourish under the heading */}
      <motion.div
        animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: inView ? 0.2 : 0, ease }}
        className="hair-divider w-24 mx-auto mb-4"
      />

      {sub && (
        <p className="text-dim text-sm max-w-lg mx-auto leading-relaxed text-balance">{sub}</p>
      )}
    </FadeUp>
  )
}

/* Spotlight card — cursor-tracked radial glow follows the mouse */
export function SpotlightCard({ children, className = '', glowColor = GLOW.pink }) {
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

export function GlowCard({ children, className = '', glowColor = GLOW.pink }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: `0 20px 50px ${glowColor}`, borderColor: 'rgba(255,45,170,0.40)' }}
      transition={{ duration: 0.25 }}
      className={`bg-surface border border-line rounded-2xl transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}
