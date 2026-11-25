import { RIBBONS } from './letters'

const FACE = "'Archivo Variable', Arial, sans-serif"
const WIDTHS = ['extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded']
const SEAM = 6 // glyph units between one stroke and the next
const GAP = 12 // and between one character and the next
const FINE = 1.3 // strip pixels per glyph unit

/* The part of glyph space that is painted. */
export const BOX = { x: -10, y: -20, w: 880, h: 730 }

/* One word as a solid bar of type: every character fills its cell to the edges. */
function strip(word, length, wide) {
  const w = Math.max(8, Math.round(length * FINE))
  const h = Math.max(8, Math.round(wide * FINE))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const chars = [...word.toUpperCase()]
  const gap = GAP * FINE
  const px = h / 0.69
  // Start from the width of the typeface that needs the least stretching.
  let best = null
  for (const width of WIDTHS) {
    const font = `900 ${width} ${px}px ${FACE}`
    ctx.font = font
    const boxes = chars.map(c => ctx.measureText(c))
    const natural = boxes.reduce((sum, b) => sum + b.actualBoundingBoxLeft + b.actualBoundingBoxRight, 0)
    const k = (w - gap * (chars.length - 1)) / natural
    if (!best || Math.abs(Math.log(k)) < Math.abs(Math.log(best.k))) best = { k, boxes, font } // reading ctx.font back would lose the width
  }
  ctx.font = best.font
  ctx.fillStyle = '#fff'
  let x = 0
  chars.forEach((c, i) => {
    const b = best.boxes[i]
    ctx.setTransform(best.k, 0, 0, h / (b.actualBoundingBoxAscent + b.actualBoundingBoxDescent), x, 0)
    ctx.fillText(c, b.actualBoundingBoxLeft, b.actualBoundingBoxAscent)
    x += (b.actualBoundingBoxLeft + b.actualBoundingBoxRight) * best.k + gap
  })
  const rgba = ctx.getImageData(0, 0, w, h).data
  const alpha = new Uint8Array(w * h)
  for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4 + 3]
  return { w, h, alpha }
}

/* A point on an edge at t in 0..1, rounded through its points or straight between them. */
function along(points, t, straight) {
  const n = points.length - 1
  const f = Math.min(n - 1e-6, Math.max(0, t * n))
  const i = Math.floor(f)
  const u = f - i
  const b = points[i]
  const c = points[i + 1]
  if (straight || n === 1) return [b[0] + (c[0] - b[0]) * u, b[1] + (c[1] - b[1]) * u]
  const a = points[i - 1] ?? b
  const d = points[i + 2] ?? c
  const at = k => 0.5 * (2 * b[k] + (c[k] - a[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * u * u * u)
  return [at(0), at(1)]
}

/* Fills `image` with the letter's strokes, each one packed with the word.
   `scale` is pixels per glyph unit; `ink` and `paper` are [r, g, b]. */
export function paintLetter(char, word, scale, ink, paper) {
  const W = Math.round(BOX.w * scale)
  const H = Math.round(BOX.h * scale)
  const image = new ImageData(W, H)
  const data = image.data
  for (let i = 0; i < data.length; i += 4) {
    data[i] = paper[0]
    data[i + 1] = paper[1]
    data[i + 2] = paper[2]
    data[i + 3] = 255
  }

  for (const { low, high, straight } of RIBBONS[char]) {
    const steps = low.length === 2 ? 12 : 72
    const rows = []
    let length = 0
    let width = 0
    for (let i = 0; i <= steps; i++) {
      const b = along(low, i / steps, straight)
      const t = along(high, i / steps, straight)
      const mid = [(b[0] + t[0]) / 2, (b[1] + t[1]) / 2]
      if (i) length += Math.hypot(mid[0] - rows[i - 1].mid[0], mid[1] - rows[i - 1].mid[1])
      const w = Math.hypot(t[0] - b[0], t[1] - b[1])
      width += w / (steps + 1)
      rows.push({ b, t, mid, w, at: length })
    }
    const s = strip(word, length - SEAM * 2, width - SEAM * 2)
    const toPx = p => [(p[0] - BOX.x) * scale, H - (p[1] - BOX.y) * scale]
    // Corners carry their place on the strip, so insets are exact at every width.
    const corner = (r, k) => {
      const [x, y] = toPx([r.b[0] + (r.t[0] - r.b[0]) * k, r.b[1] + (r.t[1] - r.b[1]) * k])
      const inset = SEAM / (r.w - SEAM * 2)
      return { x, y, u: ((r.at - SEAM) / (length - SEAM * 2)) * s.w, v: (1 + inset - k * (1 + inset * 2)) * s.h }
    }
    const BANDS = 8 // small pieces keep the stretching smooth
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < BANDS; j++) {
        const p = corner(rows[i], j / BANDS)
        const q = corner(rows[i + 1], j / BANDS)
        const r = corner(rows[i + 1], (j + 1) / BANDS)
        const o = corner(rows[i], (j + 1) / BANDS)
        fillTriangle(data, W, H, p, q, r, s, ink, paper)
        fillTriangle(data, W, H, p, r, o, s, ink, paper)
      }
    }
  }
  return image
}

function fillTriangle(data, W, H, a, b, c, s, ink, paper) {
  const area = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)
  if (Math.abs(area) < 1e-6) return
  const x0 = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x)))
  const x1 = Math.min(W - 1, Math.ceil(Math.max(a.x, b.x, c.x)))
  const y0 = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y)))
  const y1 = Math.min(H - 1, Math.ceil(Math.max(a.y, b.y, c.y)))
  const slack = -0.6 / Math.sqrt(Math.abs(area)) // neighbours overlap a little, so no cracks
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const px = x + 0.5
      const py = y + 0.5
      const wa = ((b.x - px) * (c.y - py) - (c.x - px) * (b.y - py)) / area
      const wb = ((c.x - px) * (a.y - py) - (a.x - px) * (c.y - py)) / area
      const wc = 1 - wa - wb
      if (wa < slack || wb < slack || wc < slack) continue
      const u = a.u * wa + b.u * wb + c.u * wc
      const v = a.v * wa + b.v * wb + c.v * wc
      const k = sample(s, u, v)
      if (k <= 0) continue
      const i = (y * W + x) * 4
      data[i] = paper[0] + (ink[0] - paper[0]) * k
      data[i + 1] = paper[1] + (ink[1] - paper[1]) * k
      data[i + 2] = paper[2] + (ink[2] - paper[2]) * k
    }
  }
}

function sample({ w, h, alpha }, u, v) {
  const x = u - 0.5
  const y = v - 0.5
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  if (xi < -1 || yi < -1 || xi >= w || yi >= h) return 0
  const fx = x - xi
  const fy = y - yi
  const at = yi * w + xi
  const a = xi >= 0 && yi >= 0 ? alpha[at] : 0
  const b = xi + 1 < w && yi >= 0 ? alpha[at + 1] : 0
  const c = xi >= 0 && yi + 1 < h ? alpha[at + w] : 0
  const d = xi + 1 < w && yi + 1 < h ? alpha[at + w + 1] : 0
  return ((a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy) / 255
}
