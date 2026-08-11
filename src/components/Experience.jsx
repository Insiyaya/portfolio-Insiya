import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaBuilding, FaCalendarDays } from 'react-icons/fa6'
import { SectionHeader, FadeUp, ScrollReveal } from './ui'
import { EXPERIENCE } from '../data'

function ExpCard({ exp, index }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="grid grid-cols-[32px_1fr] gap-0 relative">
        {/* Timeline dot */}
        <div className="flex flex-col items-center pt-5">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: 'spring' }}
            className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-[0_0_14px_rgba(255,45,170,0.6)] z-10"
            style={{ background: 'linear-gradient(135deg,#FF2DAA,#C084FC)', border: '2.5px solid #0D0812' }}
          />
        </div>

        {/* Card */}
        <motion.div
          whileHover={{ x: 6, borderColor: 'rgba(255,45,170,0.40)', boxShadow: '0 14px 40px rgba(255,45,170,0.12)' }}
          transition={{ duration: 0.22 }}
          className="ml-5 mb-10 p-6 card relative overflow-hidden group"
        >
          {/* Left accent */}
          <span
            className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(to bottom, #FF2DAA, #C084FC)' }}
          />

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neon uppercase tracking-[0.1em] mb-1">
                <FaBuilding className="text-[10px]" /> {exp.company}
                {exp.current && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-cyber/[0.07] border border-cyber/20 text-cyber text-[9px] tracking-[0.14em] font-mono uppercase">
                    current
                  </span>
                )}
              </div>
              <div className="font-display text-lg font-bold tracking-[-0.02em] text-ink">{exp.role}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-faint bg-surface2 px-3 py-1 rounded-md border border-line">
              <FaCalendarDays className="text-[10px]" /> {exp.period}
            </span>
          </div>

          {/* Points */}
          <ul className="space-y-2.5 mb-4">
            {exp.points.map((p, i) => (
              <li key={i} className="flex gap-2.5 items-start text-[0.84rem] text-dim leading-relaxed">
                <span className="text-hotpink mt-[3px] flex-shrink-0 text-[10px]">▸</span>
                {p}
              </li>
            ))}
          </ul>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {exp.tags.map(t => <span key={t} className="chip">{t}</span>)}
          </div>
        </motion.div>
      </div>
    </ScrollReveal>
  )
}

export default function Experience() {
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 20%'],
  })
  /* Timeline line grows from top as user scrolls through the section */
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    /* No overflow-hidden so md:sticky works */
    <section id="experience" className="relative py-24 bg-void">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 82% 26%, rgba(192,132,252,0.06) 0%, transparent 58%)' }}
      />

      <div className="relative max-w-5xl mx-auto px-5">
        <div className="grid md:grid-cols-[210px_1fr] gap-x-14 gap-y-0 items-start">

          {/* ── STICKY LEFT — Section Header ── */}
          <div className="hidden md:block md:sticky md:top-28">
            <FadeUp>
              <span className="section-tag">// work.experience</span>
              <div className="mt-5">
                <div className="font-display text-[2.4rem] font-bold tracking-[-0.04em] leading-none mb-1 text-ink">Work</div>
                <div className="font-display text-[2.4rem] font-bold tracking-[-0.04em] leading-none grad-text">Experience</div>
              </div>
              <p className="text-faint text-[0.78rem] leading-relaxed mt-4">
                My professional journey building real-world software
              </p>

              {/* Position count */}
              <div className="mt-6 flex items-center gap-2">
                <span className="font-mono text-[10px] text-faint uppercase tracking-widest">
                  {EXPERIENCE.length} positions
                </span>
              </div>

              {/* Decorative vertical accent */}
              <div
                className="mt-5 ml-1 h-28 w-px"
                style={{ background: 'linear-gradient(to bottom, rgba(255,45,170,0.55), rgba(192,132,252,0.22), transparent)' }}
              />
              <div className="w-1.5 h-1.5 rounded-full ml-[1px] -mt-0.5 bg-hotpink/60 shadow-[0_0_8px_rgba(255,45,170,0.5)]" />
            </FadeUp>
          </div>

          {/* ── SCROLLING RIGHT — Timeline ── */}
          <div>
            {/* Mobile header */}
            <div className="md:hidden mb-10">
              <SectionHeader
                tag="// work.experience"
                title="Work"
                highlight="Experience"
                sub="My professional journey building real-world software"
              />
            </div>

            <div ref={timelineRef} className="relative pt-2">
              {/* Static faint line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-line" />
              {/* Animated growing line */}
              <motion.div
                className="absolute left-4 top-0 w-px origin-top"
                style={{
                  scaleY: lineScaleY,
                  height: '100%',
                  background: 'linear-gradient(to bottom, #FF2DAA 0%, #D946EF 45%, #C084FC 82%, transparent 100%)',
                }}
              />

              {EXPERIENCE.map((exp, i) => (
                <ExpCard key={exp.company} exp={exp} index={i} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
