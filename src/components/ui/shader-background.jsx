import { useEffect, useRef } from 'react'
import { PLASMA_GLSL } from './plasma-glsl'

const VERTEX = `
attribute vec4 aVertexPosition;
void main() { gl_Position = aVertexPosition; }
`

const FRAGMENT = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
${PLASMA_GLSL}
void main() { gl_FragColor = vec4(plasma(gl_FragCoord.xy, iResolution, iTime), 1.0); }
`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

/* Full-window animated background.
 *
 * Differences from the original snippet: the loop stops on unmount, while the
 * canvas is off screen and when the tab is hidden; the buffer is capped so it
 * stays cheap on high-density screens; and reduced-motion gets a still frame. */
export default function ShaderBackground({ className = 'fixed inset-0 -z-10 h-full w-full', paused = false }) {
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)
  const wakeRef = useRef(() => {})

  useEffect(() => {
    pausedRef.current = paused
    wakeRef.current()
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return
    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program))
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aVertexPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    gl.useProgram(program)
    const uResolution = gl.getUniformLocation(program, 'iResolution')
    const uTime = gl.getUniformLocation(program, 'iTime')

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let clock = 4
    let previous = 0

    const draw = () => {
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, clock)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const loop = now => {
      frame = 0
      if (pausedRef.current || document.hidden) return
      clock += previous ? Math.min(0.05, (now - previous) / 1000) : 0
      previous = now
      draw()
      frame = requestAnimationFrame(loop)
    }
    const wake = () => {
      if (still || frame || pausedRef.current || document.hidden) return
      previous = 0
      frame = requestAnimationFrame(loop)
    }
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
      draw()
    }

    wakeRef.current = wake
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', wake)
    resize()
    wake()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', wake)
      wakeRef.current = () => {}
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
