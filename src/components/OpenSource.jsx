import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import { FaUsers, FaCodePullRequest, FaBolt } from 'react-icons/fa6'
import { SectionHeader, FadeUp } from './ui'
import { LINKS } from '../data'

const STATS   = [
  { num: '40+', label: 'Public Repos'  },
  { num: '3',   label: 'Achievements'  },
  { num: '×2',  label: 'Pull Shark'    },
]
const ACHVS = [
  { icon: FaUsers,          label: 'Pair Extraordinaire' },
  { icon: FaCodePullRequest, label: 'Pull Shark ×2'      },
  { icon: FaBolt,           label: 'Quickdraw'           },
]

export default function OpenSource() {
  return (
    <section
      id="opensource"
      className="relative py-24 overflow-hidden bg-[#030712]"
    >
      <div className="max-w-2xl mx-auto px-5">
        <SectionHeader
          tag="// github.contributions"
          title="Open Source"
          highlight="Impact"
        />

        <FadeUp>
          <motion.div
            whileHover={{ borderColor: 'rgba(129,140,248,0.28)', boxShadow: '0 20px 50px rgba(129,140,248,0.12)' }}
            className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-all duration-300 text-center"
          >
            <SiGithub className="text-4xl text-slate-400 mx-auto mb-6" />

            <div className="flex justify-center gap-10 mb-7">
              {STATS.map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl font-black grad-text mb-0.5">{num}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-[0.12em]">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-7">
              {ACHVS.map(({ icon: Icon, label }) => (
                <motion.span
                  key={label}
                  whileHover={{ scale: 1.06 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-400/[0.2] bg-indigo-400/[0.07]"
                >
                  <Icon className="text-[11px]" /> {label}
                </motion.span>
              ))}
            </div>

            <motion.a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-slate-200 border border-white/[0.09] bg-white/[0.03] backdrop-blur-sm hover:border-indigo-400/35 hover:bg-indigo-500/[0.08] transition-all duration-200"
            >
              <SiGithub /> View Profile
            </motion.a>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  )
}
