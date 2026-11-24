export const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (a, b, t) => a + (b - a) * t

/* Progress of a clip that starts at `start` and lasts `dur`, on timeline `t`. */
export const span = (t, start, dur) => clamp01((t - start) / dur)

/* Frame-rate independent approach toward a target. */
export const damp = (a, b, rate, dt) => lerp(a, b, 1 - Math.exp(-rate * dt))

export const smooth = t => t * t * (3 - 2 * t)
export const outCubic = t => 1 - Math.pow(1 - t, 3)
export const inCubic = t => t * t * t
export const inOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export const outBack = (t, s = 1.9) => {
  const c = t - 1
  return 1 + (s + 1) * c * c * c + s * c * c
}

/* Small seeded generator so the scene is laid out identically on every load. */
export function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
