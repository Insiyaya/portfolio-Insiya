import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  FaBriefcase, FaAws, FaRobot, FaGraduationCap, FaCodePullRequest, FaCloud,
  FaChevronLeft, FaChevronRight,
} from 'react-icons/fa6'
import { OrbitSystem } from './SpaceScene'
import { RECRUITER_FACTS } from '../data'

const ICONS = { FaBriefcase, FaAws, FaRobot, FaGraduationCap, FaCodePullRequest, FaCloud }

const TONES = {
  pink:     { accent: '#FF2DAA', text: '#F9A8D4', glow: 'rgba(255,45,170,0.28)' },
  magenta:  { accent: '#D946EF', text: '#EBA8FB', glow: 'rgba(217,70,239,0.26)' },
  lavender: { accent: '#C084FC', text: '#DCC6FF', glow: 'rgba(192,132,252,0.24)' },
  cyan:     { accent: '#67E8F9', text: '#A5F3FC', glow: 'rgba(103,232,249,0.22)' },
}

const COUNT = RECRUITER_FACTS.length
const ANGLE = 360 / COUNT
const DWELL = 4200

/* Radius that makes adjacent drum faces meet edge-to-edge for a face of
   width `w`. Derived from the face width rather than hardcoded, so the
   drum stays geometrically correct at every breakpoint. */
const radiusFor = w => w / (2 * Math.tan(Math.PI / COUNT))

/* Angular distance between two faces, in face-steps */
const faceDistance = (i, active) => {
  const fwd = ((i - active) % COUNT + COUNT) % COUNT
  return Math.min(fwd, COUNT - fwd)
}

/**
 * A slowly spinning world with a rotating drum of facts beside it.
 * Each face of the drum carries one highlight; the front face is upright
 * and fully legible, so nothing important is ever read at an angle.
 */
