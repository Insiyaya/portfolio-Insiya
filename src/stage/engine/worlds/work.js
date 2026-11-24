import {
  BoxGeometry, BufferGeometry, CapsuleGeometry, CatmullRomCurve3, Color, CylinderGeometry, DataTexture, Float32BufferAttribute, Group,
  LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Scene, ShaderMaterial,
  SRGBColorSpace, TubeGeometry, Vector3,
} from 'three'
import { addRim, makeEnvironment } from '../light'
import { createMascot } from '../mascot'
import { damp, lerp, outBack, seeded, smooth, span } from '../math'
import { lineTexture, signTexture } from '../textures'

const FLOOR_Y = -1.72

/* id must match a project id in data.js; entries without one are dead channels. */
const WIDE = [
  { id: 'twofolds', w: 2.5, h: 1.3, x: 0.02, y: 1.46, z: -1.5, ry: 0, rz: 0.012 },
  { id: 'tripcraft', w: 2.1, h: 1.35, x: -2.35, y: 1.06, z: -1.1, ry: 0.22, rz: 0.035 },
  { id: 'beehive', w: 2.1, h: 1.4, x: 2.55, y: 1.04, z: -1.1, ry: -0.22, rz: -0.035 },
  { id: 'savour', w: 1.45, h: 0.95, x: -3.75, y: -0.84, z: -0.7, ry: 0.34, rz: -0.03 },
  { id: 'talawa', w: 1.6, h: 1.0, x: -1.95, y: -1.2, z: -0.6, ry: 0.16, rz: 0 },
  { id: 'biscuit', w: 1.9, h: 1.15, x: 2.1, y: -1.12, z: -0.6, ry: -0.16, rz: 0 },
  { id: 'jumble', w: 1.4, h: 1.05, x: 3.9, y: -0.86, z: -0.6, ry: -0.36, rz: 0.03 },
  { id: 'roboshots', w: 1.5, h: 0.95, x: -4.6, y: 1.0, z: -2, ry: 0.4, rz: 0.06 },
  { w: 2.2, h: 1.1, x: 0, y: 0.02, z: -2.2, ry: 0, rz: 0 },
  { w: 1.3, h: 1.0, x: 4.3, y: 0.95, z: -2, ry: -0.4, rz: -0.05 },
]
const TALL = [
  { id: 'twofolds', w: 2.8, h: 0.9, x: 0, y: 3.02, z: -1.2, ry: 0, rz: 0.015 },
  { id: 'tripcraft', w: 1.85, h: 0.95, x: -1.02, y: 2.02, z: -1.2, ry: 0.16, rz: 0.02 },
  { id: 'beehive', w: 1.75, h: 0.95, x: 1.06, y: 2.02, z: -1.2, ry: -0.16, rz: -0.02 },
  { id: 'biscuit', w: 1.85, h: 1.0, x: -1.02, y: 0.92, z: -1.2, ry: 0.16, rz: -0.02 },
  { id: 'roboshots', w: 1.75, h: 0.9, x: 1.06, y: 0.95, z: -1.2, ry: -0.16, rz: 0.02 },
  { id: 'savour', w: 1.35, h: 0.78, x: -1.32, y: -0.56, z: -0.6, ry: 0.22, rz: 0.02 },
  { id: 'talawa', w: 1.35, h: 0.74, x: -1.3, y: -1.38, z: -0.5, ry: 0.22, rz: 0 },
  { id: 'jumble', w: 1.35, h: 0.95, x: 1.34, y: -0.64, z: -0.6, ry: -0.22, rz: -0.02 },
  { w: 1.3, h: 0.56, x: 1.34, y: -1.44, z: -0.5, ry: -0.22, rz: 0 },
]

