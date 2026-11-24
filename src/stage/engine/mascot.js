import { CatmullRomCurve3, Group, LatheGeometry, Mesh, SphereGeometry, TorusGeometry, TubeGeometry, Vector2, Vector3 } from 'three'

/* The mascot: a small ringed planet with a face, two feet, an antenna and a
   moon that rides its ring. One set of geometry is shared by every world; each
   world supplies its own materials. */

const RING_RADIUS = 1.5
const EYE_HEIGHT = 0.185

function bodyGeometry() {
  // Superellipse profile: a little squarer than a ball, so it sits like a toy.
  const pts = []
  const steps = 64
  const n = 2.35
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / steps
    const c = Math.cos(a)
    const s = Math.sin(a)
    pts.push(new Vector2(Math.max(Math.pow(Math.abs(c), 2 / n), 0.0001), Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * 0.93))
  }
  const geo = new LatheGeometry(pts, 96)
  geo.computeVertexNormals()
  return geo
}

export function createMascotGeometry() {
  const antenna = new TubeGeometry(
    new CatmullRomCurve3([new Vector3(0, -0.12, 0), new Vector3(0.02, 0.2, 0), new Vector3(0.12, 0.45, 0), new Vector3(0.29, 0.64, 0)]),
    32, 0.07, 14,
  )
  const ring = new TorusGeometry(RING_RADIUS, 0.2, 28, 160)
  ring.scale(1, 1, 0.32)
  ring.rotateX(Math.PI / 2)
  return {
    body: bodyGeometry(),
    ball: new SphereGeometry(1, 40, 28),
    antenna,
    ring,
  }
}

export function createMascot(g, mats) {
  const root = new Group()
  const body = new Group()
  root.add(body)
  body.add(new Mesh(g.body, mats.body))

  const eyes = new Group()
  for (const x of [-0.29, 0.29]) {
    const eye = new Mesh(g.ball, mats.eye)
    eye.position.set(x, 0.3, 0.9)
    eye.scale.set(0.115, EYE_HEIGHT, 0.09)
    const glint = new Mesh(g.ball, mats.glint)
    glint.position.set(0.32, 0.42, 0.78)
    glint.scale.set(0.26, 0.2, 0.2)
    eye.add(glint)
    eyes.add(eye)
  }
  body.add(eyes)

  const antenna = new Group()
  antenna.position.set(0.04, 0.92, 0)
  antenna.add(new Mesh(g.antenna, mats.body))
  const tip = new Mesh(g.ball, mats.accent)
  tip.position.set(0.32, 0.72, 0)
  tip.scale.setScalar(0.17)
  antenna.add(tip)
  body.add(antenna)

  const ring = new Group()
  ring.add(new Mesh(g.ring, mats.ring))
  const moon = new Mesh(g.ball, mats.accent)
  moon.scale.setScalar(0.2)
  ring.add(moon)
  body.add(ring)

  const feet = [-1, 1].map(() => {
    const foot = new Mesh(g.ball, mats.body)
    foot.scale.set(0.27, 0.23, 0.33)
    root.add(foot)
    return foot
  })

  return {
    root,
    apply(p) {
      root.position.set(p.x, p.y, p.z)
      root.scale.setScalar(Math.max(p.scale, 0.0001))
      root.visible = p.scale > 0.002
      body.rotation.set(p.pitch, p.yaw, p.roll)
      const wide = 1 / Math.sqrt(p.squash)
      body.scale.set(wide, p.squash, wide)
      antenna.rotation.set(p.antX, 0, p.antZ)
      ring.rotation.set(0.3 + p.ringX, 0, -0.24 + p.ringZ)
      moon.position.set(Math.cos(p.moon) * RING_RADIUS, 0.02, Math.sin(p.moon) * RING_RADIUS)
      eyes.children.forEach(e => e.scale.set(0.115 * (1 + (p.smile || 0) * 0.16), EYE_HEIGHT * p.blink * (1 - (p.smile || 0) * 0.42), 0.09))
      feet.forEach((f, i) => {
        const side = i ? 1 : -1
        f.position.set(side * 0.34 + p.roll * 0.2 + p.yaw * 0.12, -1.13 + p.step * side * 0.05, 0.16)
        f.rotation.set(p.pitch * 0.6, p.yaw * 0.7, p.roll * 0.5)
      })
    },
  }
}

