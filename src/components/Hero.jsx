import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaEnvelope, FaArrowRight, FaChevronDown } from 'react-icons/fa6'
import { CornerFrame } from './ui'
import { HeroCosmos } from './SpaceScene'
import { LINKS } from '../data'

const EASE = [0.21, 0.47, 0.32, 0.98]

const ROLES = [
  'AI Agent Builder',
  'Backend Engineer',
  'Flutter Developer',
  'Cloud Architect',
  'Freelancer',
]

function useTypewriter(words, typeSpeed = 60, deleteSpeed = 30, pauseMs = 2200) {
  const [idx, setIdx]   = useState(0)
  const [text, setText] = useState('')
  const [del,  setDel]  = useState(false)

  useEffect(() => {
    const word = words[idx]
    const delay = del ? deleteSpeed : typeSpeed
    const t = setTimeout(() => {
      if (!del) {
        if (text.length < word.length) setText(word.slice(0, text.length + 1))
        else setTimeout(() => setDel(true), pauseMs)
      } else {
        if (text.length > 0) setText(text.slice(0, -1))
        else { setDel(false); setIdx(i => (i + 1) % words.length) }
      }
    }, delay)
    return () => clearTimeout(t)
  }, [text, del, idx, words, typeSpeed, deleteSpeed, pauseMs])

  return text
}

const FLOATS = [
  { label: 'Python',  x: '11%', y: '24%', delay: 0,   floatDur: 3.1 },
  { label: 'FastAPI', x: '83%', y: '20%', delay: 0.6, floatDur: 4.0 },
  { label: 'LangChain', x: '87%', y: '68%', delay: 1.2, floatDur: 3.7 },
  { label: 'AWS',     x: '7%',  y: '70%', delay: 0.9, floatDur: 2.9 },
  { label: 'Docker',  x: '56%', y: '88%', delay: 0.3, floatDur: 3.5 },
  { label: 'React',   x: '41%', y: '13%', delay: 1.5, floatDur: 4.2 },
]

/* ── Code syntax palette — the theme, applied to code ── */
const SYN = {
  kw:   '#FF4FC3',  // keywords
  mod:  '#C084FC',  // modules / types
  fn:   '#F9A8D4',  // functions
  str:  '#67E8F9',  // strings (technical detail → cyan earns its place here)
  var:  '#E4D3E9',  // identifiers
  punc: '#8F7A96',  // punctuation
}

const CODE = [
  [{ c: SYN.kw, t: 'from ' }, { c: SYN.mod, t: 'fastapi' }, { c: SYN.kw, t: ' import ' }, { c: SYN.fn, t: 'FastAPI' }, { c: SYN.punc, t: ', ' }, { c: SYN.fn, t: 'Depends' }],
  [{ c: SYN.kw, t: 'from ' }, { c: SYN.mod, t: 'langchain_anthropic' }, { c: SYN.kw, t: ' import ' }, { c: SYN.fn, t: 'ChatAnthropic' }],
  [{ c: SYN.kw, t: 'from ' }, { c: SYN.mod, t: 'langchain.agents' }, { c: SYN.kw, t: ' import ' }, { c: SYN.fn, t: 'AgentExecutor' }],
  [],
  [{ c: SYN.var, t: 'app' }, { c: SYN.punc, t: ' = ' }, { c: SYN.fn, t: 'FastAPI' }, { c: SYN.punc, t: '(' }, { c: SYN.var, t: 'title' }, { c: SYN.punc, t: '=' }, { c: SYN.str, t: '"vendor-api"' }, { c: SYN.punc, t: ')' }],
  [{ c: SYN.var, t: 'llm' }, { c: SYN.punc, t: ' = ' }, { c: SYN.fn, t: 'ChatAnthropic' }, { c: SYN.punc, t: '(' }, { c: SYN.var, t: 'model' }, { c: SYN.punc, t: '=' }, { c: SYN.str, t: '"claude-sonnet-4"' }, { c: SYN.punc, t: ')' }],
  [],
  [{ c: SYN.mod, t: '@app' }, { c: SYN.punc, t: '.' }, { c: SYN.fn, t: 'post' }, { c: SYN.punc, t: '(' }, { c: SYN.str, t: '"/v1/agent/invoke"' }, { c: SYN.punc, t: ')' }],
  [{ c: SYN.kw, t: 'async def ' }, { c: SYN.fn, t: 'invoke' }, { c: SYN.punc, t: '(' }, { c: SYN.var, t: 'req' }, { c: SYN.punc, t: ': ' }, { c: SYN.mod, t: 'AgentRequest' }, { c: SYN.punc, t: '):' }],
  [{ c: SYN.punc, t: '    ' }, { c: SYN.var, t: 'executor' }, { c: SYN.punc, t: ' = ' }, { c: SYN.fn, t: 'AgentExecutor' }, { c: SYN.punc, t: '(' }, { c: SYN.var, t: 'agent' }, { c: SYN.punc, t: '=' }, { c: SYN.var, t: 'llm' }, { c: SYN.punc, t: ', ' }, { c: SYN.var, t: 'tools' }, { c: SYN.punc, t: '=' }, { c: SYN.var, t: 'tools' }, { c: SYN.punc, t: ')' }],
  [{ c: SYN.punc, t: '    ' }, { c: SYN.var, t: 'result' }, { c: SYN.punc, t: ' = ' }, { c: SYN.kw, t: 'await ' }, { c: SYN.var, t: 'executor' }, { c: SYN.punc, t: '.' }, { c: SYN.fn, t: 'ainvoke' }, { c: SYN.punc, t: '(' }, { c: SYN.var, t: 'req' }, { c: SYN.punc, t: '.' }, { c: SYN.var, t: 'payload' }, { c: SYN.punc, t: ')' }],
  [{ c: SYN.punc, t: '    ' }, { c: SYN.kw, t: 'return ' }, { c: SYN.punc, t: '{' }, { c: SYN.str, t: '"status"' }, { c: SYN.punc, t: ': ' }, { c: SYN.str, t: '"ok"' }, { c: SYN.punc, t: ', ' }, { c: SYN.str, t: '"data"' }, { c: SYN.punc, t: ': ' }, { c: SYN.var, t: 'result' }, { c: SYN.punc, t: '}' }],
]

function CodeTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 0.62, x: 0 }}
      transition={{ duration: 1.4, delay: 1.8, ease: EASE }}
      className="hidden lg:block absolute right-[3%] top-[15%] w-[292px] z-[2] pointer-events-none select-none"
    >
      {/* HUD framing brackets sit just outside the terminal */}
      <div className="absolute -inset-2.5">
        <CornerFrame color="rgba(255,45,170,0.26)" />
      </div>

      <div className="relative rounded-xl border border-line bg-surface/90 backdrop-blur-xl shadow-[0_24px_80px_rgba(13,8,18,0.75)] overflow-hidden">
        {/* Window chrome — pink/magenta/lavender instead of traffic lights */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-surface2/60">
          <span className="w-2 h-2 rounded-full bg-hotpink/70" />
          <span className="w-2 h-2 rounded-full bg-magenta/60" />
          <span className="w-2 h-2 rounded-full bg-lavender/50" />
          <span className="ml-2 text-[9px] font-mono text-faint">routes/agent.py</span>
        </div>

        <div className="p-3 font-mono text-[10px] leading-[1.75]">
          {CODE.map((tokens, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 2.2 + i * 0.14 }}
              className="flex"
            >
              <span className="text-faint/55 w-5 text-right mr-3 select-none text-[9px]">{i + 1}</span>
              <span>
                {tokens.map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                ))}
              </span>
            </motion.div>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2 }}
            className="text-hotpink/70 animate-blink ml-6 text-xs"
          >
            ▊
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Magnetic button ── */
function MagneticBtn({ href, children, className, style, target, rel }) {
  const ref  = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    setPos({
      x: (e.clientX - r.left - r.width  / 2) * 0.24,
      y: (e.clientY - r.top  - r.height / 2) * 0.24,
    })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
      style={style}
    >
      {children}
    </motion.a>
  )
}

/* ── Corner technical labels — micro-details that read as "custom built" ── */
function EdgeLabels() {
  return (
    <div className="hidden md:block absolute inset-0 z-[2] pointer-events-none select-none">
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute top-28 left-6 font-mono text-[9.5px] tracking-[0.22em] uppercase text-faint/70"
      >
        // hero.init
      </motion.span>

      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.75 }}
        className="absolute bottom-28 left-6 font-mono text-[9.5px] tracking-[0.22em] uppercase text-faint/70"
      >
        indore · in
      </motion.span>

      {/* Orbital-coordinates readout, bottom right — technical margin note */}
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="absolute bottom-28 right-6 font-mono text-[9.5px] tracking-[0.22em] uppercase text-faint/70"
      >
        orbit · stable
      </motion.span>
    </div>
  )
}

