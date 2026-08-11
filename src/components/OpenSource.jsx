import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { FaUsers, FaCodePullRequest, FaBolt } from 'react-icons/fa6'
import { SectionHeader, FadeUp } from './ui'
import { LINKS } from '../data'

const STATS = [
  { num: '40+', label: 'Public Repos' },
  { num: '3',   label: 'Achievements' },
  { num: '×2',  label: 'Pull Shark'   },
]

const ACHVS = [
  { icon: FaUsers,           label: 'Pair Extraordinaire' },
  { icon: FaCodePullRequest, label: 'Pull Shark ×2'       },
  { icon: FaBolt,            label: 'Quickdraw'           },
]

export default function OpenSource() {
  return (
    <section id="opensource" className="relative py-24 overflow-hidden bg-void">
      <div className="relative max-w-2xl mx-auto px-5">
        <SectionHeader
          tag="// github.contributions"
          title="Open Source"
          highlight="Impact"
        />

        <FadeUp>
          <motion.div
            whileHover={{ borderColor: 'rgba(255,45,170,0.38)', boxShadow: '0 20px 54px rgba(255,45,170,0.13)' }}
            transition={{ duration: 0.3 }}
            className="p-8 card text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

            <SiGithub className="text-4xl text-dim mx-auto mb-6 relative" />

            <div className="flex justify-center gap-10 mb-7 relative">
              {STATS.map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl font-bold grad-text-static mb-0.5">{num}</div>
                  <div className="text-[10px] text-faint uppercase tracking-[0.12em]">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-7 relative">
              {ACHVS.map(({ icon: Icon, label }) => (
                <motion.span
                  key={label}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(255,45,170,0.48)', color: '#FFF7FC' }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-softpink
                             border border-hotpink/[0.20] bg-hotpink/[0.06] cursor-default"
                >
                  <Icon className="text-[11px]" /> {label}
                </motion.span>
              ))}
            </div>

            <motion.a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost relative"
            >
              <SiGithub /> View Profile
            </motion.a>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  )
}
