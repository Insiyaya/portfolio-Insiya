import { useCallback, useEffect, useRef } from 'react'

const HOLD = 950 // ms after a change before another gesture counts
const PAUSE = 170 // ms without a wheel event that counts as a new gesture

/* The stage is pinned inside a track as tall as all its scenes, so every scene
   is real scroll distance: the scrollbar, find-in-page and momentum can pass
   through them but never jump over them.
 *
 * On top of that, one wheel flick, swipe or key press moves exactly one scene. */
export function useStageScroll({ enabled, trackRef, count, scene, onScene, reduced }) {
  const live = useRef({ scene, onScene })
  live.current = { scene, onScene }
  const api = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const last = count - 1
    const step = () => track.firstElementChild.offsetHeight
    const end = () => track.offsetTop + track.offsetHeight
    const y = () => window.scrollY

    let auto = null // target of a scroll we started ourselves
    let autoTimer = 0
    let hold = 0
    let lastWheel = 0
    let settled = true
    let pile = 0
    let fromBelow = false
    let before = y()
    let idle = 0

    const setScene = i => {
      if (i === live.current.scene) return
      live.current.scene = i // several events can land before React re-renders
      live.current.onScene(i)
    }
    const glide = (top, instant) => {
      auto = Math.round(top)
      clearTimeout(autoTimer)
      autoTimer = setTimeout(() => (auto = null), 1500)
      window.scrollTo({ top: auto, behavior: instant || reduced ? 'instant' : 'smooth' })
    }
    const goTo = (i, instant) => {
      const to = Math.max(0, Math.min(last, i))
      setScene(to)
      glide(to * step(), instant)
    }
    const leave = () => glide(end())
    /* Jump to something below the stage without dragging through every scene. */
    const goBelow = el => {
      const bar = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      if (y() < last * step()) glide(last * step(), true)
      requestAnimationFrame(() => glide(el.getBoundingClientRect().top + y() - bar))
    }
    api.current = { goTo, leave, goBelow }
    if (!enabled) return () => clearTimeout(autoTimer)

    const busy = () => document.querySelector('dialog[open]')
    const onStage = () => y() < end() - 1

    function act(dir) {
      hold = performance.now() + HOLD
      settled = false
      pile = 0
      const now = live.current.scene
      if (y() > last * step() + 4) return dir > 0 ? leave() : goTo(last)
      if (dir > 0) return now < last ? goTo(now + 1) : leave()
      if (now > 0) goTo(now - 1)
    }

    function settle() {
      if (auto !== null || !onStage() || busy()) return
      const at = y() / step()
      const near = Math.round(at)
      if (Math.abs(at - near) * step() > 3) near > last ? leave() : goTo(near)
    }

    const onScroll = () => {
      const top = y()
      if (auto !== null) {
        if (Math.abs(top - auto) < 2) auto = null
        before = top
        return
      }
      // Momentum coming up out of the page stops at the last scene.
      if (before >= end() - 1 && top < end() - 1) fromBelow = true
      if (fromBelow && top < last * step()) window.scrollTo({ top: last * step(), behavior: 'instant' })
      if (top < end() - 1) setScene(Math.max(0, Math.min(last, Math.round(Math.min(top, last * step()) / step()))))
      before = y()
      clearTimeout(idle)
      idle = setTimeout(() => {
        fromBelow = false
        if (!('onscrollend' in window)) settle()
      }, PAUSE)
    }
    const onScrollEnd = () => {
      if (auto !== null && Math.abs(y() - auto) < 3) auto = null
      setTimeout(settle, 40)
    }

    const onWheel = e => {
      if (e.ctrlKey || busy()) return
      // When it happened, not when a busy main thread got round to it.
      const now = e.timeStamp || performance.now()
      if (now - lastWheel > PAUSE) {
        settled = true
        pile = 0
      }
      lastWheel = now
      if (!onStage()) return
      // Taken from the very first event of the gesture: if even one slips
      // through, the browser stops letting us cancel the rest.
      if (e.cancelable) e.preventDefault()
      if (fromBelow || now < hold || (!settled && now < hold + 1700)) return
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      pile += e.deltaY * (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? 400 : 1)
      if (Math.abs(pile) > 14) act(Math.sign(pile))
    }

    const onKey = e => {
      if (e.altKey || e.ctrlKey || e.metaKey || busy() || !onStage()) return
      if (e.target.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === ' ' && e.target.closest('button, a, summary')) return
      const dir = { ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key]
      if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (dir) {
        e.preventDefault()
        if (performance.now() >= hold) act(dir)
      }
    }

    // The stage has touch-action: none, so swipes on it never scroll natively.
    let touch = null
    const onStart = e => {
      touch = e.touches.length === 1 && !e.target.closest('input, textarea') ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
    }
    const onEnd = e => {
      if (!touch) return
      const dx = touch.x - e.changedTouches[0].clientX
      const dy = touch.y - e.changedTouches[0].clientY
      touch = null
      if (Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(dx) && performance.now() >= hold && onStage()) act(Math.sign(dy))
    }

    let width = window.innerWidth
    const onResize = () => {
      // Ignore the phone address bar showing and hiding.
      if (window.innerWidth === width && matchMedia('(pointer: coarse)').matches) return
      width = window.innerWidth
      if (onStage()) glide(live.current.scene * step(), true)
    }

    const stage = track.firstElementChild
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    stage.addEventListener('touchstart', onStart, { passive: true })
    stage.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      clearTimeout(autoTimer)
      clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      stage.removeEventListener('touchstart', onStart)
      stage.removeEventListener('touchend', onEnd)
    }
  }, [enabled, trackRef, count, reduced])

  return {
    goTo: useCallback((i, instant) => api.current?.goTo(i, instant), []),
    goBelow: useCallback(el => api.current?.goBelow(el), []),
  }
}