/* ── Hero ── */
export default function Hero() {
  const typed   = useTypewriter(ROLES)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset: ['start start', 'end start'],
  })
  const contentY       = useTransform(scrollYProgress, [0, 1], ['0%', '-32%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const blobY          = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const floatOpacity   = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void"
    >
      {/* Fine circuit grid */}
      <div className="absolute inset-0 circuit-grid" />
      {/* Barely-visible scanline texture */}
      <div className="absolute inset-0 scanlines opacity-60" />

      {/* Atmospheric glow. Rendered as static radial gradients on one layer:
          the previous version animated transforms on three 500px-wide elements
          carrying 110-130px blur filters, which the compositor had to
          re-rasterise continuously and competed with scrolling. The planets and
          starfield already supply the motion here. */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: blobY,
          background: `
            radial-gradient(38% 34% at 26% 32%, rgba(255,45,170,0.15) 0%, transparent 70%),
            radial-gradient(32% 30% at 80% 38%, rgba(217,70,239,0.12) 0%, transparent 72%),
            radial-gradient(30% 28% at 52% 86%, rgba(192,132,252,0.10) 0%, transparent 74%)
          `,
        }}
      />

      {/* Planetary scene — starfield, worlds, orbiting moon, planet horizon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: EASE }}
        className="absolute inset-0"
      >
        <HeroCosmos />
      </motion.div>

      <EdgeLabels />

      {/* Floating tech labels */}
      <motion.div className="hidden sm:block absolute inset-0 pointer-events-none" style={{ opacity: floatOpacity }}>
        {FLOATS.map(f => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.5, scale: 1, y: [0, -7, 0] }}
            transition={{
              opacity: { duration: 1, delay: f.delay + 1.2 },
              scale:   { duration: 1, delay: f.delay + 1.2 },
              y: { duration: f.floatDur, repeat: Infinity, ease: 'easeInOut', delay: f.delay + 1.5 },
            }}
            style={{ position: 'absolute', left: f.x, top: f.y }}
            className="font-mono text-[10px] text-dim px-2 py-1 rounded-md border border-line bg-surface/70 backdrop-blur-sm select-none"
          >
            {f.label}
          </motion.div>
        ))}
      </motion.div>

      <CodeTerminal />

      {/* ── Main content — parallax ── */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-4xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* System status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 rounded-full font-mono text-[10.5px] tracking-[0.16em] uppercase text-cyber border border-cyber/20 bg-cyber/[0.05]"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyber animate-ping opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyber" />
          </span>
          system online · open to work &amp; freelance
        </motion.div>

        {/* Name — the loudest thing on the page */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
          className="font-display font-bold tracking-[-0.05em] leading-[1.02] mb-4"
          style={{ fontSize: 'clamp(3rem, 8.5vw, 6.8rem)' }}
        >
          <span className="grad-text">Insiya Husain</span>
        </motion.h1>

        {/* Role statement — the message that has to land instantly */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
          className="font-display font-semibold tracking-[-0.02em] text-ink mb-4"
          style={{ fontSize: 'clamp(1.15rem, 3.4vw, 1.9rem)' }}
        >
          Full Stack Engineer
          <span className="text-hotpink/50 font-light mx-2.5 md:mx-3.5">×</span>
          <span className="grad-text-static italic">AI Engineer</span>
        </motion.h2>

        {/* Rotating specialisation — terminal voice */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="font-mono text-[0.78rem] md:text-[0.85rem] text-faint mb-7 tracking-tight"
        >
          <span className="text-hotpink/70 mr-1.5">&gt;</span>
          specializing in{' '}
          <span className="text-softpink">
            {typed}
            <span className="text-hotpink animate-blink font-thin">_</span>
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="text-dim text-[0.9rem] max-w-[566px] mx-auto mb-10 leading-[1.8] text-pretty"
        >
          I ship production-grade systems that solve real problems, from{' '}
          <span className="text-ink font-medium">AI-powered agents</span> and{' '}
          <span className="text-ink font-medium">high-throughput APIs</span> to{' '}
          <span className="text-ink font-medium">cloud-native infrastructure</span> on AWS.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
          className="flex gap-3 justify-center flex-wrap mb-9"
        >
          <MagneticBtn href="#contact" className="btn-primary">
            <FaEnvelope className="text-xs" /> Get In Touch
          </MagneticBtn>

          <MagneticBtn href="#projects" className="btn-ghost">
            <FaArrowRight className="text-xs" /> View Work
          </MagneticBtn>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex gap-2.5 justify-center mb-10"
        >
          {[
            { Icon: SiGithub,   href: LINKS.github,   label: 'GitHub' },
            { Icon: SiLinkedin, href: LINKS.linkedin, label: 'LinkedIn' },
            { Icon: FaEnvelope, href: LINKS.email,    label: 'Email' },
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-dim border border-line bg-surface/70
                         hover:text-ink hover:border-hotpink/45 hover:bg-hotpink/[0.10]
                         hover:shadow-[0_6px_20px_rgba(255,45,170,0.18)] transition-colors duration-200"
              title={label}
            >
              <Icon className="text-[1.05rem]" />
            </motion.a>
          ))}
        </motion.div>

        {/* AI pipeline micro-diagram — a technical signature, not a gimmick */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="hidden sm:flex items-center justify-center gap-2.5 font-mono text-[9.5px] tracking-[0.18em] uppercase text-faint/80 select-none"
        >
          {['model', 'tools', 'response'].map((node, i) => (
            <span key={node} className="flex items-center gap-2.5">
              {i > 0 && (
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-6 h-px bg-gradient-to-r from-hotpink/40 to-lavender/30" />
                  <span className="text-hotpink/50">→</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-hotpink' : i === 1 ? 'bg-magenta' : 'bg-lavender'}`} />
                {node}
              </span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-faint/70 text-[9.5px] tracking-[0.22em] uppercase select-none font-mono"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5"
        >
          <span>Scroll</span>
          <FaChevronDown className="text-[10px]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
