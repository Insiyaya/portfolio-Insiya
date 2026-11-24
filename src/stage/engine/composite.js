import {
  HalfFloatType, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderTarget,
} from 'three'

const VERT = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'

/* Crossfades two worlds and finishes the picture: bloom, edge colour split,
   vignette, a little grain, then tone mapping to the screen. */
export function createComposite(renderer, { bloom = true } = {}) {
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const quad = new Mesh(new PlaneGeometry(2, 2))
  quad.frustumCulled = false
  const scene = new Scene()
  scene.add(quad)

  const target = samples => new WebGLRenderTarget(4, 4, { type: HalfFloatType, samples, minFilter: LinearFilter, magFilter: LinearFilter })
  const a = target(4)
  const b = target(4)
  const b1 = target(0)
  const b2 = target(0)
  const small = new Vector2(1, 1)

  const bright = new ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { tA: { value: a.texture }, tB: { value: b.texture }, uMix: { value: 0 }, uCut: { value: 1 } },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; uniform sampler2D tA, tB; uniform float uMix, uCut;
      void main() {
        vec3 c = mix(texture2D(tA, vUv).rgb, texture2D(tB, vUv).rgb, uMix);
        float l = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(min(c, vec3(6.0)) * smoothstep(uCut, uCut + 0.6, l), 1.0);
      }`,
  })
  const blur = new ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { tMap: { value: null }, uDir: { value: new Vector2() } },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; uniform sampler2D tMap; uniform vec2 uDir;
      void main() {
        vec3 c = texture2D(tMap, vUv).rgb * 0.1964;
        c += (texture2D(tMap, vUv + uDir * 1.41).rgb + texture2D(tMap, vUv - uDir * 1.41).rgb) * 0.2969;
        c += (texture2D(tMap, vUv + uDir * 3.29).rgb + texture2D(tMap, vUv - uDir * 3.29).rgb) * 0.0945;
        c += (texture2D(tMap, vUv + uDir * 5.18).rgb + texture2D(tMap, vUv - uDir * 5.18).rgb) * 0.0104;
        gl_FragColor = vec4(c, 1.0);
      }`,
  })
  const finish = new ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: {
      tA: { value: a.texture }, tB: { value: b.texture }, tBloom: { value: b1.texture }, uMix: { value: 0 }, uBloom: { value: 0 },
      uVignette: { value: 0.4 }, uAberration: { value: 0.5 }, uTime: { value: 0 },
      uCursor: { value: new Vector2() }, uPush: { value: 0 }, uAspect: { value: 1 },
    },
    vertexShader: VERT,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; uniform sampler2D tA, tB, tBloom;
      uniform float uMix, uBloom, uVignette, uAberration, uTime, uPush, uAspect; uniform vec2 uCursor;
      vec3 both(vec2 uv) {
        vec3 c = vec3(0.0);
        if (uMix < 0.999) c += texture2D(tA, uv).rgb * (1.0 - uMix);
        if (uMix > 0.001) c += texture2D(tB, uv).rgb * uMix;
        return c;
      }
      void main() {
        vec2 off = (vUv - 0.5) * dot(vUv - 0.5, vUv - 0.5) * 0.012 * uAberration;
        vec2 away = (vUv - uCursor) * vec2(uAspect, 1.0);
        float lens = exp(-dot(away, away) * 34.0) * uPush;
        vec2 bend = -away * lens * 0.16;
        off += away * lens * 0.075;
        vec3 c = vec3(both(vUv + bend + off).r, both(vUv + bend).g, both(vUv + bend - off).b);
        c += texture2D(tBloom, vUv).rgb * uBloom;
        vec2 v = (vUv - 0.5) * vec2(1.05, 1.0);
        c *= 1.0 - uVignette * smoothstep(0.1, 0.62, dot(v, v) * 1.6);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        float g = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 61.0, vec2(12.9898, 78.233))) * 43758.5453);
        gl_FragColor.rgb += (g - 0.5) * 0.028;
      }`,
  })

  const pass = (material, to) => {
    quad.material = material
    renderer.setRenderTarget(to)
    renderer.render(scene, camera)
  }

  return {
    a,
    b,
    resize(w, h) {
      a.setSize(w, h)
      b.setSize(w, h)
      small.set(Math.max(1, w >> 2), Math.max(1, h >> 2))
      b1.setSize(small.x, small.y)
      b2.setSize(small.x, small.y)
    },
    render({ mix, look, time, cursor, push, aspect }) {
      const useBloom = bloom && look.bloom > 0.01
      if (useBloom) {
        bright.uniforms.uMix.value = mix
        bright.uniforms.uCut.value = look.threshold
        pass(bright, b1)
        for (const spread of [1, 2.4, 4.2]) {
          blur.uniforms.tMap.value = b1.texture
          blur.uniforms.uDir.value.set(spread / small.x, 0)
          pass(blur, b2)
          blur.uniforms.tMap.value = b2.texture
          blur.uniforms.uDir.value.set(0, spread / small.y)
          pass(blur, b1)
        }
      }
      const u = finish.uniforms
      u.uMix.value = mix
      u.uBloom.value = useBloom ? look.bloom : 0
      u.uVignette.value = look.vignette
      u.uAberration.value = look.aberration
      u.uTime.value = time
      u.uCursor.value.set(cursor.x * 0.5 + 0.5, cursor.y * 0.5 + 0.5)
      u.uPush.value = push
      u.uAspect.value = aspect
      pass(finish, null)
    },
    dispose() {
      ;[a, b, b1, b2].forEach(t => t.dispose())
      ;[bright, blur, finish].forEach(m => m.dispose())
      quad.geometry.dispose()
    },
  }
}
