import {
  AmbientLight, BoxGeometry, Color, DirectionalLight, DynamicDrawUsage, Group, InstancedMesh, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, Scene, ShaderMaterial, SphereGeometry, TorusKnotGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createBackdrop } from '../backdrop'
import { letterGeometry } from '../glyphs'
import { addRim, makeEnvironment } from '../light'
import { createDodge } from '../dodge'
import { createMascot } from '../mascot'
import { wordTexture } from '../words'
import { clamp01, damp, inCubic, lerp, outBack, outCubic, seeded, smooth, span } from '../math'

const FLOOR_Y = -1.75
const COLS = 15
const ROWS = 9
const SUNK = 3 // rows that start below the frame, so the wall reads as full height
const CELL = 0.3

/* Where each item rests. x and y are fractions of the visible half-width and
   half-height, so the composition holds at any window shape. */
const WIDE = [
  { char: 'I', x: -0.86, y: 0.0, z: 0, rot: [0.1, 0.35, 0.24], at: 0.54 },
  { char: 'N', x: -0.66, y: 0.44, z: -0.4, rot: [-0.12, 0.28, -0.14], at: 0.48 },
  { char: 'S', x: -0.47, y: -0.2, z: -0.5, rot: [0.1, 0.32, 0.12], at: 0.42 },
  { char: 'I', x: 0.45, y: -0.14, z: -0.4, rot: [0.05, -0.35, -0.18], at: 0.38 },
  { char: 'Y', x: 0.61, y: 0.42, z: -0.4, rot: [0.08, -0.28, 0.12], at: 0.32 },
  { char: 'A', x: 0.79, y: -0.1, z: 0, rot: [-0.06, -0.3, -0.16], at: 0.26 },
]
const TALL = [
  { char: 'I', x: -0.72, y: 0.66, z: 0, rot: [0.1, 0.2, 0.18], at: 0.54 },
  { char: 'N', x: -0.12, y: 0.72, z: 0, rot: [-0.1, 0.1, -0.08], at: 0.48 },
  { char: 'S', x: 0.62, y: 0.64, z: 0, rot: [0.1, -0.2, 0.12], at: 0.42 },
  { char: 'I', x: -0.7, y: -0.52, z: 0, rot: [0, 0.2, -0.16], at: 0.38 },
  { char: 'Y', x: -0.1, y: -0.58, z: 0, rot: [0.1, 0, 0.08], at: 0.32 },
  { char: 'A', x: 0.64, y: -0.5, z: 0, rot: [0, -0.2, -0.12], at: 0.26 },
]

