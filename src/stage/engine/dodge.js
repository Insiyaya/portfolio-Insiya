/* Makes a floating object dodge the cursor: a damped spring with a push away
   from the probe (the cursor projected into the scene). */
export function createDodge({ radius = 1.5, force = 30, stiffness = 34, damping = 5.2, twist = 16 } = {}) {
  const s = { x: 0, y: 0, vx: 0, vy: 0, turn: 0, vt: 0, near: 0 }
  return {
    state: s,
    update(homeX, homeY, probe, dt) {
      let fx = 0
      let fy = 0
      let near = 0
      if (probe.on) {
        const dx = homeX + s.x - probe.x
        const dy = homeY + s.y - probe.y
        const d = Math.hypot(dx, dy) || 0.001
        if (d < radius) {
          near = 1 - d / radius
          fx = (dx / d) * near * force
          fy = (dy / d) * near * force
          s.vt += (dx > 0 ? 1 : -1) * near * twist * dt
        }
      }
      s.near += (near - s.near) * (1 - Math.exp(-10 * dt))
      s.vx += (fx - s.x * stiffness - s.vx * damping) * dt
      s.vy += (fy - s.y * stiffness - s.vy * damping) * dt
      s.vt += (-s.turn * 22 - s.vt * 3.6) * dt
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.turn += s.vt * dt
      return s
    },
  }
}