/* Springy puppet controller. Worlds describe where the mascot should be; this
   gets it there and adds the secondary motion (antenna and ring lag). */
export function createRig() {
  const pose = { x: 0, y: 0, z: 0, scale: 1, yaw: 0, pitch: 0, roll: 0, squash: 1, antX: 0, antZ: 0, ringX: 0, ringZ: 0, moon: 0.6, blink: 1, step: 0 }
  const base = { x: 0, y: 0, z: 0, scale: 1, yaw: 0, pitch: 0, roll: 0 }
  const vel = { antX: 0, antZ: 0, ringX: 0, ringZ: 0, squash: 0 }
  let last = null
  let blinkAt = 2.4
  let mood = 0
  let moodGoal = 0
  let jump = -1
  const JUMP = 0.82

  const spring = (key, target, k, c, dt) => {
    vel[key] += (-(pose[key] - target) * k - vel[key] * c) * dt
    pose[key] += vel[key] * dt
  }

  return {
    pose,
    kick(amount) {
      vel.squash += amount
      vel.antZ -= amount * 1.1
      vel.ringZ += amount * 0.3
      vel.ringX += amount * 0.16
    },
    setMood(v) {
      moodGoal = v
    },
    hop() {
      if (jump < 0) jump = 0
    },
    snap(target) {
      Object.assign(base, target)
    },
    update(target, time, dt, calm) {
      for (const key of Object.keys(base)) {
        const rate = key === 'scale' ? 5.5 : 3.4
        base[key] += ((target[key] ?? 0) - base[key]) * (1 - Math.exp(-rate * dt))
      }
      const idle = calm ? 0 : 1
      pose.x = base.x
      pose.y = base.y + Math.sin(time * 1.5) * 0.07 * idle
      pose.z = base.z
      pose.scale = base.scale
      pose.yaw = base.yaw + Math.sin(time * 0.55) * 0.16 * idle
      pose.pitch = base.pitch + Math.sin(time * 0.8 + 1) * 0.05 * idle
      pose.roll = base.roll + Math.sin(time * 0.95) * 0.07 * idle
      pose.step = Math.sin(time * 1.5) * idle
      pose.moon += dt * (0.75 + mood * 2.2) * idle

      /* Pleased to see you: a small lift, a lean, and happy eyes. */
      mood += (moodGoal - mood) * (1 - Math.exp(-9 * dt))
      pose.scale *= 1 + mood * 0.05
      pose.roll += Math.sin(time * 9) * 0.06 * mood

      if (jump >= 0) {
        jump += dt / JUMP
        const t = Math.min(1, jump)
        pose.y += 4 * t * (1 - t) * 0.95 * base.scale
        pose.yaw += (t * t * (3 - 2 * t)) * Math.PI * 2
        if (jump >= 1) {
          jump = -1
          vel.squash -= 3.4
          vel.antX += 2
        }
      }

      const h = Math.max(dt, 0.004)
      last ??= { yaw: pose.yaw, pitch: pose.pitch, scale: pose.scale, y: pose.y }
      if (jump < 0 && Math.abs(pose.yaw - last.yaw) > 3) last.yaw = pose.yaw // the spin ended on a full turn
      const dYaw = (pose.yaw - last.yaw) / h
      const dPitch = (pose.pitch - last.pitch) / h
      const dY = (pose.y - last.y) / h
      const dScale = (pose.scale - last.scale) / h
      last = { yaw: pose.yaw, pitch: pose.pitch, scale: pose.scale, y: pose.y }

      spring('antZ', -dYaw * 0.1 - dScale * 0.08, 70, 5.2, dt)
      spring('antX', -dPitch * 0.1 - dY * 0.12, 70, 5.2, dt)
      spring('ringZ', dYaw * 0.06 + Math.sin(time * 0.7) * 0.05 * idle, 46, 4.4, dt)
      spring('ringX', dPitch * 0.04 - dY * 0.05, 46, 5.5, dt)
      spring('squash', 1, 150, 11, dt)
      pose.squash = Math.min(1.35, Math.max(0.7, pose.squash))

      const since = time - blinkAt
      if (since > 0.16) {
        blinkAt = time + 2.2 + ((time * 7.3) % 1) * 2.6
        pose.blink = 1
      } else if (since > 0) {
        pose.blink = 1 - Math.sin((since / 0.16) * Math.PI) * 0.92
      }
      pose.smile = mood
    },
  }
}
