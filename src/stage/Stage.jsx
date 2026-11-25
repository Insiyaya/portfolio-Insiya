import { useCallback, useEffect, useRef, useState } from 'react'
import { ACRONYM, EXPERIENCE, PROJECTS, QUOTES, SKILLS } from '../data'
import ContactPanel from './ContactPanel'
import { useTyped } from './useTyped'
import { useStageScroll } from './useStageScroll'
import './stage.css'

const SCENES = ['Start', 'Skills', 'Experience', 'Projects', 'Contact']
const LAST = SCENES.length - 1
const MIN_LOADER = 1900 // two full hops, even on a fast connection

const media = q => typeof window !== 'undefined' && window.matchMedia(q).matches
const wait = ms => new Promise(r => setTimeout(r, ms))

/* Resolves at the instant the hopping mascot touches down. */
function landing(loader) {
  const hop = loader?.querySelector('.hop')
  if (!hop || media('(prefers-reduced-motion: reduce)')) return Promise.resolve()
  return Promise.race([new Promise(r => hop.addEventListener('animationiteration', r, { once: true })), wait(1200)])
}

function endLoader(loader, withBang) {
  document.documentElement.dataset.loading = 'false'
  if (!loader) return
  loader.dataset.state = withBang ? 'bang' : 'done'
  if (withBang) setTimeout(() => (loader.dataset.state = 'done'), 600)
}

