import { NeutralToneMapping, PerspectiveCamera, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three'
import { createComposite } from './composite'
import { createMascotGeometry, createRig } from './mascot'
import { damp, inOutCubic, lerp, outBack, outCubic, smooth, span } from './math'
import { loadFaces } from './textures'
import { createTrail } from './trail'
import { createContactWorld } from './worlds/contact'
import { createCraftWorld } from './worlds/craft'
import { createJourneyWorld } from './worlds/journey'
import { createNameWorld } from './worlds/name'
import { createWorkWorld } from './worlds/work'

const FOV = 30
const TAN = Math.tan((FOV / 2) * (Math.PI / 180))
const SWITCH = 1.35 // seconds for one world to become the next

function measure(w, h) {
  const aspect = w / Math.max(1, h)
  const tall = aspect < 1.1
  const dist = Math.max(8.6, (tall ? 2.1 : 4.5) / (TAN * aspect))
  const halfH = dist * TAN
  return { aspect, tall, dist, halfH, halfW: halfH * aspect }
}

/* `onHover` reports what the cursor is over: { type, item } or null. */
export async function createEngine({ mount, skills, projects, experience, acronym, reduced, onHover, onLost }) {
  await loadFaces()

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const modest = coarse || (navigator.hardwareConcurrency || 8) <= 4
  const canvas = document.createElement('canvas')
  let renderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
  } catch {
    await new Promise(r => setTimeout(r, 700))
    renderer = new WebGLRenderer({ canvas: canvas.cloneNode(), antialias: false, alpha: false, powerPreference: 'default' })
  }
  const view = renderer.domElement
  view.setAttribute('aria-hidden', 'true')
  renderer.toneMapping = NeutralToneMapping
  renderer.transmissionResolutionScale = modest ? 0.5 : 0.8
  mount.appendChild(view)

  let ratio = Math.min(window.devicePixelRatio || 1, modest ? 1.25 : 1.75)
  const composite = createComposite(renderer, { bloom: !coarse })
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 80)
  const mascotGeometry = createMascotGeometry()
  const shared = { renderer, mascotGeometry, skills, projects, experience, acronym }
  const worlds = [createNameWorld(shared), createCraftWorld(shared), createJourneyWorld(shared), createWorkWorld(shared), createContactWorld(shared)]
  const rig = createRig()
  const trail = createTrail()
  if (!reduced) worlds.forEach(world => world.trail && world.scene.add(trail.mesh(...world.trail)))

  const size = { w: 1, h: 1 }
  let layout = measure(1, 1)
  const pointer = new Vector2()
  const eased = new Vector2()
  const quick = new Vector2()
  const raycaster = new Raycaster()
  const probe = { x: 0, y: 0, on: false }
  const head = new Vector3()
  let inside = false
  let push = 0

  let frame = 0
  let running = false
  let disposed = false
  let previous = 0
  // Reduced motion holds the clock still, at a moment when every screen is lit.
  let time = reduced ? 8.2 : 0
  let intro = -1 // before the loader lands
  let kicked = false
  let current = 0
  let wanted = 0
  let move = null // { from, to, t }
  let zoom = 1
  let camY = 0
  let hover = null
  let slow = 0

  function resize() {
    const w = mount.clientWidth
    const h = mount.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(ratio)
    renderer.setSize(w, h, false)
    size.w = Math.round(w * ratio)
    size.h = Math.round(h * ratio)
    composite.resize(size.w, size.h)
    layout = measure(w, h)
    camera.aspect = layout.aspect
    camera.updateProjectionMatrix()
    worlds.forEach(world => world.resize(layout))
  }

  function aim(world) {
    const t = world.rig()
    const follow = t.scale > 0 ? 1 : 0
    return { ...t, yaw: t.yaw + eased.x * 0.85 * follow, pitch: t.pitch - eased.y * 0.42 * follow }
  }

  function place(dt, shake) {
    const world = worlds[move ? move.to : current]
    zoom = damp(zoom, world.camera.zoom, 3, dt)
    camY = damp(camY, world.camera.y, 3, dt)
    const punch = intro >= 0 && !reduced ? lerp(0.9, 1, outCubic(span(intro, 0.05, 0.9))) : 1
    camera.position.set(
      eased.x * 0.95 + Math.sin(time * 71) * shake,
      camY + eased.y * 0.5 + Math.cos(time * 83) * shake,
      layout.dist * zoom * punch,
    )
    camera.lookAt(eased.x * 0.12, camY * 0.5, 0)
    camera.updateMatrixWorld()
  }

  /* Where the cursor sits on the plane the mascot lives on. */
  function project() {
    raycaster.setFromCamera(quick, camera)
    const { origin, direction } = raycaster.ray
    const t = -origin.z / direction.z
    head.set(origin.x + direction.x * t, origin.y + direction.y * t, 0)
    probe.x = head.x
    probe.y = head.y
    probe.on = inside && !reduced
  }

  const onMascot = () => {
    const p = rig.pose
    return p.scale > 0.1 && Math.hypot(probe.x - p.x, (probe.y - p.y) * 0.92) < 1.08 * p.scale
  }

  function draw(world, presence, target, dt, introAt) {
    world.update({ time, dt, intro: introAt, presence, width: size.w, height: size.h, pointer: eased, probe })
    world.mascot?.apply(rig.pose)
    renderer.setRenderTarget(target)
    renderer.render(world.scene, camera)
  }

  function step(dt) {
    if (!reduced) time += dt
    eased.lerp(pointer, 1 - Math.exp(-6 * dt))
    const was = quick.x + quick.y * 3
    quick.lerp(pointer, 1 - Math.exp(-30 * dt))
    push = damp(push, Math.min(1, Math.abs(quick.x + quick.y * 3 - was) / Math.max(dt, 0.004) / 5), 8, dt)

    let introAt = Infinity
    let shake = 0
    if (intro >= 0) {
      intro += dt
      if (!reduced) introAt = intro
      if (!kicked && intro > 0.1) {
        kicked = true
        if (!reduced) rig.kick(3.2)
      }
      shake = reduced ? 0 : 0.05 * Math.exp(-intro * 7)
    } else {
      introAt = 0
    }

    if (intro > 2 && !following) prepareRest()
    if (!move && wanted !== current && !ready.has(wanted)) {
      prepareRest()
    } else if (!move && wanted !== current && intro > (reduced ? 0 : 1.1)) {
      move = { from: current, to: wanted, t: 0 }
      setHover(null)
      if (!reduced) rig.kick(-2.2)
    }

    const length = reduced ? 0.35 : SWITCH
    let mix = 0
    let pFrom = 1
    let pTo = 0
    if (move) {
      move.t += dt
      const t = move.t / length
      pFrom = 1 - inOutCubic(span(t, 0, 0.55))
      pTo = outCubic(span(t, 0.3, 0.7))
      mix = smooth(span(t, 0.22, 0.36))
      if (reduced) {
        pFrom = 1
        pTo = 1
        mix = span(t, 0, 1)
      }
    }

    const goal = aim(worlds[move ? move.to : current])
    if (intro >= 0 && introAt < 0.12) goal.scale *= 0.62
    rig.update(goal, time, dt, reduced)
    if (introAt < 1.2) {
      // The entrance overshoots, so it is keyed rather than left to the spring.
      rig.pose.scale = goal.scale * (introAt < 0.12 ? 1 : lerp(0.62, 1, outBack(span(introAt, 0.12, 0.62), 2.2)))
      rig.snap({ ...goal, scale: rig.pose.scale })
    }
    place(dt, shake)
    project()
    if (!reduced) trail.update(head, time, dt, inside && intro > 0.6)
    if (inside && !move && intro > 1) scan()
    rig.setMood(hover?.type === 'mascot' ? 1 : 0)

    if (move) {
      draw(worlds[move.from], pFrom, composite.a, dt, introAt)
      draw(worlds[move.to], pTo, composite.b, dt, introAt)
    } else {
      draw(worlds[current], 1, composite.a, dt, introAt)
    }

    const A = worlds[move ? move.from : current].look
    const B = worlds[move ? move.to : current].look
    const look = {}
    for (const key of Object.keys(A)) look[key] = lerp(A[key], B[key], mix)
    composite.render({ mix, look, time, cursor: quick, push: reduced || !inside ? 0 : push, aspect: layout.aspect })

    if (move && move.t >= length) {
      current = move.to
      move = null
    }
  }

  function loop(now) {
    frame = 0
    if (!running) return
    const raw = previous ? (now - previous) / 1000 : 0.016
    previous = now
    // Drop resolution if the device clearly cannot keep up.
    if (intro > 3 && raw < 0.2) {
      slow = damp(slow, raw > 0.03 ? 1 : 0, 0.8, raw)
      if (slow > 0.75 && ratio > 0.8) {
        ratio = Math.max(0.8, ratio * 0.8)
        slow = 0
        resize()
      }
    }
    step(Math.min(0.05, raw))
    frame = requestAnimationFrame(loop)
  }

  function setHover(next) {
    if (next?.type === hover?.type && next?.item === hover?.item) return
    hover = next
    if (!next || next.type === 'mascot') worlds.forEach(w => w.clearHover?.())
    onHover?.(next)
  }

  /* What is under the cursor right now? Run every frame, because things move. */
  function scan() {
    const world = worlds[current]
    if (world.pick) {
      raycaster.setFromCamera(quick, camera)
      const item = onMascot() ? null : world.pick(raycaster)
      if (item) return setHover({ type: world.kind, item })
    }
    setHover(onMascot() ? { type: 'mascot', item: null } : null)
  }

  const toLocal = e => {
    const r = view.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)]
  }
  const onMove = e => {
    const [x, y] = toLocal(e)
    const now = Math.abs(x) <= 1 && Math.abs(y) <= 1
    if (now && !inside) quick.set(x, y)
    inside = now
    pointer.set(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)))
    if (!now) setHover(null)
  }
  const onLeave = e => {
    if (e.pointerType === 'touch' || !e.relatedTarget) {
      inside = false
      setHover(null)
    }
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
  document.addEventListener('pointerout', onLeave, { passive: true })
  const observer = new ResizeObserver(resize)
  observer.observe(mount)
  resize()

  /* Compile the first world and upload its textures while the loader is still
     up, so the burst cannot stutter. The others are prepared right after it. */
  rig.snap({ ...aim(worlds[0]), scale: 0.62 })
  rig.update(aim(worlds[0]), 0, 0.016, true)
  place(0.016, 0)
  const ready = new Set()
  async function prepare(i) {
    const world = worlds[i]
    if (disposed || ready.has(i)) return
    world.update({ time: 0, dt: 0.016, intro: Infinity, presence: 1, width: size.w, height: size.h, pointer: eased, probe })
    world.mascot?.apply({ ...rig.pose, scale: 1 })
    // Compile for the buffer the world is really drawn into, or it compiles twice.
    renderer.setRenderTarget(composite.b)
    await renderer.compileAsync(world.scene, camera).catch(() => {})
    if (disposed) return
    renderer.setRenderTarget(composite.b)
    renderer.render(world.scene, camera)
    renderer.setRenderTarget(null)
    ready.add(i)
  }
  await prepare(0)
  await prepare(1)

  let following = false
  async function prepareRest() {
    if (following) return
    following = true
    for (let i = 1; i < worlds.length && !disposed; i++) {
      // Whatever scene was asked for goes first.
      if (!ready.has(wanted)) await prepare(wanted)
      await prepare(i)
      await new Promise(r => setTimeout(r, 350))
    }
  }

  const lost = e => {
    e.preventDefault()
    running = false
    cancelAnimationFrame(frame)
    frame = 0
    onLost?.()
  }
  view.addEventListener('webglcontextlost', lost)

  return {
    playIntro(skip = false) {
      intro = skip ? 10 : 0
      kicked = skip
      current = wanted
      rig.snap({ ...aim(worlds[current]), scale: skip ? worlds[current].rig().scale : 0.62 })
      // Draw the first frame right away so the cut from the loader is exact.
      if (running) step(0.0001)
    },
    goTo(i) {
      wanted = i
    },
    /* Returns what was clicked; a clicked mascot jumps. */
    click(e) {
      if (move || intro < 1) return null
      const [x, y] = toLocal(e)
      quick.set(x, y)
      project()
      scan()
      if (hover?.type === 'mascot' && !reduced) rig.hop()
      return hover
    },
    /* A little celebration from whoever is on screen. */
    cheer() {
      if (!reduced) worlds[current]?.cheer?.()
    },
    setRunning(on) {
      if (disposed || on === running) return
      running = on
      previous = 0
      if (on && !frame) frame = requestAnimationFrame(loop)
      if (!on) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    },
    dispose() {
      disposed = true
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerout', onLeave)
      worlds.forEach(world => {
        world.dispose()
        world.scene.traverse(o => {
          o.geometry?.dispose()
          ;[].concat(o.material ?? []).forEach(m => m.dispose())
        })
      })
      trail.dispose()
      composite.dispose()
      view.removeEventListener('webglcontextlost', lost)
      renderer.dispose()
      // Browsers allow only a handful of live contexts, so hand this one back now.
      renderer.forceContextLoss()
      view.remove()
    },
  }
}

// While developing, swap the whole page rather than half an engine.
if (import.meta.hot) import.meta.hot.accept(() => window.location.reload())
