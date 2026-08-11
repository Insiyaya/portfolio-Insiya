import { motion } from 'framer-motion'
import { FaGraduationCap, FaBookOpen, FaBook, FaStar } from 'react-icons/fa6'
import { SectionHeader, StaggerContainer, StaggerItem } from './ui'
import { SectionCosmos } from './SpaceScene'
import { EDUCATION } from '../data'

const EDU_ICONS  = [FaGraduationCap, FaBookOpen, FaBook]
/* Walk the palette across the three cards instead of repeating one accent */
const EDU_ACCENT = ['#FF2DAA', '#D946EF', '#C084FC']

export default function Education() {
  return (
    <section id="education" className="relative py-24 overflow-hidden bg-void">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 48% 45% at 50% 50%, rgba(192,132,252,0.05) 0%, transparent 60%)' }}
      />
      <SectionCosmos
        planet="lavender"
        size={96}
        position={{ left: '-38px', top: '14%' }}
        starOpacity={0.26}
      />

      <div className="relative max-w-4xl mx-auto px-5">
        <SectionHeader
          tag="// education.background"
          title="Academic"
          highlight="Journey"
        />

        <StaggerContainer className="grid sm:grid-cols-3 gap-4">
          {EDUCATION.map((edu, i) => {
            const Icon   = EDU_ICONS[i]
            const accent = EDU_ACCENT[i] || EDU_ACCENT[0]
            return (
              <StaggerItem key={edu.year}>
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(255,45,170,0.38)', boxShadow: `0 16px 42px ${accent}24` }}
                  transition={{ duration: 0.25 }}
                  className="relative h-full p-6 card overflow-hidden group"
                >
                  {/* Left accent */}
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
                  />

                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 border"
                    style={{ background: `${accent}14`, borderColor: `${accent}30` }}
                  >
                    <Icon className="text-[0.9rem]" style={{ color: accent }} />
                  </div>

                  <div className="font-mono text-[10px] mb-1.5 tracking-[0.14em]" style={{ color: accent }}>
                    {edu.year}
                  </div>
                  <div className="font-display text-[0.95rem] font-bold tracking-[-0.02em] text-ink mb-1">{edu.degree}</div>
                  <div className="text-faint text-xs mb-4 leading-relaxed">{edu.institution}</div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-softpink border border-hotpink/[0.22] bg-hotpink/[0.07]">
                    <FaStar className="text-[9px]" /> {edu.score}
                  </span>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
