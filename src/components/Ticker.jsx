import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  SiPython, SiCplusplus, SiDart, SiJavascript, SiTypescript,
  SiFastapi, SiDjango, SiFlutter, SiReact, SiNextdotjs, SiTailwindcss,
  SiDocker, SiTerraform, SiPostgresql, SiMongodb,
} from 'react-icons/si'
import { FaBrain, FaRobot, FaDatabase, FaAws, FaWandMagicSparkles, FaLayerGroup } from 'react-icons/fa6'

/* Icons are tinted from the palette rather than brand colours — a wall of
   brand logos would fight the pink identity. Tone drives the accent. */
const P = { pink: '#FF2DAA', neon: '#FF4FC3', magenta: '#D946EF', lavender: '#C084FC', soft: '#F9A8D4', cyber: '#67E8F9' }

const SKILLS_ROW1 = [
  { name: 'Python',     icon: SiPython,      color: P.pink     },
  { name: 'FastAPI',    icon: SiFastapi,     color: P.neon     },
  { name: 'Flutter',    icon: SiFlutter,     color: P.lavender },
  { name: 'AWS',        icon: FaAws,         color: P.magenta  },
  { name: 'Docker',     icon: SiDocker,      color: P.lavender },
  { name: 'React',      icon: SiReact,       color: P.soft     },
  { name: 'LangChain',  icon: FaBrain,       color: P.cyber    },
  { name: 'AI Agents',  icon: FaRobot,       color: P.cyber    },
  { name: 'Django',     icon: SiDjango,      color: P.pink     },
]

const SKILLS_ROW2 = [
  { name: 'TypeScript', icon: SiTypescript,  color: P.magenta  },
  { name: 'JavaScript', icon: SiJavascript,  color: P.pink     },
  { name: 'C++',        icon: SiCplusplus,   color: P.lavender },
  { name: 'Next.js',    icon: SiNextdotjs,   color: P.soft     },
  { name: 'Tailwind',   icon: SiTailwindcss, color: P.lavender },
  { name: 'Terraform',  icon: SiTerraform,   color: P.magenta  },
  { name: 'PostgreSQL', icon: SiPostgresql,  color: P.pink     },
  { name: 'MongoDB',    icon: SiMongodb,     color: P.neon     },
  { name: 'DynamoDB',   icon: FaDatabase,    color: P.lavender },
  { name: 'RAG',        icon: FaLayerGroup,  color: P.cyber    },
  { name: 'Prompt Eng.',icon: FaWandMagicSparkles, color: P.soft },
  { name: 'Dart',       icon: SiDart,        color: P.magenta  },
]

function SkillPill({ name, icon: Icon, color }) {
  return (
    <motion.span
      whileHover={{
        scale: 1.1,
        y: -3,
        borderColor: `${color}66`,
        background: `${color}14`,
        boxShadow: `0 8px 26px ${color}2e`,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] font-medium
                 tracking-[0.06em] text-dim whitespace-nowrap border border-line bg-surface/60
                 cursor-default transition-colors duration-200 hover:text-ink"
    >
      <Icon className="text-sm flex-shrink-0" style={{ color }} />
      {name}
    </motion.span>
  )
}

function TickerRow({ items, direction = 'left', speed = 40 }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
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
    <div className="relative py-5 border-y border-line bg-surface/50 backdrop-blur-sm overflow-hidden select-none space-y-3 mask-x">
      <TickerRow items={SKILLS_ROW1} direction="left"  speed={38} />
      <TickerRow items={SKILLS_ROW2} direction="right" speed={44} />
    </div>
  )
}
