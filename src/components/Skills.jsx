import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  SiPython, SiCplusplus, SiDart, SiJavascript,
  SiFastapi, SiDjango, SiFlutter, SiReact,
  SiDocker, SiTerraform,
} from 'react-icons/si'
import { FaBrain, FaWandMagicSparkles, FaRobot, FaDatabase, FaAws } from 'react-icons/fa6'
import { StaggerContainer, SectionHeader } from './ui'
import { SKILLS } from '../data'

const ease = [0.21, 0.47, 0.32, 0.98]

const ICON_MAP = {
  SiPython, SiCplusplus, SiDart, SiJavascript,
  SiFastapi, SiDjango, SiFlutter, SiReact,
  SiDocker, SiTerraform,
  FaBrain, FaWandMagicSparkles, FaRobot, FaDatabase,
  FaWand:      FaWandMagicSparkles,
  SiAmazonaws: FaAws,
}

/* Individual skill card — 3D flip entrance + colored hover glow */
function SkillCard({ name, icon, color }) {
  const Icon = ICON_MAP[icon]
  return (
    <motion.div
      /* Variants are picked up by StaggerContainer for staggered flip-in */
      variants={{
        hidden: {
          opacity: 0,
          rotateY: 72,
          scale: 0.85,
          filter: 'blur(5px)',
          transformPerspective: 900,
        },
        visible: {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          filter: 'blur(0px)',
          transformPerspective: 900,
          transition: { duration: 0.55, ease },
        },
      }}
      whileHover={{
        y: -7,
        scale: 1.06,
        boxShadow: `0 18px 45px ${color}38, 0 0 0 1px ${color}22`,
        borderColor: `${color}40`,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="relative group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-default overflow-hidden"
    >
      {/* Top shimmer line */}
      <span
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      {/* Radial background glow */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}26 0%, transparent 70%)` }}
      />
      {/* Soft glow dot at bottom */}
      <span
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full blur-lg opacity-0 group-hover:opacity-55 transition-opacity duration-300"
        style={{ background: color }}
      />

      {Icon && (
        <Icon
          className="text-[2.1rem] mb-2.5 relative z-10 transition-transform duration-200 group-hover:scale-110"
          style={{ color, filter: `drop-shadow(0 0 8px ${color}55)` }}
        />
      )}
      <span className="text-[0.7rem] font-semibold text-slate-500 tracking-wide relative z-10 group-hover:text-slate-200 transition-colors duration-200">
        {name}
      </span>
    </motion.div>
  )
}

/* Category label — clip-path wipe from left + animated divider line draw */
function CategoryLabel({ text, delay = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-50px' })
  return (
    <div ref={ref} className="flex items-center gap-2 mb-4">
      <motion.span
        animate={inView
          ? { clipPath: 'inset(0 0% 0 0)' }
          : { clipPath: 'inset(0 100% 0 0)' }}
        transition={{ duration: 0.65, delay: inView ? delay : 0, ease }}
        className="font-mono text-xs text-violet-400 whitespace-nowrap"
      >
        <span className="text-slate-600 mr-1">//</span>
        {text}
      </motion.span>

      {/* Divider line draws from left after label finishes */}
      <motion.div
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, delay: inView ? delay + 0.3 : 0, ease }}
        className="flex-1 h-px bg-white/[0.04] origin-left"
      />
    </div>
  )
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-24 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 55% 55% at 15% 45%, rgba(167,139,250,0.065) 0%, transparent 55%), #030712' }}
    >
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader
          tag="// skills.tech_stack"
          title="My"
          highlight="Toolkit"
          sub="Technologies I work with daily to build robust, scalable applications"
        />

        <div className="space-y-10">
          {SKILLS.map(({ category, items }, ci) => (
            <div key={category}>
              <CategoryLabel text={category} delay={ci * 0.08} />

              {/* StaggerContainer drives the flip-in stagger — SkillCard carries its own variants */}
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                {items.map(skill => (
                  <SkillCard key={skill.name} {...skill} />
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
