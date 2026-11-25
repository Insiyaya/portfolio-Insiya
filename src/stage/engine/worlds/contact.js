import {
  AdditiveBlending, AmbientLight, Color, DirectionalLight, Group, IcosahedronGeometry, Mesh, MeshPhysicalMaterial, PlaneGeometry, Scene, ShaderMaterial, Vector3,
} from 'three'
import { createBackdrop } from '../backdrop'
import { makeEnvironment } from '../light'
import { outBack, smooth, span } from '../math'

const UP = new Vector3(0, 1, 0)
const CHEER = 1.7 // seconds: two turns and a jump when a message is sent

/* Soap-film colour along grazing edges. */
function addFilm(shader, uTime, amount) {
  shader.uniforms.uTime = uTime
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform float uTime;')
    .replace('#include <opaque_fragment>', /* glsl */ `
      float film = 1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0);
      vec3 filmHue = 0.5 + 0.5 * cos(6.2832 * (film * 1.25 + normal.y * 0.22 + uTime * 0.05 + vec3(0.02, 0.36, 0.68)));
      outgoingLight += filmHue * (pow(film, 2.2) * 1.25 + pow(film, 7.0) * 0.9) * ${amount.toFixed(2)};
      #include <opaque_fragment>`)
}

/* Closing world: the mascot has melted into an iridescent planet. */
export function createContactWorld({ renderer, mascotGeometry }) {
  const scene = new Scene()
  scene.background = new Color('#020106')
  const env = makeEnvironment(renderer, '#05030a', [
    [5, 6, 5, 2.4, 6, '#ffffff', 3.2],
    [-6, 3, 5, 4, 5, '#8df5d6', 1.7],
    [6, -4, 3, 6, 3, '#ff2daa', 2],
    [-5, -5, 2, 5, 3, '#6a4bff', 2.2],
    [0, 9, -3, 9, 3, '#e6dcff', 2],
  ])
  scene.environment = env.texture
  const backdrop = createBackdrop(0.5)
  scene.add(backdrop.mesh)
  const key = new DirectionalLight('#ffffff', 0.9)
  key.position.set(3, 4, 4)
  scene.add(key, new AmbientLight('#ffffff', 0.12))

  const group = new Group()
  scene.add(group)

  const uTime = { value: 0 }
  const uPoke = { value: new Vector3(0, 0, 1) }
  const uPokeAmt = { value: 0 }
  const reach = new Vector3()
  const blobMat = new MeshPhysicalMaterial({
    color: '#07050d', roughness: 0.07, metalness: 0.1, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessMinimum: 160, iridescenceThicknessMaximum: 560,
    clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.95,
  })
  blobMat.onBeforeCompile = shader => {
    addFilm(shader, uTime, 1)
    shader.uniforms.uPoke = uPoke
    shader.uniforms.uPokeAmt = uPokeAmt
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uTime;
        float swell(vec3 p) {
          return sin(p.x * 1.9 + uTime * 0.9) * sin(p.y * 2.1 - uTime * 0.7) * sin(p.z * 1.7 + uTime * 0.8) * 0.2
               + sin(p.x * 3.1 - uTime * 0.6 + p.y * 2.3) * 0.045;
        }
        uniform vec3 uPoke; uniform float uPokeAmt;
        vec3 melt(vec3 p) {
          vec3 n = normalize(p);
          float toward = max(dot(n, uPoke), 0.0);
          return n * (1.0 + swell(n * 1.25) + pow(toward, 5.0) * 0.42 * uPokeAmt - pow(max(-dot(n, uPoke), 0.0), 2.0) * 0.1 * uPokeAmt);
        }`)
      .replace('#include <beginnormal_vertex>', /* glsl */ `
        vec3 nn = normalize(position);
        vec3 tA = normalize(abs(nn.y) < 0.99 ? cross(nn, vec3(0.0, 1.0, 0.0)) : cross(nn, vec3(1.0, 0.0, 0.0)));
        vec3 tB = cross(nn, tA);
        vec3 p0 = melt(nn);
        vec3 pA = melt(normalize(nn + tA * 0.012));
        vec3 pB = melt(normalize(nn + tB * 0.012));
        vec3 objectNormal = normalize(cross(pB - p0, pA - p0));
        if (dot(objectNormal, nn) < 0.0) objectNormal = -objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`)
      .replace('#include <begin_vertex>', 'vec3 transformed = p0;')
  }
  blobMat.customProgramCacheKey = () => 'film-blob'
  const blob = new Mesh(new IcosahedronGeometry(1, 48), blobMat)
  group.add(blob)

  const ringMat = new MeshPhysicalMaterial({ color: '#0c0716', roughness: 0.1, clearcoat: 1, envMapIntensity: 1.1 })
  ringMat.onBeforeCompile = shader => addFilm(shader, uTime, 0.8)
  ringMat.customProgramCacheKey = () => 'film-ring'
  const ring = new Mesh(mascotGeometry.ring, ringMat)
  group.add(ring)
  const moon = new Mesh(mascotGeometry.ball, new MeshPhysicalMaterial({ color: '#8df5d6', roughness: 0.3, clearcoat: 0.6 }))
  group.add(moon)

  const pool = new Mesh(
    new PlaneGeometry(4.2, 0.9),
    new ShaderMaterial({
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      uniforms: { uA: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying vec2 vUv; uniform float uA; void main() { float d = length((vUv - 0.5) * 2.0); gl_FragColor = vec4(vec3(0.36, 0.24, 0.85) * pow(max(1.0 - d, 0.0), 1.8) * uA, 1.0); }',
    }),
  )
  scene.add(pool)

  let layout = null
  let cheer = 0 // seconds left

  return {
    scene,
    mascot: null,
    look: { bloom: 0.45, threshold: 0.9, vignette: 0.5, aberration: 0.5 },
    trail: ['#8df5d6', '#a488ff', 1.2],
    camera: { zoom: 1, y: 0 },
    /* The mascot spins down to nothing exactly where the planet appears. */
    rig: () => ({ x: layout?.tall ? 0 : layout.halfW * 0.42, y: layout?.tall ? layout.halfH * 0.5 : 0.1, z: 0, scale: 0, yaw: 5, pitch: 0, roll: 0 }),
    resize(next) {
      layout = next
    },
    cheer() {
      cheer = CHEER
    },
    update({ time, dt, presence, width, height, pointer, probe }) {
      uTime.value = time
      backdrop.update(time, width, height)
      backdrop.setLevel(0.5 * smooth(presence))
      const tall = layout.tall
      const x = tall ? 0 : Math.min(layout.halfW, 5.4) * 0.45
      const y = tall ? layout.halfH * 0.62 : 0.12
      const e = outBack(span(presence, 0.2, 0.7), 1.8)
      const size = Math.max(0.0001, e * (tall ? 0.74 : 1.12))
      cheer = Math.max(0, cheer - dt)
      const t = cheer ? 1 - cheer / CHEER : 0
      const spin = smooth(t) * Math.PI * 4
      const jump = Math.abs(Math.sin(t * Math.PI * 2)) * (1 - t) * (tall ? 0.28 : 0.55)
      group.position.set(x, y + Math.sin(time * 1.1) * 0.08 + jump, 0)
      const gap = Math.hypot(probe.x - x, probe.y - y)
      const want = probe.on ? Math.max(0, 1 - gap / 2.6) : 0
      uPokeAmt.value += (want - uPokeAmt.value) * (1 - Math.exp(-6 * dt))
      reach.set(probe.x - x, probe.y - y, 0.7).normalize().applyAxisAngle(UP, -(pointer.x * 0.4 + time * 0.12 + spin))
      uPoke.value.lerp(reach, 1 - Math.exp(-7 * dt)).normalize()
      group.scale.setScalar(size)
      group.rotation.set(pointer.y * 0.2, pointer.x * 0.4 + time * 0.12 + spin, 0)
      ring.rotation.set(0.36 + Math.sin(time * 0.7) * 0.08, 0, -0.3 + Math.sin(time * 0.5) * 0.08)
      moon.position.set(Math.cos(time * 0.6) * 1.62, Math.sin(time * 0.6) * -0.5, Math.sin(time * 0.6) * 1.5)
      moon.scale.setScalar(0.13)
      pool.position.set(x, y - (tall ? 1.3 : 1.95), -0.4)
      pool.material.uniforms.uA.value = span(presence, 0.4, 0.6) * 0.5
    },
    dispose: () => env.dispose(),
  }
}