function signMaterial(map, seed, accent, blank) {
  return new ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uTime: { value: 0 }, uSeed: { value: seed }, uDim: { value: 1 }, uOn: { value: 0 },
      uHover: { value: 0 }, uAccent: { value: new Color(accent) }, uBlank: { value: blank ? 1 : 0 },
    },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform sampler2D uMap; uniform float uTime, uSeed, uDim, uOn, uHover, uBlank; uniform vec3 uAccent;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uSeed * 4.1) * 43758.5453); }
      void main() {
        float beat = mod(uTime + uSeed * 3.7, 9.0);
        float dead = max(step(beat, 0.55), uBlank);
        float tear = step(8.1, beat) * (1.0 - uHover);
        vec2 uv = vUv;
        float band = floor(uv.y * 22.0);
        uv.x += (hash(vec2(band, floor(uTime * 16.0))) - 0.5) * 0.16 * tear;
        float shift = 0.012 * tear + 0.004 * uHover;
        vec3 c = vec3(texture2D(uMap, uv + vec2(shift, 0.0)).r, texture2D(uMap, uv).g, texture2D(uMap, uv - vec2(shift, 0.0)).b);
        float n = hash(floor(vUv * vec2(170.0, 120.0)) + floor(uTime * 22.0));
        float roll = smoothstep(0.0, 0.2, abs(fract(vUv.y - uTime * 0.18) - 0.5));
        c = mix(c, vec3(n * n * 0.62) * mix(0.5, 1.0, roll), dead * (1.0 - uHover * (1.0 - uBlank)));
        c *= 0.93 + 0.07 * sin(vUv.y * 420.0);
        vec2 e = abs(vUv - 0.5) * 2.0;
        c *= 1.0 - 0.22 * pow(max(e.x, e.y), 6.0);
        c += uAccent * uHover * smoothstep(0.93, 1.0, max(e.x, e.y)) * 1.4;
        gl_FragColor = vec4(c * uOn * uDim * mix(0.78, 1.0, uHover), 1.0);
      }`,
  })
}

export function createWorkWorld({ renderer, mascotGeometry, projects }) {
  const scene = new Scene()
  scene.background = new Color('#010102')
  const env = makeEnvironment(renderer, '#020204', [
    [0, 9, -4, 10, 3, '#ffffff', 2],
    [9, 2, -5, 2, 8, '#b9a6ff', 2],
    [-9, 2, -5, 2, 8, '#ff7ccb', 1.4],
  ])
  scene.environment = env.texture

  const dark = addRim(new MeshPhysicalMaterial({ color: '#050507', roughness: 0.5, envMapIntensity: 0.45 }), { color: '#f4f0ff', strength: 0.95, power: 3, dir: [0, 0.6, 0.2], wrap: 0.5 })
  const mats = {
    body: dark,
    ring: addRim(new MeshPhysicalMaterial({ color: '#12040c', roughness: 0.3, envMapIntensity: 0.6 }), { color: '#ff4fb4', strength: 1.5, power: 1.8, dir: [0, 0.6, 0.2], wrap: 0.6 }),
    accent: addRim(new MeshPhysicalMaterial({ color: '#04110d', roughness: 0.3, envMapIntensity: 0.6 }), { color: '#8df5d6', strength: 1.5, power: 1.6, dir: [0, 0.4, 0.4], wrap: 0.7 }),
    eye: new MeshPhysicalMaterial({ color: '#000000', roughness: 0.1, clearcoat: 1, envMapIntensity: 1.4 }),
    glint: new MeshBasicMaterial({ color: '#ffffff' }),
  }
  const mascot = createMascot(mascotGeometry, mats)
  scene.add(mascot.root)

  /* ── Screens ── */
  const blank = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
  blank.colorSpace = SRGBColorSpace
  blank.needsUpdate = true
  const casing = new MeshStandardMaterial({ color: '#0a0a0d', roughness: 0.45, metalness: 0.3, envMapIntensity: 0.6 })
  const box = new BoxGeometry(1, 1, 1)
  const stack = new Group()
  const mirror = new Group()
  scene.add(stack, mirror)
  mirror.scale.y = -1
  mirror.position.y = FLOOR_Y * 2

  const textures = []
  let signs = []

  function build(list) {
    for (const s of signs) {
      stack.remove(s.mesh)
      mirror.remove(s.ghost)
      s.front.dispose()
      s.back.dispose()
    }
    textures.splice(0).forEach(t => t.dispose())
    signs = list.map((spec, i) => {
      const project = projects.find(p => p.id === spec.id)
      let map = blank
      if (project) {
        map = signTexture({ title: project.title, kind: project.kind, aspect: spec.w / spec.h, dark: i % 3 === 1, accent: '#c4007a' })
        textures.push(map)
      }
      const front = signMaterial(map, i * 1.37 + 0.4, project?.accent ?? '#ffffff', !project)
      const back = signMaterial(map, i * 1.37 + 0.4, '#000000', !project)
      back.uniforms.uDim.value = 0.13
      const place = (mesh, parent) => {
        mesh.position.set(spec.x, spec.y, spec.z)
        mesh.rotation.set(0, spec.ry, spec.rz)
        mesh.scale.set(spec.w, spec.h, 0.36)
        parent.add(mesh)
        return mesh
      }
      const mesh = place(new Mesh(box, [casing, casing, casing, casing, front, casing]), stack)
      const ghost = place(new Mesh(box, [casing, casing, casing, casing, back, casing]), mirror)
      mesh.userData.project = project ?? null
      return { mesh, ghost, front, back, spec, project, hover: 0 }
    })
  }

  /* ── Band of type that wraps around the viewer ── */
  const bandText = projects.map(p => p.title.toUpperCase()).join('   ') + '   '
  const band = lineTexture(bandText, { ink: '#ffffff', cut: true, size: 150, font: '800 semi-expanded', pad: 0.08 })
  const RADIUS = 5.4
  const BAND_H = 0.29
  band.tex.repeat.x = Math.max(1, Math.round((Math.PI * 2 * RADIUS) / (BAND_H * band.aspect)))
  const bandGeo = new CylinderGeometry(RADIUS, RADIUS, BAND_H, 128, 1, true)
  bandGeo.scale(-1, 1, 1)
  const bandMesh = new Mesh(bandGeo, new MeshBasicMaterial({ map: band.tex, transparent: true, alphaTest: 0.25 }))
  bandMesh.position.set(0, 0.03, 5)
  scene.add(bandMesh)

  /* ── Cables, strip lights and drifting outlines ── */
  const rand = seeded(29)
  const cableMat = new MeshStandardMaterial({ color: '#26242e', roughness: 0.4, metalness: 0.2, envMapIntensity: 1.4 })
  const cables = new Group()
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? 1 : -1
    const x0 = side * (1.2 + rand() * 4.2)
    const x1 = x0 + side * (rand() - 0.3) * 2
    const drop = -0.6 - rand() * 1.1
    const z = -2.6 + rand() * 1.4
    const curve = new CatmullRomCurve3([
      new Vector3(x0, 4, z), new Vector3(x0 + (rand() - 0.5) * 0.3, 1.2, z), new Vector3((x0 + x1) / 2, drop, z + 0.2), new Vector3(x1, 1 + rand(), z), new Vector3(x1 + 0.2, 4, z),
    ])
    cables.add(new Mesh(new TubeGeometry(curve, 48, 0.012, 6), cableMat))
  }
  scene.add(cables)

  const stripMat = new MeshBasicMaterial({ color: new Color('#ffffff').multiplyScalar(1.5) })
  const strip = new CapsuleGeometry(0.035, 0.95, 6, 14)
  const strips = [
    [-0.42, 0.78, -0.6, -1.05], [0.5, 0.82, -0.8, 1.35], [0.88, 0.34, 0.2, -0.7], [-0.88, 0.2, 0.3, 0.55],
  ].map(([x, y, z, rz]) => {
    const mesh = new Mesh(strip, stripMat)
    mesh.rotation.z = rz
    scene.add(mesh)
    return { mesh, x, y, z }
  })

  const outlines = []
  const shape = sides => {
    const pts = []
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 + Math.PI / 2
      pts.push(Math.cos(a), Math.sin(a), 0)
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(pts, 3))
    return g
  }
  const shapes = [shape(3), shape(6), shape(4)]
  const inks = ['#ff2daa', '#8df5d6', '#8f6bff'].map(c => new LineBasicMaterial({ color: new Color(c).multiplyScalar(1.3) }))
  for (let i = 0; i < 26; i++) {
    const mesh = new LineLoop(shapes[i % 3], inks[(i * 5) % 3])
    mesh.scale.setScalar(0.05 + rand() * 0.1)
    scene.add(mesh)
    outlines.push({ mesh, x: rand() * 2 - 1, y: rand(), z: -1.5 + rand() * 3.6, v: 0.02 + rand() * 0.04, spin: (rand() - 0.5) * 0.8 })
  }

  let layout = null
  let hovered = null
  build(WIDE)

  return {
    scene,
    mascot,
    look: { bloom: 0.55, threshold: 0.8, vignette: 0.5, aberration: 1 },
    trail: ['#8df5d6', '#ff2da0', 1.4],
    camera: { zoom: 1, y: 0 },
    rig: () => ({ x: 0, y: layout?.tall ? -1.02 : -0.62, z: 0.7, scale: layout?.tall ? 0.46 * Math.min(1, Math.max(0.72, layout.halfH / 3.72)) : 0.7, yaw: 0.12, pitch: 0.02, roll: 0.04 }),
    resize(next) {
      const flipped = !layout || layout.tall !== next.tall
      layout = next
      if (flipped) build(next.tall ? TALL : WIDE)
      // Upright tablets are wider than phones, so the stack is scaled to fit their height.
      const fit = next.tall ? Math.min(1, next.halfH / 3.72) : 1
      stack.scale.set(fit, fit, 1)
      mirror.scale.set(fit, -fit, 1)
    },
    pick(raycaster) {
      const hit = raycaster.intersectObjects(signs.map(s => s.mesh), false)[0]
      hovered = hit?.object.userData.project ?? null
      return hovered
    },
    clearHover() {
      hovered = null
    },
    update({ time, dt, presence }) {
      signs.forEach((s, i) => {
        s.hover = damp(s.hover, hovered && s.project === hovered ? 1 : 0, 12, dt)
        const on = smooth(span(presence, 0.25 + i * 0.06, 0.12))
        for (const m of [s.front, s.back]) {
          m.uniforms.uTime.value = time
          m.uniforms.uOn.value = on
        }
        s.front.uniforms.uHover.value = s.hover
        const pop = outBack(span(presence, i * 0.05, 0.5), 1.3)
        const grow = 1 + s.hover * 0.05
        for (const m of [s.mesh, s.ghost]) {
          m.scale.set(s.spec.w * grow * lerp(0.6, 1, pop), s.spec.h * grow * lerp(0.6, 1, pop), 0.36)
          m.position.z = s.spec.z + s.hover * 0.22
        }
      })
      bandMesh.rotation.y = time * 0.05 + (1 - smooth(presence)) * 0.8
      bandMesh.visible = presence > 0.3
      strips.forEach(({ mesh, x, y, z }, i) => {
        mesh.position.set(x * layout.halfW, y * layout.halfH, z)
        mesh.visible = span(presence, 0.45 + i * 0.07, 0.05) > 0.5 && !layout.tall
      })
      outlines.forEach(o => {
        const y = (o.y + time * o.v) % 1
        o.mesh.position.set(o.x * layout.halfW * 1.05, lerp(-layout.halfH, layout.halfH, y), o.z)
        o.mesh.rotation.set(time * o.spin, time * o.spin * 1.3, time * o.spin)
        o.mesh.visible = presence > 0.4
      })
    },
    dispose() {
      env.dispose()
      textures.forEach(t => t.dispose())
      band.tex.dispose()
    },
  }
}
