import { BufferGeometry, Color, DoubleSide, DynamicDrawUsage, Float32BufferAttribute, Mesh, ShaderMaterial, Vector3 } from 'three'

const COUNT = 60

/* A ribbon that chases the cursor through the scene. It weaves in depth, so it
   passes in front of the mascot and then behind it. One geometry is simulated;
   each world shows it with its own colours. */
export function createTrail() {
  const points = Array.from({ length: COUNT }, () => new Vector3(0, 0, -40))
  const geometry = new BufferGeometry()
  const positions = new Float32BufferAttribute(new Float32Array(COUNT * 2 * 3), 3)
  positions.setUsage(DynamicDrawUsage)
  const along = new Float32Array(COUNT * 2)
  const side = new Float32Array(COUNT * 2)
  const index = []
  for (let i = 0; i < COUNT; i++) {
    along[i * 2] = along[i * 2 + 1] = i / (COUNT - 1)
    side[i * 2] = -1
    side[i * 2 + 1] = 1
    if (i < COUNT - 1) index.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
  }
  geometry.setAttribute('position', positions)
  geometry.setAttribute('aT', new Float32BufferAttribute(along, 1))
  geometry.setAttribute('aSide', new Float32BufferAttribute(side, 1))
  geometry.setIndex(index)

  const uTime = { value: 0 }
  const materials = []
  const tangent = new Vector3()
  const across = new Vector3()
  const view = new Vector3(0, 0, 1)
  let awake = false

  return {
    mesh(a, b, glow = 1) {
      const material = new ShaderMaterial({
        side: DoubleSide,
        uniforms: { uTime, uA: { value: new Color(a).multiplyScalar(glow) }, uB: { value: new Color(b).multiplyScalar(glow) } },
        vertexShader: 'attribute float aT, aSide; varying float vT, vS; void main() { vT = aT; vS = aSide; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }',
        fragmentShader: /* glsl */ `
          varying float vT, vS; uniform vec3 uA, uB; uniform float uTime;
          void main() {
            vec3 c = mix(uA, uB, smoothstep(0.0, 0.85, vT));
            float fold = 0.5 + 0.5 * sin(vT * 15.0 - uTime * 4.0);
            c *= 0.62 + 0.38 * fold + 0.25 * vS * cos(vT * 15.0 - uTime * 4.0);
            gl_FragColor = vec4(c, 1.0);
          }`,
      })
      materials.push(material)
      const mesh = new Mesh(geometry, material)
      mesh.frustumCulled = false
      return mesh
    },
    update(head, time, dt, on) {
      uTime.value = time
      if (on && !awake) {
        points.forEach(p => p.copy(head))
        awake = true
      }
      if (!awake) return
      points[0].set(head.x, head.y, 0.5 + Math.sin(time * 1.9) * 0.75)
      const follow = 1 - Math.exp(-46 * dt)
      for (let i = 1; i < COUNT; i++) points[i].lerp(points[i - 1], follow)
      for (let i = 0; i < COUNT; i++) {
        const p = points[i]
        const q = points[Math.min(COUNT - 1, i + 1)]
        const o = points[Math.max(0, i - 1)]
        tangent.subVectors(q, o)
        const speed = tangent.length()
        across.crossVectors(tangent, view)
        if (across.lengthSq() < 1e-9) across.set(0, 1, 0)
        across.normalize()
        const t = i / (COUNT - 1)
        // Pointed at both ends, flat in the middle, and gone when the cursor rests.
        const taper = Math.min(1, t * 9) * Math.pow(1 - t, 0.8)
        const twist = 0.4 + 0.6 * Math.abs(Math.cos(t * 5.5 - time * 2.2))
        const w = 0.105 * taper * twist * Math.min(1, speed * 11)
        positions.setXYZ(i * 2, p.x - across.x * w, p.y - across.y * w, p.z)
        positions.setXYZ(i * 2 + 1, p.x + across.x * w, p.y + across.y * w, p.z)
      }
      positions.needsUpdate = true
    },
    dispose() {
      geometry.dispose()
      materials.forEach(m => m.dispose())
    },
  }
}
