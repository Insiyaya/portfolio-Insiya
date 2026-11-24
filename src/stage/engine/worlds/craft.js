import {
  AmbientLight, Color, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, OctahedronGeometry,
  PlaneGeometry, Scene, TorusKnotGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeEnvironment } from '../light'
import { createDodge } from '../dodge'
import { createMascot } from '../mascot'
import { lerp, outBack, smooth, span } from '../math'
import { lineTexture } from '../textures'

const PAPER = '#eceaf6'
const ROW_H = 1.02
const GAP = 0.2

/* White world: the skill set as a moving wall of type, seen through glass. */
export function createCraftWorld({ renderer, mascotGeometry, skills }) {
  const scene = new Scene()
  scene.background = new Color(PAPER)
  const env = makeEnvironment(renderer, '#d9d4ee', [
    [8, 6, 4, 6, 8, '#ffffff', 4.5],
    [-9, 3, 4, 3, 9, '#ffffff', 3.5],
    [0, 10, 0, 14, 5, '#ffffff', 3],
    [0, -9, 2, 12, 5, '#8f7cff', 0.9],
    [4, 0, 9, 1.4, 5, '#ffffff', 5],
    [-3, -2, -9, 9, 4, '#120c22', 0.2],
  ])
  scene.environment = env.texture
  const key = new DirectionalLight('#ffffff', 1.4)
  key.position.set(3, 5, 5)
  scene.add(key, new AmbientLight('#ffffff', 0.5))

  /* ── Wall of type ── */
  const wall = new Group()
  wall.rotation.set(0, -0.16, 0.13)
  wall.position.z = -2.4
  scene.add(wall)
  const inks = ['#000000', '#c8c0ea']
  const rows = []
  const lines = skills.map((group, i) => {
    const words = group.items.map(s => s.name.toUpperCase())
    let text = ''
    while (text.length < 34) text += words.join(' / ') + ' / '
    return lineTexture(text, { ink: inks[i % 2], paper: PAPER, size: 190, font: '800', pad: 0.1 })
  })
  const COUNT = 10
  for (let i = 0; i < COUNT; i++) {
    const line = lines[i % lines.length]
    const tex = line.tex.clone()
    const width = 34
    tex.repeat.x = width / (ROW_H * line.aspect)
    tex.needsUpdate = true
    const mesh = new Mesh(new PlaneGeometry(width, ROW_H), new MeshBasicMaterial({ map: tex }))
    mesh.position.y = (COUNT / 2 - i - 0.5) * (ROW_H + GAP)
    wall.add(mesh)
    rows.push({ mesh, tex, dir: i % 2 ? -1 : 1, speed: 0.012 + (i % 3) * 0.004 })
  }

  /* ── Glass ── */
  const glass = new MeshPhysicalMaterial({
    color: '#ffffff', transmission: 1, thickness: 1.5, ior: 1.32, roughness: 0.03, dispersion: 7,
    iridescence: 0.7, iridescenceIOR: 1.5, iridescenceThicknessMinimum: 120, iridescenceThicknessMaximum: 480,
    attenuationColor: new Color('#e9dcff'), attenuationDistance: 5, envMapIntensity: 0.75, specularIntensity: 1,
  })
  const facet = glass.clone()
  facet.flatShading = true
  facet.thickness = 2.2
  facet.ior = 1.5
  facet.dispersion = 12
  const mats = {
    body: glass,
    ring: glass,
    accent: glass,
    eye: new MeshPhysicalMaterial({ color: '#050408', roughness: 0.15, clearcoat: 1, envMapIntensity: 0.7 }),
    glint: new MeshBasicMaterial({ color: '#ffffff' }),
  }
  const mascot = createMascot(mascotGeometry, mats)
  scene.add(mascot.root)

  const gem = new Mesh(new OctahedronGeometry(0.95, 1), facet)
  const knot = new Mesh(new TorusKnotGeometry(0.5, 0.19, 180, 32, 2, 3), glass)
  const block = new Mesh(new RoundedBoxGeometry(0.8, 0.8, 0.8, 4, 0.06), facet)
  scene.add(gem, knot, block)

  let layout = null
  let rush = 0
  let lastX = 0
  const props = [
    { mesh: gem, wide: [-0.66, 0.5, -0.4], tall: [-0.5, 0.64, -0.6], size: 1, at: 0.15, dodge: createDodge({ radius: 1.6, force: 34 }) },
    { mesh: knot, wide: [0.64, 0.22, -0.3], tall: [0.52, 0.5, -0.6], size: 1, at: 0.25, dodge: createDodge({ radius: 1.6, force: 34 }) },
    { mesh: block, wide: [0.4, -0.66, 0.4], tall: [-0.5, -0.5, 0], size: 0.9, at: 0.35, dodge: createDodge({ radius: 1.4, force: 34 }) },
  ]

  return {
    scene,
    mascot,
    look: { bloom: 0, threshold: 4, vignette: 0.32, aberration: 0.5 },
    trail: ['#ff2da0', '#7a3dff', 1],
    camera: { zoom: 0.96, y: 0.05 },
    rig: () => ({ x: 0, y: 0, z: 0, scale: layout?.tall ? 0.92 : 1.14, yaw: 0, pitch: 0.06, roll: 0 }),
    resize(next) {
      layout = next
    },
    update({ time, dt, presence, pointer, probe }) {
      const p = smooth(presence)
      // Sweeping the cursor sideways drags the wall of type with it.
      rush += ((pointer.x - lastX) / Math.max(dt, 0.004) - rush) * (1 - Math.exp(-5 * dt))
      lastX = pointer.x
      rows.forEach((r, i) => {
        r.tex.offset.x += (r.dir * r.speed - rush * 0.02) * dt
        r.mesh.position.x = (1 - p) * (i % 2 ? 9 : -9)
      })
      const hw = Math.min(layout.halfW, 5.4)
      props.forEach(({ mesh, wide, tall, size, at, dodge }, i) => {
        const [x, y, z] = layout.tall ? tall : wide
        const e = outBack(span(presence, at, 0.65), 1.6)
        const d = dodge.update(x * hw, y * layout.halfH, probe, dt)
        mesh.position.set(x * hw * lerp(1.5, 1, p) + d.x, y * layout.halfH + Math.sin(time * 0.9 + i * 2) * 0.12 + d.y, z + d.near * 0.3)
        mesh.rotation.set(time * (0.18 + i * 0.05) + d.turn, time * 0.24 + i + d.turn, 0.3)
        mesh.scale.setScalar(Math.max(0.0001, e * size * (layout.tall ? 0.8 : 1)))
      })
    },
    dispose() {
      env.dispose()
      lines.forEach(l => l.tex.dispose())
      rows.forEach(r => r.tex.dispose())
    },
  }
}
