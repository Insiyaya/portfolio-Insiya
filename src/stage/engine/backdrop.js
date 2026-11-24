import { Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from 'three'
import { PLASMA_GLSL } from '../../components/ui/plasma-glsl'

/* The page's plasma animation as a full-screen layer inside a 3D world. It is
   drawn first and ignores depth, so everything else lands on top of it. */
export function createBackdrop(level = 1) {
  const material = new ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uRes: { value: new Vector2(1, 1) }, uLevel: { value: level } },
    vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec2 uRes; uniform float uLevel;
      ${PLASMA_GLSL}
      void main() {
        vec3 c = plasma(gl_FragCoord.xy, uRes, uTime) * uLevel;
        gl_FragColor = vec4(pow(max(c, 0.0), vec3(2.2)), 1.0); // sRGB to linear: the stage renders in HDR
      }`,
  })
  const mesh = new Mesh(new PlaneGeometry(2, 2), material)
  mesh.frustumCulled = false
  mesh.renderOrder = -1000
  return {
    mesh,
    update(time, width, height) {
      material.uniforms.uTime.value = time + 4
      material.uniforms.uRes.value.set(width, height)
    },
    setLevel(v) {
      material.uniforms.uLevel.value = v
    },
  }
}