export default function Stage({ onVisible, onOpen }) {
  const track = useRef(null)
  const root = useRef(null)
  const mount = useRef(null)
  const engine = useRef(null)
  const inView = useRef(true)
  const [scene, setScene] = useState(0)
  const [live, setLive] = useState(false)
  const [flat, setFlat] = useState(false)
  const [hover, setHover] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const reduced = media('(prefers-reduced-motion: reduce)')
  const sceneRef = useRef(0)
  sceneRef.current = scene

  /* ── Boot: load the 3D behind the loader, then cut on the landing ── */
  useEffect(() => {
    let cancelled = false
    const loader = document.getElementById('loader')
    const began = performance.now()
    // Arriving on a deep link: don't make them wait for the intro.
    const target = window.location.hash.length > 1 && window.location.hash !== '#home' ? document.querySelector(window.location.hash) : null
    if (target) {
      endLoader(loader, false)
      setLive(true)
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }))
    }

    const first = attempt === 0
    const boot = async () => {
      const { createEngine } = await import('./engine')
      if (cancelled) return
      const made = await createEngine({ mount: mount.current, skills: SKILLS, projects: PROJECTS, experience: EXPERIENCE, acronym: ACRONYM, reduced, onHover: setHover, onLost: () => setTimeout(() => setAttempt(n => n + 1), 400) })
      if (cancelled) return made.dispose()
      if (!target && first) {
        await wait(Math.max(0, MIN_LOADER - (performance.now() - began)))
        await landing(loader)
        if (cancelled) return made.dispose()
      }
      engine.current = made
      made.goTo(sceneRef.current)
      made.setRunning(inView.current && !document.hidden)
      made.playIntro(!!target || !first)
      setFlat(false)
      setLive(true)
      if (!target && first) endLoader(loader, !reduced)
    }

    // No time limit: a hidden tab or a cold graphics card can be slow, and the
    // loader is happy to keep hopping. Only a real error shows the simple page,
    // and even then it tries again by itself.
    let retry = 0
    boot().catch(error => {
      if (cancelled) return
      console.warn('3D could not start:', error)
      setFlat(true)
      setLive(true)
      endLoader(loader, false)
      if (attempt < 3) retry = setTimeout(() => setAttempt(n => n + 1), 1500 * (attempt + 1))
    })

    return () => {
      cancelled = true
      clearTimeout(retry)
      engine.current?.dispose()
      engine.current = null
    }
  }, [reduced, attempt])

  /* ── Only render while the stage is on screen ── */
  useEffect(() => {
    const sync = () => engine.current?.setRunning(inView.current && !document.hidden)
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting
      onVisible?.(entry.intersectionRatio)
      sync()
    }, { threshold: [0, 0.02, 0.5, 0.98, 1] })
    io.observe(root.current)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [onVisible])

  const show = useCallback(i => {
    setScene(i)
    setHover(null)
    engine.current?.goTo(i)
  }, [])

  const { goTo, goBelow } = useStageScroll({ enabled: live && !flat, trackRef: track, count: SCENES.length, scene, onScene: show, reduced })

  /* In-page links: jump past the stage in one go, or back to its first scene. */
  useEffect(() => {
    const onClick = e => {
      const link = e.target.closest?.('a[href^="#"]')
      if (!link || e.defaultPrevented) return
      const hash = link.getAttribute('href')
      if (hash === '#home') {
        e.preventDefault()
        window.history.replaceState(null, '', window.location.pathname)
        goTo(0, true)
        return
      }
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      window.history.replaceState(null, '', hash)
      goBelow(el)
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [goTo, goBelow])

  const click = e => {
    const hit = engine.current?.click(e.nativeEvent)
    if (hit?.item) onOpen({ type: hit.type, item: hit.item })
  }

  /* A new line of tech sarcasm every few seconds, from the current scene's set. */
  const [tick, setTick] = useState(0)
  const set = [null, QUOTES.skills, QUOTES.experience, QUOTES.projects, null][live ? scene : 0]
  useEffect(() => {
    if (!set || reduced) return
    const timer = setInterval(() => setTick(n => n + 1), 5200)
    return () => clearInterval(timer)
  }, [set, reduced])
  const subtitle = useTyped(set ? set[tick % set.length] : '', reduced)
  const over = hover?.type === 'mascot' ? 'poke' : hover ? 'open' : undefined

  return (
    <div ref={track} id="home" className="stage-track" data-flat={flat} style={{ '--scenes': SCENES.length }}>
      <section ref={root} className="stage" data-live={live} data-scene={scene} data-flat={flat} aria-label="Introduction">
        <h1 className="sr-only">Insiya Husain, full stack and AI engineer. Founder of Twofolds and Product Engineer at Ruby CRM.</h1>

        <div className="stage-view">
          <div ref={mount} className="stage-canvas" data-cursor={over} onClick={click} />

          {flat && (
            <div className="stage-flat">
              <p className="stage-flat-name" aria-hidden="true">INSIYA HUSAIN</p>
              <p>Full stack and AI engineer, founder of Twofolds. I build AI agents, the services behind them and the apps in front of them.</p>
              <button type="button" className="pill" onClick={() => setAttempt(n => n + 1)}>Start the 3D scene</button>
            </div>
          )}

          {/* The 3D letters again, for keyboards and screen readers */}
          {!flat && (
            <ul className="letter-keys" aria-label="What INSIYA stands for" inert={live && scene === 0 ? undefined : ''}>
              {ACRONYM.map((a, i) => (
                <li key={i}><button type="button" onClick={() => onOpen({ type: 'letter', item: { index: i } })}>{a.letter} for {a.word}</button></li>
              ))}
            </ul>
          )}

          <div className="explore" data-visible={live && !flat && scene === 0} inert={scene === 0 ? undefined : ''}>
            <span className="explore-fill" />
            <svg className="explore-ring" viewBox="0 0 200 200" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="explore-fade">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#fff" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="98" stroke="url(#explore-fade)" strokeWidth="2.4" />
            </svg>
            <button type="button" onClick={() => goTo(1)}>EXPLORE</button>
          </div>

          <p className="subtitle" aria-hidden="true">{subtitle && <span>{subtitle}</span>}</p>
          <p className="sr-only" aria-live="polite">{live ? SCENES[scene] : ''}</p>

          {!flat && <ContactPanel active={live && scene === LAST} onSent={() => engine.current?.cheer()} />}
        </div>

        <div className="stage-foot">
          <div className="dots" role="group" aria-label="Scenes">
            {!flat && SCENES.map((name, i) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                aria-current={i === scene ? 'step' : undefined}
                data-state={i === scene ? 'viewing' : i < scene ? 'passed' : 'ready'}
                onClick={() => goTo(i)}
              >
                <span aria-hidden="true">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
