import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaBuilding, FaGraduationCap, FaMapPin, FaRobot, FaCode, FaSitemap, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { FaBrain } from 'react-icons/fa6'
import { FadeUp, StaggerContainer, StaggerItem, SectionHeader, SystemLabel } from './ui'
import FactPlanet from './FactPlanet'
import { LINKS } from '../data'

const ease = [0.21, 0.47, 0.32, 0.98]

/* Animated count-up number */
function AnimCounter({ to, suffix = '' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-40px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) { setCount(0); return }
    const num = parseInt(to)
    if (isNaN(num)) return
    let current = 0
    const step  = Math.max(1, Math.ceil(num / 22))
    const timer = setInterval(() => {
      current = Math.min(current + step, num)
      setCount(current)
      if (current >= num) clearInterval(timer)
    }, 45)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{count}{suffix}</span>
}

const TAGS = [
  { icon: FaRobot,        label: 'Agentic AI'       },
  { icon: FaBuilding,     label: 'AWS Certified'    },
  { icon: FaBrain,        label: 'Machine Learning' },
  { icon: FaCode,         label: 'Flutter & Dart'   },
  { icon: SiGithub,       label: 'Open Source'      },
  { icon: FaSitemap,      label: 'System Design'    },
]

/* Bio paragraph that slides in from the right with blur-focus */
function SlidePara({ children, delay = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-40px' })
  return (
    <motion.p
      ref={ref}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 26 }}
      transition={{ duration: 0.72, delay: inView ? delay : 0, ease }}
      className="text-dim text-[0.9rem] leading-[1.85]"
    >
      {children}
    </motion.p>
  )
}

