import {
  AmbientLight, CanvasTexture, Color, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PlaneGeometry,
  QuadraticBezierCurve3, RingGeometry, Scene, ShaderMaterial, SRGBColorSpace, TubeGeometry, Vector2, Vector3, DoubleSide,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeEnvironment } from '../light'
import { createMascot } from '../mascot'
import { damp, lerp, outBack, smooth, span } from '../math'
import { FACE } from '../textures'

const W = 2.5
const H = 1.2

/* One spot per role, newest first. */
const WIDE = [
  { x: -3.15, y: 1.12, z: -0.2, ry: 0.3, rz: 0.04 },
  { x: 3.15, y: 1.02, z: -0.2, ry: -0.3, rz: -0.04 },
  { x: -3.0, y: -1.02, z: 0.2, ry: 0.28, rz: -0.03 },
  { x: 3.05, y: -1.06, z: 0.2, ry: -0.28, rz: 0.03 },
]
const TALL = [
  { x: -0.78, y: 3.12, z: -0.4, ry: 0.14, rz: 0.03, s: 0.82 },
  { x: 0.78, y: 2.12, z: -0.4, ry: -0.14, rz: -0.03, s: 0.82 },
  { x: -0.78, y: -1.2, z: -0.3, ry: 0.14, rz: -0.02, s: 0.82 },
  { x: 0.78, y: -2.2, z: -0.2, ry: -0.14, rz: 0.02, s: 0.82 },
]