export default function FactPlanet() {
  const [active,  setActive]  = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [reduced, setReduced] = useState(false)
  const [width,   setWidth]   = useState(0)
  const timer = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  /* Measure the face width so the drum radius matches it exactly */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Advance continuously in one direction so the drum never appears to
     rewind — the index grows unbounded and we modulo only for content. */
  const go = useCallback(dir => setActive(i => i + dir), [])

  useEffect(() => {
    if (paused || reduced) return
    timer.current = setInterval(() => setActive(i => i + 1), DWELL)
    return () => clearInterval(timer.current)
  }, [paused, reduced])

  const idx  = ((active % COUNT) + COUNT) % COUNT
  const fact = RECRUITER_FACTS[idx]
  const tone = TONES[fact.tone] || TONES.pink

  return (
    <div className="relative mt-16 pt-12 border-t border-line">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-softpink whitespace-nowrap">
          // facts.rotate
        </span>
        <div className="flex-1 hair-divider" />
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-faint tabular-nums">
          {String(idx + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
        </span>
      </div>

      <div
        className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12 items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── The world ── */}
        <div className="relative mx-auto lg:mx-0 w-[200px] h-[200px] flex-shrink-0">
          {/* Orbiting moon, tinted to the active fact */}
          <OrbitSystem
            size={224}
            tone={fact.tone === 'cyan' ? 'cyan' : 'lavender'}
            tilt={-16}
            flatten={0.3}
            duration={26}
            moonSize={8}
            style={{ left: -12, top: -12 }}
          />

          {/* Atmospheric bloom, keyed to the active fact's colour */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ inset: -48 }}
            animate={{ background: `radial-gradient(circle, ${tone.glow} 0%, transparent 62%)` }}
            transition={{ duration: 1 }}
          />

          {/* Planet body — surface bands scroll to read as rotation */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 34% 26%, #FF7ED4 0%, #D62A96 34%, #6C0F4B 66%, #26071C 100%)',
              boxShadow: 'inset -20px -14px 60px rgba(13,8,18,0.88), inset 6px 6px 20px rgba(255,126,212,0.22)',
            }}
          >
            {/* Axial tilt on the wrapper, so the stripe layer itself can scroll
                on a clean horizontal axis and tile seamlessly. */}
            <div className="absolute inset-0" style={{ transform: 'rotate(-8deg) scale(1.4)' }}>
              <div
                className={`absolute inset-0 opacity-[0.20] mix-blend-soft-light ${reduced ? '' : 'animate-surface'}`}
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    rgba(255,247,252,0.60) 0px,
                    rgba(255,247,252,0.60) 3px,
                    transparent 3px,
                    transparent 13px
                  )`,
                }}
              />
            </div>
            {/* Terminator — keeps the sphere reading as lit from one side */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle at 76% 78%, rgba(13,8,18,0.62) 0%, transparent 58%)' }}
            />
          </div>

          {/* Lit limb */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: 'inset 3px 3px 12px rgba(255,126,212,0.75)', opacity: 0.5 }}
          />

          {/* Active-face marker on the equator */}
          <motion.div
            className="absolute rounded-full"
            animate={{ background: tone.accent, boxShadow: `0 0 12px 2px ${tone.glow}` }}
            transition={{ duration: 0.6 }}
            style={{ width: 7, height: 7, right: -3, top: '48%' }}
          />
        </div>

        {/* ── The rotating fact drum ── */}
        <div className="min-w-0">
          {/* Clip lives OUTSIDE the 3D context — `overflow:hidden` on a
              preserve-3d ancestor flattens the scene in WebKit. */}
          <div className="relative overflow-hidden -mx-1 px-1">
            <div
              ref={stageRef}
              className="relative h-[196px] sm:h-[172px]"
              style={{ perspective: '1200px' }}
            >
              <div
                className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(0.21,0.47,0.32,0.98)]"
                style={{
                  transformStyle: 'preserve-3d',
                  /* Pull the drum back by its radius so the front face lands at
                     z = 0 and renders at natural size instead of magnified. */
                  transform: `translateZ(-${radiusFor(width)}px) rotateY(${-active * ANGLE}deg)`,
                }}
              >
                {RECRUITER_FACTS.map((f, i) => {
                  const t = TONES[f.tone] || TONES.pink
                  const Icon = ICONS[f.icon] || FaBriefcase
                  const d = faceDistance(i, active)
                  const isActive = d === 0

                  return (
                    <div
                      key={f.key}
                      className="absolute inset-y-0 left-0 right-0 flex items-center"
                      style={{
                        transform: `rotateY(${i * ANGLE}deg) translateZ(${radiusFor(width)}px)`,
                        backfaceVisibility: 'hidden',
                        /* Neighbours stay faintly visible so the turn reads as a
                           rotating drum rather than a crossfade. */
                        opacity: d === 0 ? 1 : d === 1 ? 0.22 : 0,
                        transition: 'opacity 900ms cubic-bezier(0.21,0.47,0.32,0.98)',
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                      aria-hidden={!isActive}
                    >
                      <div
                        className="w-full card p-5 sm:p-6 relative overflow-hidden"
                        style={{ borderColor: `${t.accent}4d`, boxShadow: `0 16px 44px ${t.glow}` }}
                      >
                        {/* Top accent */}
                        <span
                          className="absolute top-0 left-0 right-0 h-[2px]"
                          style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }}
                        />

                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
                            style={{ background: `${t.accent}18`, borderColor: `${t.accent}3d` }}
                          >
                            <Icon className="text-base" style={{ color: t.accent }} />
                          </div>

                          <div className="min-w-0">
                            <div
                              className="font-mono text-[9.5px] tracking-[0.2em] uppercase mb-1.5"
                              style={{ color: t.accent }}
                            >
                              {f.key}
                            </div>
                            <div className="font-display text-[1.05rem] sm:text-[1.15rem] font-bold tracking-[-0.02em] text-ink leading-snug">
                              {f.value}
                            </div>
                            <div className="text-dim text-[0.8rem] mt-1 leading-relaxed">
                              {f.sub}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Controls — face ticks plus manual stepping */}
          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center gap-1.5">
              {RECRUITER_FACTS.map((f, i) => {
                const t = TONES[f.tone] || TONES.pink
                const on = i === idx
                return (
                  <button
                    key={f.key}
                    onClick={() => setActive(a => a + ((i - (((a % COUNT) + COUNT) % COUNT) + COUNT) % COUNT))}
                    aria-label={`Show highlight: ${f.value}`}
                    aria-current={on}
                    className="h-1.5 rounded-full transition-all duration-300 focus-visible:outline-offset-4"
                    style={{
                      width: on ? 22 : 6,
                      background: on ? t.accent : '#4A294F',
                      boxShadow: on ? `0 0 10px ${t.glow}` : 'none',
                    }}
                  />
                )
              })}
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => go(-1)}
                aria-label="Previous highlight"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-faint border border-line
                           hover:text-neon hover:border-hotpink/45 transition-colors"
              >
                <FaChevronLeft className="text-[10px]" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next highlight"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-faint border border-line
                           hover:text-neon hover:border-hotpink/45 transition-colors"
              >
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Every fact stays available to assistive tech and to users without JS motion */}
      <ul className="sr-only">
        {RECRUITER_FACTS.map(f => (
          <li key={f.key}>{f.key}: {f.value} — {f.sub}</li>
        ))}
      </ul>
    </div>
  )
}
