import { BackSide, Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, Scene, SphereGeometry } from 'three'

/* Image-based lighting built from a handful of glowing panels, so the scene
   needs no HDR downloads. Each panel is [x, y, z, width, height, colour, power]. */
export function makeEnvironment(renderer, base, panels, blur = 0.015) {
  const scene = new Scene()
  const made = []
  const add = (geometry, color, side, place) => {
    const mesh = new Mesh(geometry, new MeshBasicMaterial({ color, side }))
    place?.(mesh)
    scene.add(mesh)
    made.push(mesh)
  }
  add(new SphereGeometry(30, 24, 16), new Color(base), BackSide)
  for (const [x, y, z, w, h, color, power] of panels) {
    add(new PlaneGeometry(w, h), new Color(color).multiplyScalar(power), DoubleSide, mesh => {
      mesh.position.set(x, y, z)
      mesh.lookAt(0, 0, 0)
    })
  }
  const pmrem = new PMREMGenerator(renderer)
  const target = pmrem.fromScene(scene, blur)
  pmrem.dispose()
  made.forEach(m => {
    m.geometry.dispose()
    m.material.dispose()
  })
  return target
}

/* Adds a directional edge glow to any lit three.js material. `dir` is in view
   space: +x is screen right, +y is up. */
export function addRim(material, { color = '#ffffff', power = 2.6, strength = 1, dir = [0.6, 0.35, -0.2], wrap = 0.35 } = {}) {
  const uniforms = {
    uRimColor: { value: new Color(color) },
    uRimPower: { value: power },
    uRimStrength: { value: strength },
  }
  const vec = dir.map(n => n.toFixed(3)).join(',')
  material.userData.rim = uniforms
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uRimColor; uniform float uRimPower; uniform float uRimStrength;`)
      .replace('#include <opaque_fragment>', `
        float rimF = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), uRimPower);
        float rimSide = clamp(dot(normalize(normal), normalize(vec3(${vec}))) * ${(1 - wrap).toFixed(3)} + ${wrap.toFixed(3)}, 0.0, 1.0);
        outgoingLight += uRimColor * rimF * rimSide * uRimStrength;
        #include <opaque_fragment>`)
  }
  material.customProgramCacheKey = () => `rim:${vec}:${wrap}`
  return material
}
