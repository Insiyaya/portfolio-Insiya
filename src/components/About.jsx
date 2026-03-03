import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaBuilding, FaGraduationCap, FaMapPin, FaRobot, FaCode, FaSitemap, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { FaBrain } from 'react-icons/fa6'
import { FadeUp, StaggerContainer, StaggerItem, SectionHeader } from './ui'
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
  { icon: FaRobot,       label: 'Agentic AI'     },
  { icon: FaBuilding,    label: 'AWS Certified'   },
  { icon: FaBrain,       label: 'Machine Learning' },
  { icon: FaCode,        label: 'Flutter & Dart'  },
  { icon: SiGithub,      label: 'Open Source'     },
  { icon: FaSitemap,     label: 'System Design'   },
]

/* Bio paragraph that slides in from the right with blur-focus */
function SlidePara({ children, delay = 0 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { margin: '-40px' })
  return (
    <motion.p
      ref={ref}
      animate={inView
        ? { opacity: 1, x: 0, filter: 'blur(0px)' }
        : { opacity: 0, x: 28, filter: 'blur(4px)' }}
      transition={{ duration: 0.72, delay: inView ? delay : 0, ease }}
      className="text-slate-400 text-[0.9rem] leading-[1.85]"
    >
      {children}
    </motion.p>
  )
}

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24"
      style={{ background: 'radial-gradient(ellipse 60% 60% at 85% 50%, rgba(129,140,248,0.06) 0%, transparent 60%), #060d1f' }}
    >
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader tag="// about.me" title="Who I" highlight="Am" />

        <div className="grid md:grid-cols-[360px_1fr] gap-12 items-start">

          {/* ── STICKY LEFT — Profile Card ── */}
          <div className="md:sticky md:top-24">
            <FadeUp>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#060d1f] relative group"
              >
                {/* Gradient border glow */}
                <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"
                  style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.4), rgba(167,139,250,0.3), rgba(56,189,248,0.3))' }}
                />

                {/* Card Top — Monogram */}
                <div className="px-7 pt-8 pb-6 border-b border-white/[0.05] flex flex-col items-center"
                  style={{ background: 'linear-gradient(160deg, rgba(129,140,248,0.09), rgba(56,189,248,0.04))' }}
                >
                  <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 rounded-full animate-spin-slow opacity-40"
                      style={{ background: 'conic-gradient(from 0deg, #818cf8, #a78bfa, #38bdf8, #818cf8)' }}
                    />
                    <div className="absolute inset-[2px] rounded-full bg-[#0a1228] flex items-center justify-center">
                      <span className="font-display font-black text-2xl tracking-[-0.04em] grad-text">IH</span>
                    </div>
                  </div>

                  <div className="font-display font-bold text-lg tracking-tight mb-0.5">Insiya Husain</div>
                  <div className="text-slate-400 text-xs mb-3 text-center">Software Engineer · AI, Backend &amp; Cloud</div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-wider text-emerald-400 border border-emerald-400/[0.2] bg-emerald-400/[0.06]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open to Opportunities
                  </span>
                </div>

                {/* Info rows */}
                <div className="px-5 py-4 flex flex-col gap-0.5">
                  {[
                    { icon: FaBuilding,      text: 'Consultadd Inc.  ·  Jan 2025 – Present' },
                    { icon: FaGraduationCap, text: 'IET DAVV  ·  B.E.  ·  8.8 GPA'         },
                    { icon: FaMapPin,        text: 'Indore, India'                           },
                    { icon: SiGithub,        text: 'github.com/Insiyaya'                    },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 text-xs text-slate-400">
                      <Icon className="text-indigo-400 text-[13px] flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Animated stats strip */}
                <div className="grid grid-cols-3 border-t border-white/[0.05]">
                  {[
                    { to: '3', suffix: '',  label: 'Internships' },
                    { to: '40', suffix: '+', label: 'Repos'  },
                    { to: '2',  suffix: '',  label: 'Certs'  },
                  ].map(({ to, suffix, label }, i) => (
                    <div key={label} className={`py-4 text-center ${i < 2 ? 'border-r border-white/[0.05]' : ''} hover:bg-white/[0.03] transition-colors`}>
                      <div className="font-display text-xl font-bold grad-text">
                        <AnimCounter to={to} suffix={suffix} />
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>
          </div>

          {/* ── SCROLLING RIGHT — Bio ── */}
          <div className="py-2">
            <FadeUp>
              <h3 className="font-display text-3xl font-black tracking-tight mb-7">
                I Don&rsquo;t Just Write Code. I Connect the Dots.
              </h3>
            </FadeUp>

            <div className="space-y-5 mb-8">
              <SlidePara delay={0.05}>
                Most engineers solve the problem in front of them. I look for the pattern behind it. As a Software Engineer at <span className="text-slate-200 font-medium">Consultadd Inc.</span> and a 2025 graduate from <span className="text-slate-200 font-medium">IET DAVV</span> (8.8 GPA), I spend my days architecting <span className="text-slate-200 font-medium">microservices</span> that power production AI agents, designing real-time DynamoDB pipelines, and building the prompt engineering layer that turns raw LLM outputs into coherent, multi-turn conversations. Across three internships, I&rsquo;ve shipped integrations, squashed production-blocking bugs, and introduced improvements that drove <span className="text-slate-200 font-medium">30-50% growth</span> in client engagement. Not by working harder, but by connecting ideas across disciplines that others tend to keep separate.
              </SlidePara>
              <SlidePara delay={0.18}>
                Outside backend, frontend and AI, I have a deep love for <span className="text-slate-200 font-medium">Flutter</span>. There&rsquo;s a particular thrill in crafting pixel-perfect, detail-obsessed interfaces that ship natively to every platform from a single codebase. <span className="text-slate-200 font-medium">Roboshots</span>, my cross-platform blog app on AI and robotics, is the project closest to my heart. A space where readers can discover, bookmark, and contribute articles in one seamless experience. Currently, I&rsquo;m going deep into <span className="text-slate-200 font-medium">Machine Learning</span> to layer it on top of my existing stack, because the systems I want to build next won&rsquo;t just respond. They&rsquo;ll learn and adapt.
              </SlidePara>
              <SlidePara delay={0.31}>
                I run on a <span className="text-slate-200 font-medium">growth-first mentality</span>. Every week I&rsquo;m either picking up a new framework, diving into a research paper, or contributing to open-source projects where I&rsquo;ve been recognized as a <span className="text-slate-200 font-medium">top reviewer and collaborator</span> by the community. I treat self-development like compound interest. Small, consistent investments that stack up over time. If you need someone who ships with urgency, thinks in systems, and never stops being curious, I&rsquo;d love to connect.
              </SlidePara>
            </div>

            {/* Tags */}
            <StaggerContainer className="flex flex-wrap gap-2 mb-10">
              {TAGS.map(({ icon: Icon, label }) => (
                <StaggerItem key={label}>
                  <motion.span
                    whileHover={{ scale: 1.06, borderColor: 'rgba(129,140,248,0.4)' }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300 border border-indigo-400/[0.18] bg-indigo-400/[0.07] cursor-default"
                  >
                    <Icon className="text-[11px]" />
                    {label}
                  </motion.span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA Buttons — clearly separated with top border */}
            <FadeUp delay={0.15}>
              <div className="pt-8 border-t border-white/[0.06] flex items-center gap-3 flex-wrap">
                <motion.a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(129,140,248,0.22)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-white border border-indigo-400/[0.25] bg-indigo-500/[0.12] hover:border-indigo-400/50 hover:bg-indigo-500/[0.2] transition-all duration-200"
                >
                  <SiGithub className="text-base" />
                  View GitHub
                  <FaArrowUpRightFromSquare className="text-[10px] opacity-60" />
                </motion.a>

                <motion.a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(10,102,194,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-200 border border-white/[0.08] bg-white/[0.03] hover:border-sky-400/30 hover:bg-sky-500/[0.08] transition-all duration-200"
                >
                  <SiLinkedin className="text-base text-[#0a66c2]" />
                  LinkedIn
                </motion.a>
              </div>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  )
}