function plaqueTexture(job) {
  const c = document.createElement('canvas')
  c.width = 1000
  c.height = 480
  const x = c.getContext('2d')
  x.fillStyle = '#07040d'
  x.fillRect(0, 0, 1000, 480)
  // faint scanlines
  x.fillStyle = 'rgba(255,255,255,0.035)'
  for (let y = 0; y < 480; y += 6) x.fillRect(0, y, 1000, 2)
  // corner ticks
  x.strokeStyle = '#ff5cb8'
  x.lineWidth = 5
  for (const [px, py, sx, sy] of [[34, 34, 1, 1], [966, 34, -1, 1], [34, 446, 1, -1], [966, 446, -1, -1]]) {
    x.beginPath()
    x.moveTo(px + 44 * sx, py)
    x.lineTo(px, py)
    x.lineTo(px, py + 44 * sy)
    x.stroke()
  }
  x.textBaseline = 'alphabetic'
  let size = 150
  do {
    size -= 4
    x.font = `800 semi-expanded ${size}px ${FACE}`
  } while (x.measureText(job.company).width > 840)
  x.fillStyle = '#ffffff'
  x.fillText(job.company, 78, 96 + size * 0.74)
  x.font = `600 58px ${FACE}`
  x.fillStyle = '#e7dcff'
  x.fillText(job.role, 80, 322)
  x.font = `500 46px ${FACE}`
  if (job.current) {
    x.fillStyle = '#8df5d6'
    x.beginPath()
    x.arc(94, 384, 13, 0, Math.PI * 2)
    x.fill()
    x.fillText('Current', 124, 400)
  } else {
    x.fillStyle = '#b3a6c9'
    x.fillText((job.period || '').replace('–', 'to'), 80, 400)
  }
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/* Experience: a chrome mascot at the centre of a hot-pink orbit, wired to every
   place it has worked. */
export function createJourneyWorld({ renderer, mascotGeometry, experience }) {
  const scene = new Scene()
  const env = makeEnvironment(renderer, '#4a0f6b', [
    [7, 7, 4, 7, 5, '#ffffff', 4.2],
    [-9, 3, 4, 4, 8, '#ff5cb8', 3.4],
    [0, 9, -5, 14, 4, '#ffd3f0', 2.6],
    [9, -2, -3, 4, 8, '#8a3dff', 2.4],
    [0, -8, 3, 14, 6, '#140420', 0.2],
    [-3, 0, 10, 2, 7, '#1b0730', 0.4],
    [4, 1, 10, 1.2, 6, '#ffffff', 3.6],
  ])
  scene.environment = env.texture
  const key = new DirectionalLight('#ffffff', 1.6)
  key.position.set(4, 5, 4)
  scene.add(key, new AmbientLight('#ff9ad8', 0.5))

  /* Backdrop: a pink sun printed in halftone */
  const sky = new ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uRes: { value: new Vector2(1, 1) }, uP: { value: 0 }, uPointer: { value: new Vector2() } },
    vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: /* glsl */ `
      uniform float uTime, uP; uniform vec2 uRes, uPointer;
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
        vec2 c = uv - uPointer * 0.05;
        float d = length(c * vec2(0.82, 1.0));
        vec3 deep = vec3(0.035, 0.006, 0.075);
        vec3 violet = vec3(0.2, 0.03, 0.42);
        vec3 pink = vec3(1.0, 0.075, 0.36);
        vec3 col = mix(pink, violet, smoothstep(0.16, 0.66, d));
        col = mix(col, deep, smoothstep(0.55, 1.08, d));
        // halftone: dots swell where the glow is strong
        vec2 g = mat2(0.866, -0.5, 0.5, 0.866) * gl_FragCoord.xy / (uRes.y * 0.0125);
        float dot_ = length(fract(g) - 0.5);
        float swell = smoothstep(0.95, 0.12, d + 0.05 * sin(uTime * 0.8 + d * 9.0));
        float ink = smoothstep(0.5 * swell + 0.04, 0.5 * swell - 0.04, dot_);
        col = mix(col * 0.78, col * 1.12 + vec3(0.05, 0.0, 0.05), ink);
        // slow rays
        float a = atan(c.y, c.x);
        col *= 0.93 + 0.07 * sin(a * 14.0 + uTime * 0.25);
        gl_FragColor = vec4(col * uP, 1.0);
      }`,
  })
  const skyMesh = new Mesh(new PlaneGeometry(2, 2), sky)
  skyMesh.frustumCulled = false
  skyMesh.renderOrder = -1000
  scene.add(skyMesh)

  /* Chrome mascot */
  const mats = {
    body: new MeshPhysicalMaterial({ color: '#ffffff', metalness: 1, roughness: 0.09, envMapIntensity: 1.15 }),
    ring: new MeshPhysicalMaterial({ color: '#ffb3dd', metalness: 1, roughness: 0.14, envMapIntensity: 1.2 }),
    accent: new MeshPhysicalMaterial({ color: '#8df5d6', metalness: 0.5, roughness: 0.18, clearcoat: 1, envMapIntensity: 1.1 }),
    eye: new MeshPhysicalMaterial({ color: '#05030a', roughness: 0.1, clearcoat: 1, envMapIntensity: 0.9 }),
    glint: new MeshBasicMaterial({ color: '#ffffff' }),
  }
  const mascot = createMascot(mascotGeometry, mats)
  scene.add(mascot.root)

  /* Orbits */
  const orbits = new Group()
  orbits.rotation.set(-1.22, 0, 0)
  scene.add(orbits)
  const orbitMat = new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.36, side: DoubleSide, depthWrite: false })
  const moons = [1.65, 1.95, 2.25].map((r, i) => {
    const ring = new Mesh(new RingGeometry(r, r + 0.014, 160), orbitMat)
    orbits.add(ring)
    const moon = new Mesh(mascotGeometry.ball, i === 1 ? mats.accent : mats.body)
    moon.scale.setScalar(0.1 + i * 0.03)
    orbits.add(moon)
    return { moon, r, v: 0.5 - i * 0.13, o: i * 2.1 }
  })

  /* Plaques and the wires that join them to the mascot */
  const shell = new RoundedBoxGeometry(W, H, 0.2, 5, 0.09)
  const face = new PlaneGeometry(W - 0.1, H - 0.1)
  const textures = []
  const plaques = experience.slice(0, 4).map((job, i) => {
    const tex = plaqueTexture(job)
    textures.push(tex)
    const gloss = new MeshPhysicalMaterial({ color: '#0a0612', roughness: 0.16, clearcoat: 1, envMapIntensity: 1.1 })
    const group = new Group()
    const body = new Mesh(shell, gloss)
    const front = new Mesh(face, new MeshBasicMaterial({ map: tex }))
    front.position.z = 0.104
    group.add(body, front)
    body.userData.job = job
    front.userData.job = job
    scene.add(group)
    const wireMat = new ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uOn: { value: 0 }, uHot: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: /* glsl */ `
        varying vec2 vUv; uniform float uTime, uOn, uHot;
        void main() {
          float pulse = smoothstep(0.86, 1.0, fract(vUv.x * 1.6 - uTime * (0.45 + uHot * 0.9)));
          float a = (0.34 + pulse * 1.5 + uHot * 0.5) * step(vUv.x, uOn);
          gl_FragColor = vec4(mix(vec3(1.0), vec3(0.55, 0.96, 0.84), uHot) * (1.0 + pulse), min(a, 1.0));
        }`,
    })
    return { job, group, wire: new Mesh(undefined, wireMat), wireMat, hover: 0, i }
  })
  plaques.forEach(p => scene.add(p.wire))

  let layout = null
  let spots = WIDE
  let hovered = null

  function wire() {
    plaques.forEach((p, i) => {
      const s = spots[i]
      if (!s) return
      p.wire.geometry?.dispose()
      // Stop at the card's near edge, so wires never run across its text.
      const end = layout.tall
        ? new Vector3(s.x * 0.35, s.y - Math.sign(s.y) * 0.5, s.z - 0.3)
        : new Vector3(s.x - Math.sign(s.x) * 1.16, s.y * 0.9, s.z - 0.35)
      const mid = new Vector3(s.x * 0.42, s.y * 1.25, -0.9)
      p.wire.geometry = new TubeGeometry(new QuadraticBezierCurve3(new Vector3(0, 0, -0.5), mid, end), 40, 0.014, 6)
    })
  }

  return {
    scene,
    mascot,
    trail: ['#ffffff', '#8df5d6', 1.15],
    look: { bloom: 0.32, threshold: 1.25, vignette: 0.4, aberration: 0.5 },
    camera: { zoom: 1, y: 0.05 },
    rig: () => ({ x: 0, y: layout?.tall ? 0.42 : -0.05, z: 0, scale: layout?.tall ? 0.66 : 0.92, yaw: 0, pitch: 0.06, roll: 0.02 }),
    resize(next) {
      layout = next
      spots = next.tall ? TALL : WIDE
      wire()
    },
    pick(raycaster) {
      const hit = raycaster.intersectObjects(plaques.map(p => p.group), true)[0]
      hovered = hit?.object.userData.job ?? null
      return hovered
    },
    clearHover() {
      hovered = null
    },
    update({ time, dt, presence, width, height, pointer }) {
      const p = smooth(presence)
      sky.uniforms.uTime.value = time
      sky.uniforms.uRes.value.set(width, height)
      sky.uniforms.uP.value = lerp(0.25, 1, p)
      sky.uniforms.uPointer.value.copy(pointer)
      orbits.rotation.z = time * 0.04
      orbits.scale.setScalar(lerp(0.4, layout.tall ? 0.7 : 1, p))
      moons.forEach(m => m.moon.position.set(Math.cos(time * m.v + m.o) * m.r, Math.sin(time * m.v + m.o) * m.r, 0))
      const fitY = layout.tall ? Math.min(1, layout.halfH / 3.86) : 1
      plaques.forEach((q, i) => {
        const s = spots[i]
        const e = outBack(span(presence, 0.15 + i * 0.1, 0.55), 1.7)
        q.hover = damp(q.hover, hovered === q.job ? 1 : 0, 11, dt)
        q.group.visible = e > 0
        q.group.position.set(s.x * lerp(0.2, 1, e), s.y * fitY * lerp(0.2, 1, e) + Math.sin(time * 0.9 + i * 1.7) * 0.06, s.z + q.hover * 0.55)
        q.group.rotation.set(
          pointer.y * -0.14 + Math.sin(time * 0.7 + i) * 0.03,
          lerp(s.ry, s.ry * 0.25, q.hover) + pointer.x * 0.16 + (1 - e) * 2.4,
          s.rz * (1 - q.hover),
        )
        q.group.scale.setScalar(Math.max(0.0001, e * (s.s ?? 1) * (1 + q.hover * 0.07)))
        q.wireMat.uniforms.uTime.value = time
        q.wireMat.uniforms.uOn.value = span(presence, 0.3 + i * 0.08, 0.4)
        q.wireMat.uniforms.uHot.value = q.hover
        q.wire.scale.set(1, fitY, 1)
      })
    },
    dispose() {
      env.dispose()
      textures.forEach(t => t.dispose())
    },
  }
}
