import { motion } from 'framer-motion'
import { FaGraduationCap, FaBookOpen, FaBook, FaStar } from 'react-icons/fa6'
import { SectionHeader, StaggerContainer, StaggerItem } from './ui'
import { EDUCATION } from '../data'

const EDU_ICONS = [FaGraduationCap, FaBookOpen, FaBook]

export default function Education() {
  return (
    <section
      id="education"
      className="relative py-24 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(56,189,248,0.045) 0%, transparent 60%), #060d1f' }}
    >
      <div className="max-w-4xl mx-auto px-5">
        <SectionHeader
          tag="// education.background"
          title="Academic"
          highlight="Journey"
        />

        <StaggerContainer className="grid sm:grid-cols-3 gap-4">
          {EDUCATION.map((edu, i) => {
            const Icon = EDU_ICONS[i]
            return (
              <StaggerItem key={edu.year}>
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(129,140,248,0.28)', boxShadow: '0 16px 40px rgba(129,140,248,0.12)' }}
                  transition={{ duration: 0.25 }}
                  className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-colors duration-300 overflow-hidden group"
                >
                  {/* Left accent */}
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to bottom, #818cf8, #38bdf8)' }}
                  />

                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-indigo-400/[0.08] border border-indigo-400/[0.18]">
                    <Icon className="text-indigo-400 text-[0.9rem]" />
                  </div>

                  <div className="font-mono text-[10px] text-sky-400 mb-1.5 tracking-wider">{edu.year}</div>
                  <div className="font-display text-[0.95rem] font-bold tracking-tight mb-1">{edu.degree}</div>
                  <div className="text-slate-500 text-xs mb-4 leading-relaxed">{edu.institution}</div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-300 border border-indigo-400/[0.2] bg-indigo-400/[0.08]">
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
