import { CanvasTexture, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, SRGBColorSpace } from 'three'

export const FACE = "'Archivo Variable', Arial, sans-serif"

/* Canvas text is only correct once the face has actually loaded. */
export async function loadFaces() {
  if (!document.fonts?.load) return
  await Promise.all([
    document.fonts.load(`800 100px ${FACE}`),
    document.fonts.load(`800 semi-expanded 100px ${FACE}`),
    document.fonts.load(`800 expanded 100px ${FACE}`),
  ]).catch(() => {})
}

function finish(canvas, { repeat = false, anisotropy = 8, mips = true } = {}) {
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = anisotropy
  tex.generateMipmaps = mips
  tex.minFilter = mips ? LinearMipmapLinearFilter : LinearFilter
  if (repeat) tex.wrapS = RepeatWrapping
  return tex
}

/* One seamless line of type. `aspect` is width / height of a single repeat. */
export function lineTexture(text, { ink = '#000', paper = '#eceaf6', size = 200, font = '800 semi-expanded', pad = 0.16, cut = false, anisotropy = 8 } = {}) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const face = px => `${font} ${px}px ${FACE}`
  ctx.font = face(size)
  const measured = ctx.measureText(text).width
  const k = Math.min(1, 4096 / measured)
  const px = size * k
  canvas.width = Math.round(measured * k)
  canvas.height = Math.round(px * (0.76 + pad * 2))
  if (!cut) {
    ctx.fillStyle = paper
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.font = face(px)
  ctx.fillStyle = ink
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, 0, canvas.height - px * pad - px * 0.02)
  const tex = finish(canvas, { repeat: true, anisotropy })
  return { tex, aspect: canvas.width / canvas.height }
}

/* A lit sign for the work scene: fits the title into the panel as large as it
   will go, left-aligned, broken by word. */
export function signTexture({ title, kind, aspect, dark = false, accent = '#ff2daa' }) {
  const h = 512
  const w = Math.round(h * aspect)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = dark ? '#0b0910' : '#f3f1fb'
  ctx.fillRect(0, 0, w, h)

  if (dark) {
    // Broken colour bars along the lower half, like a mistuned channel.
    const bands = ['#ff2daa', '#f6f3ff', '#8df5d6', '#7a5cff']
    for (let i = 0; i < 22; i++) {
      const y = h * 0.5 + i * (h * 0.5) / 22
      ctx.fillStyle = bands[(i * 7 + 3) % bands.length]
      const x = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
      ctx.globalAlpha = 0.85
      ctx.fillRect(x * w * 0.6, y, w * (0.15 + x * 0.5), (h * 0.5) / 22 * 0.72)
    }
    ctx.globalAlpha = 1
  }

  const pad = h * 0.09
  const kindSize = Math.max(26, h * 0.075)
  const maxW = w - pad * 2
  const maxH = h - pad * 2 - (kind ? kindSize * 1.9 : 0)
  const words = title.split(' ')
  let best = { size: 0, lines: [title] }
  const layouts = (function split(list) {
    if (list.length === 1) return [[list[0]]]
    const out = [[list.join(' ')]]
    for (let i = 1; i < list.length; i++) for (const rest of split(list.slice(i))) out.push([list.slice(0, i).join(' '), ...rest])
    return out
  })(words)
  for (const lines of layouts) {
    ctx.font = `800 100px ${FACE}`
    const widest = Math.max(...lines.map(l => ctx.measureText(l).width))
    const size = Math.min((maxW / widest) * 100, maxH / (lines.length * 0.94))
    if (size > best.size) best = { size, lines }
  }
  ctx.fillStyle = dark ? '#f6f3ff' : '#000'
  ctx.font = `800 ${best.size}px ${FACE}`
  ctx.textBaseline = 'alphabetic'
  best.lines.forEach((l, i) => ctx.fillText(l, pad, pad + best.size * 0.78 + i * best.size * 0.94))
  if (kind) {
    ctx.fillStyle = dark ? '#f6f3ff' : accent
    ctx.font = `600 ${kindSize}px ${FACE}`
    ctx.fillText(kind, pad, h - pad)
  }
  return finish(canvas)
}
