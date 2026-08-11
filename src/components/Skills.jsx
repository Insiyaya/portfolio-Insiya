import { motion } from 'framer-motion'
import {
  SiPython, SiCplusplus, SiDart, SiJavascript, SiTypescript,
  SiFastapi, SiDjango, SiFlutter, SiReact, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiDocker, SiTerraform, SiPostgresql, SiMongodb,
} from 'react-icons/si'
import {
  FaBrain, FaWandMagicSparkles, FaRobot, FaDatabase, FaAws,
  FaDiagramProject, FaLayerGroup, FaCubes,
} from 'react-icons/fa6'
import { StaggerContainer, StaggerItem, SectionHeader, SystemLabel } from './ui'
import { SectionCosmos } from './SpaceScene'
import { SKILLS } from '../data'

const ICON_MAP = {
  SiPython, SiCplusplus, SiDart, SiJavascript, SiTypescript,
  SiFastapi, SiDjango, SiFlutter, SiReact, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiDocker, SiTerraform, SiPostgresql, SiMongodb,
  FaBrain, FaWandMagicSparkles, FaRobot, FaDatabase, FaAws,
  FaDiagramProject, FaLayerGroup, FaCubes,
}

/* Chip treatments per category tone. Cyan is reserved for AI / LLM. */
const TONES = {
  pink: {
    text:   '#F9A8D4',
    icon:   '#FF4FC3',
    bg:     'rgba(255,45,170,0.06)',
    border: 'rgba(255,45,170,0.20)',
    hoverB: 'rgba(255,45,170,0.50)',
    hoverS: '0 8px 24px rgba(255,45,170,0.16)',
    label:  '#FF4FC3',
    rule:   'rgba(255,45,170,0.35)',
  },
  lavender: {
    text:   '#DCC6FF',
    icon:   '#C084FC',
    bg:     'rgba(192,132,252,0.06)',
    border: 'rgba(192,132,252,0.20)',
    hoverB: 'rgba(192,132,252,0.48)',
    hoverS: '0 8px 24px rgba(192,132,252,0.14)',
    label:  '#C084FC',
    rule:   'rgba(192,132,252,0.30)',
  },
  cyan: {
    text:   '#A5F3FC',
    icon:   '#67E8F9',
    bg:     'rgba(103,232,249,0.05)',
    border: 'rgba(103,232,249,0.18)',
    hoverB: 'rgba(103,232,249,0.42)',
    hoverS: '0 8px 24px rgba(103,232,249,0.14)',
    label:  '#67E8F9',
    rule:   'rgba(103,232,249,0.28)',
  },
}

/* One skill = one elegant chip. Small icon, no oversized logos. */
function SkillChip({ name, icon, tone }) {
  const Icon = ICON_MAP[icon]
  const t = TONES[tone] || TONES.pink

  return (
    <motion.span
      variants={{
        hidden:  { opacity: 0, y: 12, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      whileHover={{ y: -3, borderColor: t.hoverB, boxShadow: t.hoverS }}
      transition={{ duration: 0.18 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.78rem] font-medium
                 cursor-default transition-colors duration-200 select-none"
      style={{ color: t.text, background: t.bg, border: `1px solid ${t.border}` }}
    >
      {Icon && <Icon className="text-[0.9rem] flex-shrink-0" style={{ color: t.icon }} />}
      {name}
    </motion.span>
  )
}

function CategoryBlock({ category, tone, items, index }) {
  const t = TONES[tone] || TONES.pink
  const isAI = tone === 'cyan'

  return (
    <StaggerItem>
      <motion.div
        whileHover={{ y: -3, borderColor: 'rgba(255,45,170,0.30)' }}
        transition={{ duration: 0.25 }}
        className="p-5 md:p-6 card relative overflow-hidden group"
      >
        {/* Top accent — appears on hover only */}
        <span
          className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${t.rule}, transparent)` }}
        />

        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase whitespace-nowrap" style={{ color: t.label }}>
            <span className="text-faint mr-1.5">{String(index + 1).padStart(2, '0')}</span>
            {category}
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${t.rule}, transparent)` }} />
          <span className="font-mono text-[10px] text-faint tabular-nums">{String(items.length).padStart(2, '0')}</span>
        </div>

        {/* Chips */}
        <StaggerContainer className="flex flex-wrap gap-2">
          {items.map(item => (
            <SkillChip key={item.name} {...item} tone={tone} />
          ))}
        </StaggerContainer>

        {/* AI block earns one extra technical detail */}
        {isAI && (
          <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center gap-2">
            <SystemLabel pulse>ai agent active</SystemLabel>
            <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-faint/80">
              retrieve → reason → act
            </span>
          </div>
        )}
      </motion.div>
    </StaggerItem>
  )
}

export default function Skills() {
  const total = SKILLS.reduce((n, c) => n + c.items.length, 0)

  return (
    <section id="skills" className="relative py-24 overflow-hidden bg-void">
      {/* Section lighting — soft, off-centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 12% 40%, rgba(255,45,170,0.06) 0%, transparent 58%)' }}
      />
      <div className="absolute inset-0 dot-grid opacity-[0.55] pointer-events-none" />
      <SectionCosmos
        planet="lavender"
        size={120}
        position={{ right: '-46px', top: '6%' }}
        starOpacity={0.3}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        <SectionHeader
          tag="// skills.tech_stack"
          title="My"
          highlight="Toolkit"
          sub="Technologies I work with daily to build robust, scalable applications"
        />

        {/* items-start keeps each card snug to its chips — stretching short
            categories to the row height leaves dead space inside them. */}
        <StaggerContainer className="grid gap-4 md:grid-cols-2 items-start">
          {SKILLS.map((cat, i) => (
            <CategoryBlock key={cat.category} {...cat} index={i} />
          ))}
        </StaggerContainer>

        {/* Footer metadata line */}
        <div className="mt-8 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase text-faint/70">
          <span className="w-8 h-px bg-line2" />
          {total} technologies · {SKILLS.length} disciplines
          <span className="w-8 h-px bg-line2" />
        </div>
      </div>
    </section>
  )
}