export default function About() {
  return (
    <section id="about" className="relative py-24 bg-void">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 58% 55% at 88% 46%, rgba(255,45,170,0.065) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        <SectionHeader tag="// about.me" title="Who I" highlight="Am" />

        <div className="grid md:grid-cols-[360px_1fr] gap-12 items-start">

          {/* ── STICKY LEFT — Profile Card ── */}
          <div className="md:sticky md:top-24">
            <FadeUp>
              <motion.div
                whileHover={{ y: -6, borderColor: 'rgba(255,45,170,0.38)', boxShadow: '0 20px 54px rgba(255,45,170,0.14)' }}
                transition={{ duration: 0.3 }}
                className="card overflow-hidden relative group"
              >
                {/* Card Top — Monogram */}
                <div
                  className="px-7 pt-8 pb-6 border-b border-line flex flex-col items-center relative"
                  style={{ background: 'linear-gradient(160deg, rgba(255,45,170,0.10), rgba(192,132,252,0.045))' }}
                >
                  <div className="absolute inset-0 circuit-grid opacity-70 pointer-events-none" />

                  <div className="relative w-20 h-20 mb-4">
                    <div
                      className="absolute inset-0 rounded-full animate-spin-slow opacity-55"
                      style={{ background: 'conic-gradient(from 0deg, #FF2DAA, #D946EF, #C084FC, #FF2DAA)' }}
                    />
                    <div className="absolute inset-[2px] rounded-full bg-surface flex items-center justify-center">
                      <span className="font-display font-bold text-2xl tracking-[-0.04em] grad-text-static">IH</span>
                    </div>
                  </div>

                  <div className="font-display font-bold text-lg tracking-tight text-ink mb-0.5 relative">Insiya Husain</div>
                  <div className="text-dim text-xs mb-3 text-center relative">Software Engineer · AI, Backend &amp; Cloud</div>

                  <SystemLabel pulse className="relative">open to opportunities</SystemLabel>
                </div>

                {/* Info rows */}
                <div className="px-5 py-4 flex flex-col gap-0.5">
                  {[
                    { icon: FaBuilding,      text: 'Consultadd Inc.  ·  Jan 2025 – Present' },
                    { icon: FaGraduationCap, text: 'IET DAVV  ·  B.E.  ·  8.8 GPA'          },
                    { icon: FaMapPin,        text: 'Indore, India'                          },
                    { icon: SiGithub,        text: 'github.com/Insiyaya'                    },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 py-2.5 border-b border-line last:border-0 text-xs text-dim"
                    >
                      <Icon className="text-hotpink text-[13px] flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Animated stats strip */}
                <div className="grid grid-cols-3 border-t border-line">
                  {[
                    { to: '3',  suffix: '',  label: 'Internships' },
                    { to: '40', suffix: '+', label: 'Repos'       },
                    { to: '2',  suffix: '',  label: 'Certs'       },
                  ].map(({ to, suffix, label }, i) => (
                    <div
                      key={label}
                      className={`py-4 text-center ${i < 2 ? 'border-r border-line' : ''} hover:bg-surface2 transition-colors`}
                    >
                      <div className="font-display text-xl font-bold grad-text-static">
                        <AnimCounter to={to} suffix={suffix} />
                      </div>
                      <div className="text-[10px] text-faint uppercase tracking-widest mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>
          </div>

          {/* ── SCROLLING RIGHT — Bio ── */}
          <div className="py-2">
            <FadeUp>
              <h3 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink mb-7 text-balance">
                I Don&rsquo;t Just Write Code. <span className="grad-text-static italic">I Connect the Dots.</span>
              </h3>
            </FadeUp>

            <div className="space-y-5 mb-8">
              <SlidePara delay={0.05}>
                Most engineers solve the problem in front of them. I look for the pattern behind it. As a Software Engineer at <span className="text-ink font-medium">Consultadd Inc.</span> and a 2025 graduate from <span className="text-ink font-medium">IET DAVV</span> (8.8 GPA), I spend my days architecting <span className="text-ink font-medium">microservices</span> that power production AI agents, designing real-time DynamoDB pipelines, and building the prompt engineering layer that turns raw LLM outputs into coherent, multi-turn conversations. Across three internships, I&rsquo;ve shipped integrations, squashed production-blocking bugs, and introduced improvements that drove <span className="text-ink font-medium">30-50% growth</span> in client engagement. Not by working harder, but by connecting ideas across disciplines that others tend to keep separate.
              </SlidePara>
              <SlidePara delay={0.18}>
                Outside backend, frontend and AI, I have a deep love for <span className="text-ink font-medium">Flutter</span>. There&rsquo;s a particular thrill in crafting pixel-perfect, detail-obsessed interfaces that ship natively to every platform from a single codebase. <span className="text-ink font-medium">Roboshots</span>, my cross-platform blog app on AI and robotics, is the project closest to my heart. A space where readers can discover, bookmark, and contribute articles in one seamless experience. Currently, I&rsquo;m going deep into <span className="text-ink font-medium">Machine Learning</span> to layer it on top of my existing stack, because the systems I want to build next won&rsquo;t just respond. They&rsquo;ll learn and adapt.
              </SlidePara>
              <SlidePara delay={0.31}>
                I run on a <span className="text-ink font-medium">growth-first mentality</span>. Every week I&rsquo;m either picking up a new framework, diving into a research paper, or contributing to open-source projects where I&rsquo;ve been recognized as a <span className="text-ink font-medium">top reviewer and collaborator</span> by the community. I treat self-development like compound interest. Small, consistent investments that stack up over time. If you need someone who ships with urgency, thinks in systems, and never stops being curious, I&rsquo;d love to connect.
              </SlidePara>
            </div>

            {/* Tags */}
            <StaggerContainer className="flex flex-wrap gap-2 mb-10">
              {TAGS.map(({ icon: Icon, label }) => (
                <StaggerItem key={label}>
                  <motion.span
                    whileHover={{ scale: 1.05, borderColor: 'rgba(255,45,170,0.48)', color: '#FFF7FC' }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-softpink
                               border border-hotpink/[0.20] bg-hotpink/[0.06] cursor-default"
                  >
                    <Icon className="text-[11px]" />
                    {label}
                  </motion.span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA Buttons */}
            <FadeUp delay={0.15}>
              <div className="pt-8 border-t border-line flex items-center gap-3 flex-wrap">
                <motion.a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                >
                  <SiGithub className="text-base" />
                  View GitHub
                  <FaArrowUpRightFromSquare className="text-[10px] opacity-70" />
                </motion.a>

                <motion.a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-ghost"
                >
                  <SiLinkedin className="text-base" />
                  LinkedIn
                </motion.a>
              </div>
            </FadeUp>
          </div>

        </div>

        {/* Rotating world of recruiter-facing highlights */}
        <FadeUp>
          <FactPlanet />
        </FadeUp>
      </div>
    </section>
  )
}
