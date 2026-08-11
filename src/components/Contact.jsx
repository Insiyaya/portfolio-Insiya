import { motion } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaEnvelope, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { SectionHeader, FadeUp, SpotlightCard, StaggerContainer, StaggerItem, GLOW } from './ui'
import { SectionCosmos } from './SpaceScene'
import { LINKS } from '../data'

const SERVICES = [
  { title: 'AI Agent Development',    desc: 'End-to-end agentic AI systems, LLM orchestration, prompt engineering, and tool-use workflows', ai: true },
  { title: 'Backend Engineering',     desc: 'High-throughput APIs and microservices with FastAPI, Django, and event-driven architectures' },
  { title: 'Mobile & Cross-Platform', desc: 'Production Flutter apps shipping to Android, iOS, Web, and Desktop from a single codebase' },
  { title: 'Cloud & Infrastructure',  desc: 'AWS-native deployments with DynamoDB, Lambda, Docker, Terraform, and CI/CD automation' },
]

const CARDS = [
  {
    icon:      SiGithub,
    label:     'GitHub',
    sub:       '@Insiyaya',
    href:      LINKS.github,
    accent:    '#FF2DAA',
    glowColor: GLOW.pink,
  },
  {
    icon:      SiLinkedin,
    label:     'LinkedIn',
    sub:       'insiya-husain',
    href:      LINKS.linkedin,
    accent:    '#D946EF',
    glowColor: GLOW.magenta,
  },
  {
    icon:      FaEnvelope,
    label:     'Email',
    sub:       'insiyaahusainn@gmail.com',
    href:      LINKS.email,
    accent:    '#C084FC',
    glowColor: GLOW.lavender,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 overflow-hidden bg-void">
      {/* Strongest section glow on the page — this is the closing note */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 38%, rgba(255,45,170,0.09) 0%, transparent 62%)' }}
      />
      <div className="absolute inset-0 circuit-grid opacity-60 pointer-events-none" />
      {/* Closing section gets the deepest-space treatment */}
      <SectionCosmos
        planet="magenta"
        size={170}
        position={{ right: '-72px', bottom: '10%' }}
        orbit
        starOpacity={0.4}
      />

      <div className="relative max-w-3xl mx-auto px-5 text-center">
        <SectionHeader
          tag="// contact.reach_out"
          title="Let's"
          highlight="Connect"
          sub="Have a project in mind or a role to discuss? I'd love to hear about it."
        />

        {/* Services grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 text-left">
          {SERVICES.map(({ title, desc, ai }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -3, borderColor: 'rgba(255,45,170,0.36)', boxShadow: '0 12px 32px rgba(255,45,170,0.11)' }}
                transition={{ duration: 0.22 }}
                className="h-full p-4 rounded-xl border border-line bg-surface transition-colors duration-300"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-1 h-1 rounded-full flex-shrink-0 ${ai ? 'bg-cyber' : 'bg-hotpink'}`} />
                  <div className="font-display font-bold text-sm text-ink">{title}</div>
                </div>
                <div className="text-[0.78rem] text-dim leading-relaxed">{desc}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.05}>
          <p className="text-faint text-[11px] font-mono uppercase tracking-[0.2em] mb-8">
            Available for full-time roles &amp; freelance projects
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CARDS.map(({ icon: Icon, label, sub, href, accent, glowColor }) => (
              <SpotlightCard key={label} glowColor={glowColor} className="rounded-2xl">
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -8,
                    borderColor: `${accent}88`,
                    boxShadow: `0 20px 50px ${accent}26`,
                  }}
                  transition={{ duration: 0.25 }}
                  className="relative flex flex-col items-center py-8 px-4 card z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.16, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                    className="mb-4"
                  >
                    <Icon className="text-2xl" style={{ color: accent }} />
                  </motion.div>

                  <span className="font-display font-semibold text-sm text-ink mb-0.5">{label}</span>
                  <span className="font-mono text-[10px] text-faint break-all">{sub}</span>

                  <motion.div
                    className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full opacity-0"
                    whileHover={{ opacity: 1 }}
                    style={{ background: `linear-gradient(to right, transparent, ${accent}aa, transparent)` }}
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
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary mt-10 px-7 py-3"
          >
            <FaEnvelope className="text-xs" />
            Get In Touch
            <FaArrowUpRightFromSquare className="text-[10px] opacity-70" />
          </motion.a>
        </FadeUp>

        {/* Availability badge */}
        <FadeUp delay={0.25}>
          <div className="mt-8 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-cyber/[0.20] bg-cyber/[0.05]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber" />
            </span>
            <span className="font-mono text-[11px] text-cyber tracking-[0.12em] uppercase">
              currently available for new projects
            </span>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
