import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  SiPython, SiCplusplus, SiDart, SiJavascript,
  SiFastapi, SiDjango, SiFlutter, SiReact,
  SiDocker, SiTerraform,
} from 'react-icons/si'
import { FaBrain, FaRobot, FaDatabase, FaAws, FaWandMagicSparkles } from 'react-icons/fa6'

const SKILLS_ROW1 = [
  { name: 'Python',      icon: SiPython,           color: '#3776AB' },
  { name: 'FastAPI',     icon: SiFastapi,          color: '#009688' },
  { name: 'Flutter',     icon: SiFlutter,          color: '#54C5F8' },
  { name: 'AWS',         icon: FaAws,              color: '#FF9900' },
  { name: 'Docker',      icon: SiDocker,           color: '#2496ED' },
  { name: 'React',       icon: SiReact,            color: '#61DAFB' },
  { name: 'LangChain',   icon: FaBrain,            color: '#818CF8' },
  { name: 'Agentic AI',  icon: FaRobot,            color: '#38BDF8' },
  { name: 'Django',      icon: SiDjango,           color: '#44B78B' },
]

const SKILLS_ROW2 = [
  { name: 'JavaScript',  icon: SiJavascript,       color: '#F7DF1E' },
  { name: 'C++',         icon: SiCplusplus,        color: '#00599C' },
  { name: 'Dart',        icon: SiDart,             color: '#0175C2' },
  { name: 'Terraform',   icon: SiTerraform,        color: '#7B42BC' },
  { name: 'DynamoDB',    icon: FaDatabase,         color: '#4053D6' },
  { name: 'Prompt Eng.', icon: FaWandMagicSparkles, color: '#A78BFA' },
  { name: 'Python',      icon: SiPython,           color: '#3776AB' },
  { name: 'FastAPI',     icon: SiFastapi,          color: '#009688' },
  { name: 'Flutter',     icon: SiFlutter,          color: '#54C5F8' },
]

function SkillPill({ name, icon: Icon, color }) {
  return (
    <motion.span
      whileHover={{
        scale: 1.14,
        y: -4,
        borderColor: `${color}60`,
        background: `${color}18`,
        boxShadow: `0 8px 30px ${color}30, 0 0 0 1px ${color}25`,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] font-medium tracking-[0.06em] text-slate-400 whitespace-nowrap border border-white/[0.06] bg-white/[0.025] cursor-default transition-colors duration-200 hover:text-white"
    >
      <Icon className="text-sm flex-shrink-0" style={{ color }} />
      {name}
    </motion.span>
  )
}

function TickerRow({ items, direction = 'left', speed = 40 }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const dup = [...items, ...items, ...items]

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="flex gap-3 w-max py-1.5"
        animate={{ x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
          ...(hovered && { duration: speed * 3 }),
        }}
      >
        {dup.map((skill, i) => (
          <SkillPill key={`${skill.name}-${i}`} {...skill} />
        ))}
      </motion.div>
    </div>
  )
}

export default function Ticker() {
  return (
    <div
      className="relative py-5 border-y border-white/[0.04] bg-[#030712]/80 backdrop-blur-sm overflow-hidden select-none space-y-3"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
    >
      <TickerRow items={SKILLS_ROW1} direction="left" speed={38} />
      <TickerRow items={SKILLS_ROW2} direction="right" speed={42} />
    </div>
  )
}
