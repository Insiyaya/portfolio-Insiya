import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FaMagnifyingGlass, FaSitemap, FaCode, FaRocket, FaChartLine,
} from 'react-icons/fa6'
import { SectionHeader, ScrollReveal } from './ui'
import { WORKFLOW } from '../data'

const ICON_MAP = { FaMagnifyingGlass, FaSitemap, FaCode, FaRocket, FaChartLine }

/* ── Step card ── */
function StepCard({ step }) {
  const Icon = ICON_MAP[step.icon] || FaCode
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: 'rgba(255,45,170,0.38)', boxShadow: `0 16px 42px ${step.accent}22` }}
      transition={{ duration: 0.25 }}
      className="p-5 card relative overflow-hidden group"
    >
      <span
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)` }}
      />

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
          style={{ background: `${step.accent}16`, borderColor: `${step.accent}33` }}
        >
          <Icon className="text-lg" style={{ color: step.accent }} />
        </div>
        <span className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-faint">
          step {String(step.step).padStart(2, '0')}
        </span>
      </div>

      <h3 className="font-display text-[0.98rem] font-bold tracking-[-0.02em] text-ink mb-2">{step.title}</h3>
      <p className="text-dim text-[0.82rem] leading-relaxed">{step.desc}</p>
    </motion.div>
  )
}

/* ── Step node (numbered circle on the spine) ── */
function StepNode({ step, index }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ margin: '-40px' }}
      transition={{ type: 'spring', delay: index * 0.08 + 0.15, stiffness: 260, damping: 20 }}
      className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-mono font-bold border-2 z-10 flex-shrink-0"
      style={{
        background: '#160D1C',
        borderColor: `${step.accent}66`,
        color: step.accent,
        boxShadow: `0 0 18px ${step.accent}33`,
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </motion.div>
  )
}

/* ── Main section ── */
export default function HowIWork() {
  const spineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 80%', 'end 20%'],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="process" className="relative py-24 bg-void">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 28% 56%, rgba(255,45,170,0.055) 0%, transparent 58%)' }}
      />

      <div className="relative max-w-5xl mx-auto px-5">
        <SectionHeader
          tag="// my.process"
          title="How I"
          highlight="Work"
          sub="From problem discovery to production. A structured approach to building software that scales."
        />

        {/* ── Stepper container ── */}
        <div ref={spineRef} className="relative mt-16">

          {/* ── Animated spine line (center on md+, left on mobile) ── */}
          <div className="absolute top-0 bottom-0 left-[19px] md:left-1/2 md:-translate-x-px w-[2px]">
            <div className="absolute inset-0 bg-line rounded-full" />
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-full origin-top"
              style={{
                scaleY: lineScaleY,
                background: 'linear-gradient(to bottom, #FF2DAA 0%, #FF4FC3 25%, #D946EF 50%, #C084FC 75%, #F9A8D4 100%)',
              }}
            />
          </div>

          {/* ── Steps ── */}
          <div className="flex flex-col gap-10 md:gap-14">
            {WORKFLOW.map((step, i) => {
              const isEven = i % 2 === 0
              return (
                <ScrollReveal key={step.step} delay={i * 0.08}>
                  {/* ── Mobile layout ── */}
                  <div className="md:hidden grid grid-cols-[40px_1fr] gap-4 items-start">
                    <div className="flex justify-center pt-1">
                      <StepNode step={step} index={i} />
                    </div>
                    <StepCard step={step} />
                  </div>

                  {/* ── Desktop layout (alternating) ── */}
                  <div className="hidden md:grid md:grid-cols-[1fr_48px_1fr] gap-0 items-center">
                    <div className={isEven ? 'pr-8' : ''}>
                      {isEven && <StepCard step={step} />}
                    </div>

                    <div className="flex justify-center">
                      <StepNode step={step} index={i} />
                    </div>

                    <div className={!isEven ? 'pl-8' : ''}>
                      {!isEven && <StepCard step={step} />}
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
