import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SiGithub } from 'react-icons/si'
import {
  FaRobot, FaPlane, FaRss, FaPuzzlePiece, FaUtensils, FaCodeBranch,
  FaArrowUpRightFromSquare, FaGlobe,
} from 'react-icons/fa6'
import { SectionHeader, FadeUp, ScrollReveal, SystemLabel } from './ui'
import { SectionCosmos } from './SpaceScene'
import { PROJECTS } from '../data'

const ICON_MAP = {
  tripcraft:  FaPlane,
  'ai-agent': FaRobot,
  roboshots:  FaRss,
  jumble:     FaPuzzlePiece,
  savour:     FaUtensils,
  talawa:     FaCodeBranch,
}

/* Small monospace field label — "problem", "result" */
function FieldLabel({ children, accent }) {
  return (
    <span
      className="font-mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 mb-1.5"
      style={{ color: accent }}
    >
      <span className="w-2.5 h-px" style={{ background: accent }} />
      {children}
    </span>
  )
}

/* ── Browser-chrome preview frame ── */
function BrowserPreview({ url, accent }) {
  return (
    <div className="rounded-xl border border-line overflow-hidden bg-void shadow-[0_16px_60px_rgba(13,8,18,0.6)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line bg-surface2/70">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-hotpink/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-magenta/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-lavender/40" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-void/70 border border-line max-w-[240px] w-full">
            <FaGlobe className="text-[8px] text-faint flex-shrink-0" />
            <span className="text-[9px] font-mono text-faint truncate">{url.replace('https://', '')}</span>
          </div>
        </div>
      </div>

      {/* Iframe */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        {/* The iframe paints its own background once loaded; giving the element
            a dark ground stops a white flash while loading (or a white slab if
            the remote site is unreachable). */}
        <iframe
          src={url}
          title="Project preview"
          className="absolute inset-0 w-full h-full border-0 pointer-events-none bg-void"
          style={{ colorScheme: 'dark' }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
        {/* Vignette + hairline binds the live preview into the dark card */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(51,32,58,0.9), inset 0 -46px 64px -34px rgba(13,8,18,0.6)',
          }}
        />
        {/* Hover overlay to visit */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100
                     transition-opacity duration-300 bg-void/60 backdrop-blur-[2px]"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-ink border"
            style={{ background: `${accent}26`, borderColor: `${accent}66`, boxShadow: `0 8px 26px ${accent}33` }}
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
    <div className="rounded-xl border border-line overflow-hidden bg-void shadow-[0_16px_60px_rgba(13,8,18,0.6)]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line bg-surface2/70">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-hotpink/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-magenta/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-lavender/40" />
        </div>
      </div>
      <div
        className="relative w-full aspect-[16/10] flex flex-col items-center justify-center gap-3 circuit-grid"
        style={{ background: `linear-gradient(160deg, ${accent}0f, ${accent}05)` }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{ background: `${accent}16`, borderColor: `${accent}33` }}
        >
          <FaRobot className="text-xl" style={{ color: accent }} />
        </div>
        <span className="font-mono text-[11px] text-faint tracking-wider">Coming Soon</span>
        <SystemLabel pulse>build in progress</SystemLabel>
      </div>
    </div>
  )
}

/* ── Featured project — reads like a product page, not a repo card ── */
function FeaturedProject({ proj, num }) {
  const Icon = ICON_MAP[proj.id] || FaRobot

  return (
    <ScrollReveal>
      <motion.div
        whileHover={{ borderColor: 'rgba(255,45,170,0.42)', boxShadow: '0 22px 60px rgba(255,45,170,0.14)' }}
        transition={{ duration: 0.3 }}
        className="relative card overflow-hidden group"
      >
        {/* Top accent bar on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${proj.accent}, ${proj.accent}66, transparent)` }}
        />

        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-0">
          {/* ── Left: the story ── */}
          <div className="p-6 lg:p-7 flex flex-col">
            {/* Meta row: index · icon · kind · AI flag */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="index-num text-[1.6rem] leading-none">
                {String(num).padStart(2, '0')}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0"
                style={{ background: `${proj.accent}16`, borderColor: `${proj.accent}33` }}
              >
                <Icon className="text-sm" style={{ color: proj.accent }} />
              </div>
              <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-faint">
                {proj.kind}
              </span>
              {proj.ai && <SystemLabel>ai system</SystemLabel>}
              {proj.status === 'wip' && (
                <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-softpink border border-hotpink/25 bg-hotpink/[0.07] px-2 py-0.5 rounded-md">
                  in dev
                </span>
              )}
            </div>

            <h3 className="font-display text-[1.35rem] lg:text-[1.5rem] font-bold tracking-[-0.025em] text-ink mb-4">
              {proj.title}
            </h3>

            {/* Problem */}
            {proj.problem && (
              <div className="mb-4">
                <FieldLabel accent={proj.accent}>the problem</FieldLabel>
                <p className="text-dim text-[0.84rem] leading-relaxed italic">{proj.problem}</p>
              </div>
            )}

            {/* What was built */}
            <p className="text-dim text-[0.855rem] leading-[1.75] mb-4">{proj.desc}</p>

            {/* Engineering highlights */}
            {proj.highlights && (
              <ul className="space-y-2 mb-4">
                {proj.highlights.map(h => (
                  <li key={h} className="flex gap-2.5 items-start text-[0.8rem] text-dim leading-relaxed">
                    <span className="mt-[6px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: proj.accent }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {/* Result */}
            {proj.outcome && (
              <div className="mb-5 pl-3 border-l" style={{ borderColor: `${proj.accent}44` }}>
                <FieldLabel accent={proj.accent}>result</FieldLabel>
                <p className="text-ink/90 text-[0.82rem] leading-relaxed font-medium">{proj.outcome}</p>
              </div>
            )}

            {/* Stack */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {proj.tags.map(t => <span key={t} className="ptag">{t}</span>)}
            </div>

            {/* AI/system indicators — the only cyan in the card */}
            {proj.aiTags && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {proj.aiTags.map(t => <span key={t} className="chip-ai tracking-[0.12em]">{t}</span>)}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap mt-auto">
              {proj.live && (
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink px-4 py-2 rounded-lg
                             transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: proj.accent,
                    boxShadow: `0 4px 18px ${proj.accent}44`,
                  }}
                >
                  <FaGlobe className="text-[10px]" /> Live Demo
                  <FaArrowUpRightFromSquare className="text-[9px] opacity-70" />
                </a>
              )}
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-softpink px-3.5 py-2 rounded-lg
                             border border-line2 bg-surface2/60 hover:text-ink hover:border-hotpink/50
                             hover:shadow-[0_6px_20px_rgba(255,45,170,0.14)] transition-all duration-200"
                >
                  <SiGithub /> GitHub
                </a>
              )}
              {proj.status === 'wip' && !proj.live && !proj.github && (
                <span className="inline-flex items-center gap-2 text-xs font-mono text-cyber">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse-dot" />
                  Actively In Development
                </span>
              )}
            </div>
          </div>

          {/* ── Right: the artefact ── */}
          <div className="p-3 lg:p-4 lg:pl-0 flex items-center">
            <div className="w-full">
              {proj.live ? (
                <BrowserPreview url={proj.live} accent={proj.accent} />
              ) : (
                <WipPreview accent={proj.accent} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

/* ── Secondary project card ── */
function ProjectCard({ proj, num }) {
  const Icon = ICON_MAP[proj.id] || FaRobot

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: 'rgba(255,45,170,0.40)', boxShadow: '0 16px 42px rgba(255,45,170,0.13)' }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col p-5 card relative overflow-hidden group"
    >
      <span
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${proj.accent}, transparent)` }}
      />

      {/* Meta row */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="index-num text-[1.1rem] leading-none">{String(num).padStart(2, '0')}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0"
          style={{ background: `${proj.accent}14`, borderColor: `${proj.accent}30` }}
        >
          <Icon className="text-sm" style={{ color: proj.accent }} />
        </div>
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-faint truncate">
          {proj.kind}
        </span>
      </div>

      <h3 className="font-display text-[1rem] font-bold tracking-[-0.02em] text-ink mb-2">{proj.title}</h3>

      {proj.problem && (
        <p className="text-faint text-[0.76rem] leading-relaxed italic mb-2.5">{proj.problem}</p>
      )}

      <p className="text-dim text-[0.8rem] leading-relaxed mb-3.5 flex-1">{proj.desc}</p>

      {proj.outcome && (
        <div className="mb-4 pl-2.5 border-l" style={{ borderColor: `${proj.accent}40` }}>
          <p className="text-[0.75rem] text-ink/85 leading-relaxed">{proj.outcome}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {proj.tags.map(t => <span key={t} className="ptag">{t}</span>)}
      </div>

      {proj.github && (
        <a
          href={proj.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-softpink border border-line2
                     bg-surface2/50 hover:text-ink hover:border-hotpink/45 px-3 py-1.5 rounded-lg
                     transition-all duration-200 self-start"
        >
          <SiGithub /> GitHub <FaArrowUpRightFromSquare className="text-[9px] opacity-60" />
        </a>
      )}
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

  const featuredCount = featured.length

  return (
    <section id="projects" className="relative py-24 bg-void">
      {/* Section lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 55% at 68% 32%, rgba(217,70,239,0.07) 0%, transparent 58%)' }}
      />
      <SectionCosmos
        planet="pink"
        size={150}
        position={{ left: '-64px', bottom: '6%' }}
        ring
        starOpacity={0.28}
      />

      <div className="relative max-w-6xl mx-auto px-5">

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
                <div className="font-display text-[1.75rem] font-bold tracking-[-0.03em] leading-none text-ink">Featured</div>
                <div className="font-display text-[1.75rem] font-bold tracking-[-0.03em] leading-none grad-text">Projects</div>
              </div>
              <p className="text-faint text-[0.75rem] leading-relaxed mt-3 mb-8">
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
                        backgroundColor: i === activeIdx ? proj.accent : 'rgba(255,247,252,0.14)',
                        boxShadow:       i === activeIdx ? `0 0 10px ${proj.accent}99` : 'none',
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="flex-shrink-0"
                    />
                    <motion.span
                      animate={{
                        color:      i === activeIdx ? '#FFF7FC' : '#8F7A96',
                        fontWeight: i === activeIdx ? 600 : 400,
                      }}
                      transition={{ duration: 0.25 }}
                      className="text-[10.5px] font-mono leading-tight truncate max-w-[130px] group-hover:text-dim transition-colors"
                    >
                      {proj.title}
                    </motion.span>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 font-mono text-[10px] text-faint uppercase tracking-widest tabular-nums">
                <span className="text-softpink">{String(activeIdx + 1).padStart(2, '0')}</span>
                <span className="w-6 h-px bg-line2" />
                <span>{String(allProjects.length).padStart(2, '0')}</span>
              </div>
            </FadeUp>
          </div>

          {/* ── SCROLLING RIGHT — Cards ── */}
          <div className="space-y-6">
            {featured.map((p, i) => (
              <div
                key={p.id}
                ref={el => projRefs.current[i] = el}
                onMouseEnter={() => onCardHover(i)}
                onMouseLeave={onCardLeave}
              >
                <FeaturedProject proj={p} num={i + 1} />
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
                    <ProjectCard proj={p} num={i + featuredCount + 1} />
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
