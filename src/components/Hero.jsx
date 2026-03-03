import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaEnvelope, FaArrowRight, FaChevronDown } from 'react-icons/fa6'
import { LINKS } from '../data'

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
  { label: 'Python',  x: '12%', y: '22%', delay: 0,   floatDur: 3.1 },
  { label: 'FastAPI', x: '82%', y: '18%', delay: 0.6, floatDur: 4.0 },
  { label: 'Flutter', x: '88%', y: '70%', delay: 1.2, floatDur: 3.7 },
  { label: 'AWS',     x: '8%',  y: '72%', delay: 0.9, floatDur: 2.9 },
  { label: 'Docker',  x: '55%', y: '88%', delay: 0.3, floatDur: 3.5 },
  { label: 'React',   x: '42%', y: '12%', delay: 1.5, floatDur: 4.2 },
]

/* ── Syntax-highlighted code terminal ── */
const CODE = [
  [{ c: '#c678dd', t: 'from ' }, { c: '#e5c07b', t: 'fastapi' }, { c: '#c678dd', t: ' import ' }, { c: '#61afef', t: 'FastAPI' }, { c: '#abb2bf', t: ', ' }, { c: '#61afef', t: 'Depends' }],
  [{ c: '#c678dd', t: 'from ' }, { c: '#e5c07b', t: 'langchain_anthropic' }, { c: '#c678dd', t: ' import ' }, { c: '#61afef', t: 'ChatAnthropic' }],
  [{ c: '#c678dd', t: 'from ' }, { c: '#e5c07b', t: 'langchain.agents' }, { c: '#c678dd', t: ' import ' }, { c: '#61afef', t: 'AgentExecutor' }],
  [],
  [{ c: '#e06c75', t: 'app' }, { c: '#abb2bf', t: ' = ' }, { c: '#61afef', t: 'FastAPI' }, { c: '#abb2bf', t: '(' }, { c: '#e06c75', t: 'title' }, { c: '#abb2bf', t: '=' }, { c: '#98c379', t: '"vendor-api"' }, { c: '#abb2bf', t: ')' }],
  [{ c: '#e06c75', t: 'llm' }, { c: '#abb2bf', t: ' = ' }, { c: '#61afef', t: 'ChatAnthropic' }, { c: '#abb2bf', t: '(' }, { c: '#e06c75', t: 'model' }, { c: '#abb2bf', t: '=' }, { c: '#98c379', t: '"claude-sonnet-4"' }, { c: '#abb2bf', t: ')' }],
  [],
  [{ c: '#e5c07b', t: '@app' }, { c: '#abb2bf', t: '.' }, { c: '#61afef', t: 'post' }, { c: '#abb2bf', t: '(' }, { c: '#98c379', t: '"/v1/agent/invoke"' }, { c: '#abb2bf', t: ')' }],
  [{ c: '#c678dd', t: 'async def ' }, { c: '#61afef', t: 'invoke' }, { c: '#abb2bf', t: '(' }, { c: '#e06c75', t: 'req' }, { c: '#abb2bf', t: ': ' }, { c: '#e5c07b', t: 'AgentRequest' }, { c: '#abb2bf', t: '):' }],
  [{ c: '#abb2bf', t: '    ' }, { c: '#e06c75', t: 'executor' }, { c: '#abb2bf', t: ' = ' }, { c: '#61afef', t: 'AgentExecutor' }, { c: '#abb2bf', t: '(' }, { c: '#e06c75', t: 'agent' }, { c: '#abb2bf', t: '=' }, { c: '#e06c75', t: 'llm' }, { c: '#abb2bf', t: ', ' }, { c: '#e06c75', t: 'tools' }, { c: '#abb2bf', t: '=' }, { c: '#e06c75', t: 'tools' }, { c: '#abb2bf', t: ')' }],
  [{ c: '#abb2bf', t: '    ' }, { c: '#e06c75', t: 'result' }, { c: '#abb2bf', t: ' = ' }, { c: '#c678dd', t: 'await ' }, { c: '#e06c75', t: 'executor' }, { c: '#abb2bf', t: '.' }, { c: '#61afef', t: 'ainvoke' }, { c: '#abb2bf', t: '(' }, { c: '#e06c75', t: 'req' }, { c: '#abb2bf', t: '.' }, { c: '#e06c75', t: 'payload' }, { c: '#abb2bf', t: ')' }],
  [{ c: '#abb2bf', t: '    ' }, { c: '#c678dd', t: 'return ' }, { c: '#abb2bf', t: '{' }, { c: '#98c379', t: '"status"' }, { c: '#abb2bf', t: ': ' }, { c: '#98c379', t: '"ok"' }, { c: '#abb2bf', t: ', ' }, { c: '#98c379', t: '"data"' }, { c: '#abb2bf', t: ': ' }, { c: '#e06c75', t: 'result' }, { c: '#abb2bf', t: '}' }],
]

function CodeTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
      animate={{ opacity: 0.6, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.4, delay: 1.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="hidden lg:block absolute right-[3%] top-[16%] w-[290px] z-[2] pointer-events-none select-none"
    >
      <div className="rounded-xl border border-white/[0.08] bg-[#0d1117]/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="w-2 h-2 rounded-full bg-red-400/60" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <span className="w-2 h-2 rounded-full bg-green-400/60" />
          <span className="ml-2 text-[9px] font-mono text-slate-600">routes/agent.py</span>
        </div>
        {/* Code */}
        <div className="p-3 font-mono text-[10px] leading-[1.75]">
          {CODE.map((tokens, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 2.2 + i * 0.14 }}
              className="flex"
            >
              <span className="text-slate-700 w-5 text-right mr-3 select-none text-[9px]">{i + 1}</span>
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
            className="text-sky-400/60 animate-blink ml-6 text-xs"
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
      x: (e.clientX - r.left - r.width  / 2) * 0.28,
      y: (e.clientY - r.top  - r.height / 2) * 0.28,
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
    <section ref={heroRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030712]">
      {/* Grid pattern (circuit-style) */}
      <div className="absolute inset-0 circuit-grid opacity-100" />

      {/* Gradient blobs — parallax */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: blobY }}>
        <div className="absolute top-[20%] left-[20%] w-[520px] h-[520px] rounded-full blur-[130px] bg-indigo-500/[0.13] animate-blob" />
        <div className="absolute top-[30%] right-[18%] w-[420px] h-[420px] rounded-full blur-[120px] bg-violet-500/[0.10] animate-blob2 animation-delay-2" />
        <div className="absolute bottom-[15%] left-[45%] w-[380px] h-[380px] rounded-full blur-[110px] bg-sky-500/[0.08] animate-blob3 animation-delay-4" />
      </motion.div>

      {/* Floating tech labels */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: floatOpacity }}>
        {FLOATS.map(f => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.18, scale: 1, y: [0, -7, 0] }}
            transition={{
              opacity: { duration: 1, delay: f.delay + 1.2 },
              scale:   { duration: 1, delay: f.delay + 1.2 },
              y: { duration: f.floatDur, repeat: Infinity, ease: 'easeInOut', delay: f.delay + 1.5 },
            }}
            style={{ position: 'absolute', left: f.x, top: f.y }}
            className="font-mono text-[10px] text-slate-300 px-2 py-1 rounded border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm select-none"
          >
            {f.label}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Code terminal (desktop) ── */}
      <CodeTerminal />

      {/* ── Main content — parallax ── */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-4xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full font-mono text-xs tracking-[0.1em] text-emerald-400 border border-emerald-400/[0.22] bg-emerald-400/[0.06]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          open to work &amp; freelance
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display font-black tracking-[-0.045em] leading-[1.04] mb-5"
          style={{ fontSize: 'clamp(3.2rem, 8.5vw, 6.8rem)' }}
        >
          <span className="grad-text">Insiya Husain</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="text-slate-400 font-medium mb-4"
          style={{ fontSize: 'clamp(1rem, 2.4vw, 1.25rem)' }}
        >
          Software Engineer &nbsp;·&nbsp;{' '}
          <span className="text-sky-400 font-semibold">
            {typed}
            <span className="text-sky-300/70 animate-blink font-thin">_</span>
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="text-slate-400/75 text-[0.9rem] max-w-[560px] mx-auto mb-10 leading-relaxed"
        >
          I ship production-grade systems that solve real problems, from{' '}
          <span className="text-slate-200 font-medium">AI-powered agents</span> and{' '}
          <span className="text-slate-200 font-medium">high-throughput APIs</span> to{' '}
          <span className="text-slate-200 font-medium">cloud-native infrastructure</span> on AWS.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
          className="flex gap-3 justify-center flex-wrap mb-12"
        >
          <MagneticBtn
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[0.875rem] text-white shadow-[0_4px_20px_rgba(129,140,248,0.35)] hover:shadow-[0_8px_30px_rgba(129,140,248,0.55)] transition-shadow duration-300"
            style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)' }}
          >
            <FaEnvelope className="text-xs" /> Get In Touch
          </MagneticBtn>

          <MagneticBtn
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[0.875rem] text-slate-200 border border-white/[0.09] bg-white/[0.03] backdrop-blur-sm hover:border-indigo-400/35 hover:bg-indigo-500/[0.08] transition-all duration-200"
          >
            <FaArrowRight className="text-xs" /> View Work
          </MagneticBtn>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex gap-2.5 justify-center"
        >
          {[
            { Icon: SiGithub,   href: LINKS.github,   label: 'GitHub' },
            { Icon: SiLinkedin, href: LINKS.linkedin,  label: 'LinkedIn' },
            { Icon: FaEnvelope, href: LINKS.email,     label: 'Email' },
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 border border-white/[0.07] bg-white/[0.03] hover:text-white hover:bg-indigo-500/20 hover:border-indigo-400/35 transition-colors duration-200"
              title={label}
            >
              <Icon className="text-[1.05rem]" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600 text-[10px] tracking-[0.2em] uppercase select-none"
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