export function createNameWorld({ renderer, mascotGeometry, acronym }) {
  const scene = new Scene()
  const env = makeEnvironment(renderer, '#0b0713', [
    [9, 5, 3, 9, 7, '#ffe9fb', 5],
    [-10, 2, 3, 5, 9, '#5a32d6', 1.1],
    [2, 11, -2, 12, 5, '#d9c9ff', 2.2],
    [5, -3, -9, 12, 6, '#ff2daa', 2.6],
    [-4, 6, 9, 3, 2, '#ffffff', 2.4],
  ], 0.05)
  scene.environment = env.texture

  const backdrop = createBackdrop(1)
  scene.add(backdrop.mesh)

  const key = new DirectionalLight('#fff4fd', 3)
  key.position.set(6, 3.6, 1.4)
  const back = new DirectionalLight('#ff6cc9', 0.9)
  back.position.set(-3, 2, -5)
  scene.add(key, back, new AmbientLight('#6f55c9', 0.22))

  /* ── Mascot ── */
  const mats = {
    body: addRim(new MeshPhysicalMaterial({ color: '#b7a0ff', roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.45, envMapIntensity: 0.62 }), { color: '#fff3ff', strength: 1.7, power: 2, dir: [0.9, 0.3, 0.1], wrap: 0.28 }),
    ring: addRim(new MeshPhysicalMaterial({ color: '#ff2f9f', roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2, envMapIntensity: 0.9 }), { color: '#ffd9f1', strength: 0.8, power: 2.4 }),
    accent: addRim(new MeshPhysicalMaterial({ color: '#8df5d6', roughness: 0.35, clearcoat: 0.5, envMapIntensity: 0.9 }), { color: '#ffffff', strength: 0.8 }),
    eye: new MeshPhysicalMaterial({ color: '#08060c', roughness: 0.12, clearcoat: 1, envMapIntensity: 1.2 }),
    glint: new MeshBasicMaterial({ color: '#ffffff' }),
  }
  const mascot = createMascot(mascotGeometry, mats)
  scene.add(mascot.root)

  /* ── Letters of the name ── */
  const letterMat = new MeshStandardMaterial({ color: '#a8a4b4', roughness: 0.75, envMapIntensity: 0.4, emissive: '#f1eff7', emissiveIntensity: 0.5 })
  const geos = Object.fromEntries([...new Set('INSIYA')].map(c => [c, letterGeometry(c, 1.4, 0.42)]))
  const white = new Color('#f1eff7')
  // Each letter has the word it stands for printed along its stroke.
  const letters = acronym.map((entry, i) => {
    const tex = wordTexture(entry.letter, entry.word)
    const face = letterMat.clone()
    face.map = tex
    face.emissiveMap = tex
    const mesh = new Mesh(geos[entry.letter], [face, letterMat.clone()])
    mesh.userData.item = { index: i }
    scene.add(mesh)
    return { mesh, i, tex, hot: new Color(entry.color), h: 0 }
  })
  let hovered = null

  /* ── Props ── */
  const glossy = new MeshPhysicalMaterial({ color: '#09070e', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1 })
  const ballMat = addRim(new MeshPhysicalMaterial({ color: '#86f0cf', roughness: 0.34, clearcoat: 0.4, envMapIntensity: 0.85 }), { color: '#ffffff', strength: 1.1, power: 2.2 })
  const ball = new Mesh(new SphereGeometry(1, 64, 48), ballMat)
  const knot = new Mesh(new TorusKnotGeometry(0.34, 0.125, 160, 28, 2, 3), glossy)
  const cube = new Mesh(new RoundedBoxGeometry(0.78, 0.78, 0.78, 5, 0.1), glossy)
  scene.add(ball, knot, cube)

  /* ── Floor grid ── */
  const floorMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uAlpha: { value: 0 }, uColor: { value: new Color('#8f6bff') } },
    vertexShader: `varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      varying vec3 vW; uniform float uAlpha; uniform vec3 uColor;
      void main() {
        vec2 p = vW.xz / 0.62;
        vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        float fade = smoothstep(11.0, 1.5, length(vW.xz - vec2(0.0, 1.5)));
        gl_FragColor = vec4(uColor, line * fade * uAlpha);
      }`,
  })
  const floor = new Mesh(new PlaneGeometry(40, 40), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = FLOOR_Y
  scene.add(floor)

  /* ── The wall that shatters ── */
  const count = COLS * ROWS
  const wall = new Group()
  const cubes = new InstancedMesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: '#000000' }), count)
  const glow = new InstancedMesh(new BoxGeometry(1, 1, 0.2), new MeshBasicMaterial({ color: '#ffffff' }), count)
  cubes.instanceMatrix.setUsage(DynamicDrawUsage)
  glow.instanceMatrix.setUsage(DynamicDrawUsage)
  cubes.frustumCulled = false
  glow.frustumCulled = false
  const rand = seeded(11)
  const cells = []
  const tint = new Color()
  const ends = [new Color('#39e6ff'), new Color('#ffffff'), new Color('#ff3fb8')]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const u = clamp01(c / (COLS - 1) + (rand() - 0.5) * 0.35)
      tint.lerpColors(u < 0.5 ? ends[0] : ends[1], u < 0.5 ? ends[1] : ends[2], u < 0.5 ? u * 2 : (u - 0.5) * 2).multiplyScalar(1.5)
      const i = cells.length
      glow.setColorAt(i, tint)
      cells.push({
        x: (c - (COLS - 1) / 2) * CELL,
        y: FLOOR_Y + (r - SUNK + 0.5) * CELL,
        top: r === ROWS - 1,
        delay: rand() * 0.2 + Math.abs(c - (COLS - 1) / 2) * 0.012 + (ROWS - r) * 0.012,
        spin: (rand() - 0.5) * 2.4,
      })
    }
  }
  wall.add(cubes, glow)
  wall.position.z = -0.95
  scene.add(wall)

  const dummy = new Object3D()
  function placeWall(t) {
    const open = outCubic(span(t, 0.95, 0.4))
    cells.forEach((cell, i) => {
      const fall = inCubic(span(t, 1.2 + cell.delay, 0.36))
      const s = Math.max(0, (1 - open * 0.13) * (1 - fall))
      dummy.position.set(cell.x, cell.y, fall * 0.5)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(s * CELL, s * CELL, s * CELL)
      dummy.updateMatrix()
      cubes.setMatrixAt(i, dummy.matrix)
      // The backing starts a hair larger than its cube, so the first thing seen
      // is a bright hairline on the wall's top edge, then lines in the gaps.
      const g = fall >= 1 ? 0 : s + (cell.top ? 0.1 : 0) * (1 - open) + open * 0.14
      dummy.position.z = fall * 0.5 + s * CELL * 0.5 - 0.03
      dummy.scale.set(g * CELL, g * CELL, 0.08)
      dummy.updateMatrix()
      glow.setMatrixAt(i, dummy.matrix)
    })
    cubes.instanceMatrix.needsUpdate = true
    glow.instanceMatrix.needsUpdate = true
  }
  placeWall(0)

  let layout = null
  let spots = WIDE

  /* Brings one item from the mascot's centre out to its resting place. */
  const dodges = new Map()
  let probe = { on: false }
  let dt = 0.016
  function settle(mesh, home, rot, scale, e, presence, spin, time, seed) {
    // Letters hold still so they can be clicked; the props get out of the way.
    if (!dodges.has(mesh)) dodges.set(mesh, createDodge(mesh.userData.item ? { radius: 1, force: 0, twist: 0 } : { radius: 1.35, force: 34 }))
    const d = dodges.get(mesh).update(home[0], home[1], e >= 1 && presence >= 1 ? probe : { on: false }, dt)
    const out = outBack(e, 2.1)
    const keep = smooth(presence)
    const bob = Math.sin(time * 1.1 + seed * 2.1) * 0.06
    mesh.position.set(
      lerp(0, home[0], out) * lerp(0.42, 1, keep) + d.x,
      lerp(-0.1, home[1], out) * lerp(0.42, 1, keep) + bob * e + d.y,
      lerp(-0.6, home[2], out) + lerp(-5, 0, keep) + d.near * 0.35,
    )
    const s = Math.max(0.0001, outBack(e, 2.4) * scale * (1 + d.near * 0.08))
    mesh.scale.setScalar(s)
    const k = 1 - outCubic(e)
    mesh.rotation.set(
      rot[0] + k * spin + Math.sin(time * 0.6 + seed) * 0.06,
      rot[1] + k * spin * 1.4 + Math.sin(time * 0.5 + seed * 1.7) * 0.1 + d.turn,
      rot[2] + k * spin * 0.8 + Math.sin(time * 0.7 + seed * 0.6) * 0.04,
    )
    mesh.visible = e > 0
  }

  return {
    scene,
    mascot,
    kind: 'letter',
    pick(raycaster) {
      const hit = raycaster.intersectObjects(letters.map(l => l.mesh), false)[0]
      hovered = hit?.object.userData.item ?? null
      return hovered
    },
    clearHover() {
      hovered = null
    },
    look: { bloom: 0.42, threshold: 1.1, vignette: 0.5, aberration: 0.3 },
    trail: ['#ff2da0', '#ffb14a', 1.25],
    camera: { zoom: 1, y: 0.15 },
    rig: () => ({ x: 0, y: layout?.tall ? 0.35 : -0.02, z: 0, scale: layout?.tall ? 0.86 : 1.1, yaw: -0.42, pitch: 0.1, roll: -0.1 }),
    resize(next) {
      layout = next
      spots = next.tall ? TALL : WIDE
    },
    /* `intro` is seconds since the loader landed; Infinity once it has played. */
    update({ time, intro, presence, width, height, probe: cursor, dt: delta }) {
      probe = cursor
      dt = delta
      backdrop.update(time, width, height)
      backdrop.setLevel(lerp(0.2, 1, smooth(presence)))
      floorMat.uniforms.uAlpha.value = smooth(span(intro, 0.15, 0.8)) * 0.5 * presence
      wall.visible = intro < 2
      if (wall.visible) placeWall(intro)

      const hw = Math.min(layout.halfW, 5.5)
      const hh = layout.halfH
      const k = layout.tall ? (hw / 2.1) * 0.86 : 1
      letters.forEach(l => {
        const { mesh, i } = l
        const s = spots[i]
        settle(mesh, [s.x * hw, s.y * hh, s.z], s.rot, k, span(intro, s.at, 0.8), presence, i % 2 ? 2.6 : -2.6, time, i)
        // Under the cursor a letter turns to face you and comes closer, so its word can be read.
        l.h = damp(l.h, hovered?.index === i ? 1 : 0, 9, delta)
        mesh.scale.multiplyScalar(1 + l.h * 0.24)
        mesh.position.z += l.h * 0.75
        mesh.rotation.set(mesh.rotation.x * (1 - l.h), mesh.rotation.y * (1 - l.h), mesh.rotation.z * (1 - l.h * 0.75))
        // Every few seconds a glow runs along the name, as an invitation.
        const beat = intro > 4 ? span((time % 7) - i * 0.16, 0, 0.6) : 0
        const near = Math.max(l.h, Math.sin(beat * Math.PI) * 0.55)
        mesh.material.forEach((m, side) => {
          m.emissive.lerpColors(white, l.hot, near)
          m.emissiveIntensity = (side ? 0.5 : 0.74) + near * 0.3
        })
      })
      const tall = layout.tall
      settle(ball, tall ? [-hw * 0.62, -hh * 0.16, -1.2] : [-hw * 0.78, -hh * 0.72, 0.5], [0, 0, 0], tall ? 0.5 : 0.82, span(intro, 0.12, 0.8), presence, 0, time, 8)
      settle(knot, tall ? [hw * 0.62, hh * 0.28, -1] : [hw * 0.4, hh * 0.72, -1], [time * 0.4, time * 0.5, 0], tall ? 0.8 : 1, span(intro, 0.18, 0.8), presence, 3, time, 9)
      settle(cube, tall ? [hw * 0.66, -hh * 0.14, -0.6] : [hw * 0.66, -hh * 0.6, 0.3], [time * 0.22, time * 0.3, 0.2], tall ? 0.7 : 1, span(intro, 0.15, 0.8), presence, -3, time, 10)
    },
    dispose() {
      env.dispose()
      letters.forEach(l => l.tex.dispose())
    },
  }
}
