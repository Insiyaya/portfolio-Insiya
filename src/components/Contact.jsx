import { motion } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaEnvelope, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { SectionHeader, FadeUp, SpotlightCard, StaggerContainer, StaggerItem } from './ui'
import { LINKS } from '../data'

const SERVICES = [
  { title: 'AI Agent Development',  desc: 'End-to-end agentic AI systems, LLM orchestration, prompt engineering, and tool-use workflows' },
  { title: 'Backend Engineering',    desc: 'High-throughput APIs and microservices with FastAPI, Django, and event-driven architectures' },
  { title: 'Mobile & Cross-Platform', desc: 'Production Flutter apps shipping to Android, iOS, Web, and Desktop from a single codebase' },
  { title: 'Cloud & Infrastructure', desc: 'AWS-native deployments with DynamoDB, Lambda, Docker, Terraform, and CI/CD automation' },
]

const CARDS = [
  {
    icon:        SiGithub,
    label:       'GitHub',
    sub:         '@Insiyaya',
    href:        LINKS.github,
    hoverColor:  'rgba(129,140,248,0.15)',
    borderColor: 'rgba(129,140,248,0.35)',
    iconColor:   '#818cf8',
    glowColor:   'rgba(129,140,248,0.14)',
  },
  {
    icon:        SiLinkedin,
    label:       'LinkedIn',
    sub:         'insiya-husain',
    href:        LINKS.linkedin,
    hoverColor:  'rgba(10,102,194,0.12)',
    borderColor: 'rgba(10,102,194,0.4)',
    iconColor:   '#0a66c2',
    glowColor:   'rgba(10,102,194,0.12)',
  },
  {
    icon:        FaEnvelope,
    label:       'Email',
    sub:         'insiyaahusainn@gmail.com',
    href:        LINKS.email,
    hoverColor:  'rgba(56,189,248,0.12)',
    borderColor: 'rgba(56,189,248,0.35)',
    iconColor:   '#38bdf8',
    glowColor:   'rgba(56,189,248,0.12)',
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 40%, rgba(129,140,248,0.08) 0%, transparent 60%), #030712' }}
    >
      <div className="max-w-3xl mx-auto px-5 text-center">
        <SectionHeader
          tag="// contact.reach_out"
          title="Let's"
          highlight="Connect"
          sub="Have a project in mind or a role to discuss? I'd love to hear about it."
        />

        {/* Services grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 text-left">
          {SERVICES.map(({ title, desc }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -3, borderColor: 'rgba(129,140,248,0.25)', background: 'rgba(255,255,255,0.04)' }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="font-display font-bold text-sm text-slate-200 mb-1">{title}</div>
                <div className="text-[0.78rem] text-slate-500 leading-relaxed">{desc}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.05}>
          <p className="text-slate-600 text-xs font-mono uppercase tracking-[0.18em] mb-8">
            Available for full-time roles &amp; freelance projects
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CARDS.map(({ icon: Icon, label, sub, href, hoverColor, borderColor, iconColor, glowColor }) => (
              <SpotlightCard
                key={label}
                glowColor={glowColor}
                className="rounded-2xl"
              >
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -8,
                    borderColor,
                    boxShadow: `0 20px 50px ${hoverColor}`,
                    background: hoverColor,
                  }}
                  transition={{ duration: 0.25 }}
                  className="relative flex flex-col items-center py-8 px-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-colors duration-200 z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.18, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                    className="mb-4"
                  >
                    <Icon className="text-2xl" style={{ color: iconColor }} />
                  </motion.div>

                  <span className="font-display font-semibold text-sm text-white mb-0.5">{label}</span>
                  <span className="font-mono text-[10px] text-slate-500">{sub}</span>

                  <motion.div
                    className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full opacity-0"
                    whileHover={{ opacity: 1 }}
                    style={{ background: `linear-gradient(to right, transparent, ${iconColor}70, transparent)` }}
                  />
                </motion.a>
              </SpotlightCard>
            ))}
          </div>
        </FadeUp>

        {/* CTA button */}
        <FadeUp delay={0.18}>
          <motion.a
            href={LINKS.email}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, boxShadow: '0 14px 40px rgba(129,140,248,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-semibold text-sm text-white shadow-[0_4px_20px_rgba(129,140,248,0.25)] transition-shadow duration-300"
            style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)' }}
          >
            <FaEnvelope className="text-xs" />
            Get In Touch
            <FaArrowUpRightFromSquare className="text-[10px] opacity-60" />
          </motion.a>
        </FadeUp>

        {/* Pulsing availability badge */}
        <FadeUp delay={0.25}>
          <div className="mt-8 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-400/[0.18] bg-emerald-400/[0.05]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-emerald-400 tracking-wider">
              Currently available for new projects
            </span>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
