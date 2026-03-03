import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import {
  FaRobot, FaPlane, FaRss, FaPuzzlePiece, FaUtensils, FaCodeBranch,
  FaArrowUpRightFromSquare, FaGlobe,
} from 'react-icons/fa6'
import { SectionHeader, FadeUp, ScrollReveal } from './ui'
import { PROJECTS } from '../data'

const ICON_MAP = {
  tripcraft:  FaPlane,
  'ai-agent': FaRobot,
  roboshots:  FaRss,
  jumble:     FaPuzzlePiece,
  savour:     FaUtensils,
  talawa:     FaCodeBranch,
}

/* ── Browser-chrome preview frame ── */
function BrowserPreview({ url, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#0a0a0f] shadow-[0_16px_60px_rgba(0,0,0,0.5)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] max-w-[240px] w-full">
            <FaGlobe className="text-[8px] text-slate-600 flex-shrink-0" />
            <span className="text-[9px] font-mono text-slate-500 truncate">{url.replace('https://', '')}</span>
          </div>
        </div>
      </div>
      {/* Iframe */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <iframe
          src={url}
          title="Project preview"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
        {/* Hover overlay to visit */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white border border-white/20"
            style={{ background: `${accent}30` }}
          >
            <FaGlobe className="text-[10px]" /> Visit Live Site <FaArrowUpRightFromSquare className="text-[9px]" />
          </span>
        </a>
      </div>
    </div>
  )
}

/* ── WIP placeholder preview ── */
function WipPreview({ accent }) {
  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#0a0a0f] shadow-[0_16px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
        </div>
      </div>
      <div className="relative w-full aspect-[16/10] flex flex-col items-center justify-center gap-3" style={{ background: `linear-gradient(160deg, ${accent}08, ${accent}03)` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: `${accent}14`, borderColor: `${accent}28` }}>
          <FaRobot className="text-xl" style={{ color: accent }} />
        </div>
        <span className="font-mono text-[11px] text-slate-500">Coming Soon</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono" style={{ color: accent }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          Actively In Development
        </span>
      </div>
    </div>
  )
}

/* ── Featured project card ── */
function FeaturedProject({ proj }) {
  const Icon = ICON_MAP[proj.id] || FaRobot
  return (
    <ScrollReveal>
      <motion.div
        whileHover={{ boxShadow: `0 24px 60px ${proj.accent}18` }}
        className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden group"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${proj.accent}, ${proj.accent}80, transparent)` }}
        />

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
          {/* Left — info */}
          <div className="p-6 lg:p-7 flex flex-col justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
              style={{ background: `${proj.accent}14`, borderColor: `${proj.accent}28` }}
            >
              <Icon className="text-lg" style={{ color: proj.accent }} />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-display text-xl font-bold tracking-tight">{proj.title}</h3>
              {proj.status === 'wip' && (
                <span className="font-mono text-[10px] text-sky-400 border border-sky-400/25 bg-sky-400/[0.07] px-2 py-0.5 rounded">
                  IN DEV
                </span>
              )}
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">{proj.desc}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {proj.tags.map(t => <span key={t} className="ptag">{t}</span>)}
            </div>

            <div className="flex gap-2 flex-wrap">
              {proj.live && (
                <a href={proj.live} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${proj.accent}, ${proj.accent}bb)` }}
                >
                  <FaGlobe className="text-[10px]" /> Live Demo <FaArrowUpRightFromSquare className="text-[9px] opacity-70" />
                </a>
              )}
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.03] hover:text-white hover:border-indigo-400/30 hover:bg-indigo-500/[0.08] transition-all">
                  <SiGithub /> GitHub
                </a>
              )}
              {proj.status === 'wip' && !proj.live && !proj.github && (
                <span className="inline-flex items-center gap-2 text-xs font-mono text-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Actively In Development
                </span>
              )}
            </div>
          </div>

          {/* Right — preview */}
          <div className="p-3 lg:p-4 lg:pl-0">
            {proj.live ? (
              <BrowserPreview url={proj.live} accent={proj.accent} />
            ) : (
              <WipPreview accent={proj.accent} />
            )}
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

/* ── Regular project card ── */
function ProjectCard({ proj }) {
  const Icon = ICON_MAP[proj.id] || FaRobot
  return (
    <motion.div
      whileHover={{ boxShadow: `0 16px 40px ${proj.accent}1a`, y: -4 }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden group"
    >
      <span className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${proj.accent}, transparent)` }}
      />

      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border flex-shrink-0"
        style={{ background: `${proj.accent}12`, borderColor: `${proj.accent}28` }}
      >
        <Icon className="text-lg" style={{ color: proj.accent }} />
      </div>

      <h3 className="font-display text-[0.98rem] font-bold tracking-tight mb-2">{proj.title}</h3>
      <p className="text-slate-400 text-[0.83rem] leading-relaxed mb-4 flex-1">{proj.desc}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {proj.tags.map(t => <span key={t} className="ptag">{t}</span>)}
      </div>

      <div className="flex gap-2">
        {proj.github && (
          <a href={proj.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white border border-white/[0.07] bg-white/[0.02] hover:border-indigo-400/28 hover:bg-indigo-500/[0.07] px-3 py-1.5 rounded-lg transition-all duration-200 self-start"
          >
            <SiGithub /> GitHub <FaArrowUpRightFromSquare className="text-[9px] opacity-60" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

/* ── Main section ── */
export default function Projects() {
  const featured    = PROJECTS.filter(p => p.featured)
  const rest        = PROJECTS.filter(p => !p.featured)
  const allProjects = [...featured, ...rest]

  const [activeIdx, setActiveIdx] = useState(0)
  const hoveredIdx = useRef(null)
  const projRefs   = useRef([])
  const ratios     = useRef([])

  useEffect(() => {
    ratios.current = new Array(allProjects.length).fill(0)

    const pickBest = () => {
      if (hoveredIdx.current !== null) return
      let best = 0
      ratios.current.forEach((r, i) => { if (r > ratios.current[best]) best = i })
      setActiveIdx(best)
    }

    const observers = allProjects.map((_, i) => {
      const el = projRefs.current[i]
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { ratios.current[i] = entry.intersectionRatio; pickBest() },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o && o.disconnect())
  }, [allProjects.length])

  const onCardHover = idx => {
    hoveredIdx.current = idx
    setActiveIdx(idx)
  }
  const onCardLeave = () => {
    hoveredIdx.current = null
    let best = 0
    ratios.current.forEach((r, i) => { if (r > ratios.current[best]) best = i })
    setActiveIdx(best)
  }

  const scrollToProject = idx => {
    projRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  /* Featured projects get individual refs starting at 0 */
  const featuredCount = featured.length

  return (
    <section
      id="projects"
      className="relative py-24"
      style={{ background: 'radial-gradient(ellipse 55% 55% at 65% 40%, rgba(167,139,250,0.06) 0%, transparent 55%), #030712' }}
    >
      <div className="max-w-6xl mx-auto px-5">

        {/* Mobile header */}
        <div className="lg:hidden mb-10">
          <SectionHeader
            tag="// projects.showcase"
            title="Featured"
            highlight="Projects"
            sub="Things I've built with purpose"
          />
        </div>

        <div className="grid lg:grid-cols-[190px_1fr] gap-x-10 items-start">

          {/* ── STICKY LEFT — Sidebar nav ── */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <FadeUp>
              <span className="section-tag">// projects.showcase</span>
              <div className="mt-4 mb-1">
                <div className="font-display text-[1.75rem] font-black tracking-tight leading-none">Featured</div>
                <div className="font-display text-[1.75rem] font-black tracking-tight leading-none grad-text">Projects</div>
              </div>
              <p className="text-slate-500 text-[0.75rem] leading-relaxed mt-3 mb-8">
                Things I&rsquo;ve built with purpose
              </p>

              <div className="flex flex-col gap-4">
                {allProjects.map((proj, i) => (
                  <button
                    key={proj.id}
                    onClick={() => scrollToProject(i)}
                    className="flex items-center gap-3 group text-left w-full"
                  >
                    <motion.div
                      animate={{
                        width:           i === activeIdx ? 20 : 6,
                        height:          6,
                        borderRadius:    i === activeIdx ? 3 : 999,
                        backgroundColor: i === activeIdx ? proj.accent : 'rgba(255,255,255,0.12)',
                        boxShadow:       i === activeIdx ? `0 0 10px ${proj.accent}80` : 'none',
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-shrink-0"
                    />
                    <motion.span
                      animate={{
                        color:      i === activeIdx ? '#e2e8f0' : 'rgb(71,85,105)',
                        fontWeight: i === activeIdx ? 600 : 400,
                      }}
                      transition={{ duration: 0.25 }}
                      className="text-[10.5px] font-mono leading-tight truncate max-w-[130px] group-hover:text-slate-300 transition-colors"
                    >
                      {proj.title}
                    </motion.span>
                  </button>
                ))}
              </div>

              <div className="mt-6 font-mono text-[10px] text-slate-600 uppercase tracking-widest">
                {activeIdx + 1} / {allProjects.length}
              </div>
            </FadeUp>
          </div>

          {/* ── SCROLLING RIGHT — Cards ── */}
          <div className="space-y-6">
            {/* Featured projects */}
            {featured.map((p, i) => (
              <div
                key={p.id}
                ref={el => projRefs.current[i] = el}
                onMouseEnter={() => onCardHover(i)}
                onMouseLeave={onCardLeave}
              >
                <FeaturedProject proj={p} />
              </div>
            ))}

            {/* Other projects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {rest.map((p, i) => (
                <div
                  key={p.id}
                  ref={el => projRefs.current[i + featuredCount] = el}
                  onMouseEnter={() => onCardHover(i + featuredCount)}
                  onMouseLeave={onCardLeave}
                >
                  <ScrollReveal>
                    <ProjectCard proj={p} />
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
