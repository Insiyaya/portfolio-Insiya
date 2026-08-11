/**
 * Planetary backdrop system.
 *
 * Everything here is pure CSS (radial gradients + transforms) — no images,
 * no canvas, no per-star DOM nodes. Layers sit behind content and are
 * pointer-events-none, so they never interfere with readability or input.
 *
 * Spheres are built from three cues: an off-centre lit limb, an inset
 * terminator shadow opposite the light, and an outer atmospheric bloom.
 * That combination is what stops a circle from reading as a flat disc.
 */

/* Planet colour ramps, drawn from the site palette.
   `cyan` is a small moon only — cyan stays rare by design. */
const TONES = {
  pink: {
    lit:  '#FF7ED4',
    mid:  '#D62A96',
    low:  '#6C0F4B',
    edge: '#26071C',
    glow: 'rgba(255,45,170,0.42)',
    rim:  'rgba(255,126,212,0.75)',
  },
  magenta: {
    lit:  '#EE9BFB',
    mid:  '#AE33C9',
    low:  '#4C1160',
    edge: '#210A2A',
    glow: 'rgba(217,70,239,0.36)',
    rim:  'rgba(238,155,251,0.70)',
  },
  lavender: {
    lit:  '#DFC4FF',
    mid:  '#9159DD',
    low:  '#3B1D66',
    edge: '#1B0E2E',
    glow: 'rgba(192,132,252,0.32)',
    rim:  'rgba(223,196,255,0.65)',
  },
  cyan: {
    lit:  '#CFF7FD',
    mid:  '#4FB6C9',
    low:  '#15414D',
    edge: '#0A1F26',
    glow: 'rgba(103,232,249,0.30)',
    rim:  'rgba(207,247,253,0.70)',
  },
}

/**
 * A single sphere. `light` is the angle the star-light comes from,
 * expressed as the position of the lit highlight.
 */
export function Planet({
  size,
  tone = 'pink',
  light = '32% 26%',
  bands = false,
  ring = false,
  ringTilt = -22,
  glowScale = 1.5,
  className = '',
  style = {},
}) {
  const t = TONES[tone] || TONES.pink

  return (
    <div className={`absolute pointer-events-none select-none ${className}`} style={{ width: size, height: size, ...style }}>
      {/* Atmospheric bloom — sits behind the body */}
      <div
        className="absolute rounded-full"
        style={{
          inset: `${(size * (1 - glowScale)) / 2}px`,
          width: size * glowScale,
          height: size * glowScale,
          left: `${-(size * (glowScale - 1)) / 2}px`,
          top: `${-(size * (glowScale - 1)) / 2}px`,
          background: `radial-gradient(circle, ${t.glow} 0%, transparent 62%)`,
          filter: 'blur(2px)',
        }}
      />

      {/* Ring system — drawn behind the body, then repeated in front so the
          band appears to pass around the planet rather than sit on top. */}
      {ring && <PlanetRing size={size} tone={t} tilt={ringTilt} half="back" />}

      {/* Planet body */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${light}, ${t.lit} 0%, ${t.mid} 34%, ${t.low} 66%, ${t.edge} 100%)`,
          boxShadow: `
            inset -${size * 0.10}px -${size * 0.07}px ${size * 0.30}px rgba(13,8,18,0.88),
            inset ${size * 0.03}px ${size * 0.03}px ${size * 0.10}px ${t.rim.replace('0.7', '0.22').replace('0.75', '0.22').replace('0.65', '0.22')}
          `,
        }}
      >
        {/* Cloud/surface banding */}
        {bands && (
          <div
            className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
            style={{
              background: `repeating-linear-gradient(
                168deg,
                rgba(255,247,252,0.55) 0px,
                rgba(255,247,252,0.55) ${Math.max(2, size * 0.018)}px,
                transparent ${Math.max(2, size * 0.018)}px,
                transparent ${Math.max(7, size * 0.062)}px
              )`,
            }}
          />
        )}

        {/* Two soft surface features — keeps large planets from looking like a gradient swatch */}
        <div
          className="absolute rounded-full opacity-[0.30]"
          style={{
            width: size * 0.34, height: size * 0.22,
            left: size * 0.44, top: size * 0.53,
            background: `radial-gradient(circle, ${t.edge} 0%, transparent 70%)`,
            filter: `blur(${size * 0.02}px)`,
          }}
        />
        <div
          className="absolute rounded-full opacity-[0.22]"
          style={{
            width: size * 0.2, height: size * 0.14,
            left: size * 0.18, top: size * 0.24,
            background: `radial-gradient(circle, ${t.lit} 0%, transparent 72%)`,
            filter: `blur(${size * 0.018}px)`,
          }}
        />
      </div>

      {/* Bright atmospheric limb on the lit side */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `inset ${size * 0.012}px ${size * 0.012}px ${size * 0.05}px ${t.rim}`,
          opacity: 0.5,
        }}
      />

      {ring && <PlanetRing size={size} tone={t} tilt={ringTilt} half="front" />}
    </div>
  )
}

/** Elliptical ring, split so half renders behind the planet and half in front. */
function PlanetRing({ size, tone, tilt, half }) {
  const w = size * 2.05
  const h = size * 2.05

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: w,
        height: h,
        left: (size - w) / 2,
        top: (size - h) / 2,
        transform: `rotate(${tilt}deg) scaleY(0.26)`,
        /* Clip to the far or near half of the ellipse */
        clipPath: half === 'back' ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)',
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `${Math.max(1.5, size * 0.035)}px solid ${tone.rim}`,
          opacity: half === 'back' ? 0.30 : 0.55,
          boxShadow: `0 0 ${size * 0.12}px ${tone.glow}`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: `${size * 0.14}px`,
          border: `${Math.max(1, size * 0.018)}px solid ${tone.rim}`,
          opacity: half === 'back' ? 0.16 : 0.30,
        }}
      />
    </div>
  )
}

/**
 * An orbital track with a body travelling along it. The flattening scaleY
 * lives on the outer element so the moon's path is elliptical too.
 */
export function OrbitSystem({
  size,
  tilt = -18,
  flatten = 0.34,
  duration = 28,
  moonSize = 10,
  tone = 'lavender',
  showTrack = true,
  className = '',
  style = {},
}) {
  const t = TONES[tone] || TONES.lavender

  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotate(${tilt}deg) scaleY(${flatten})` }}
      >
        {showTrack && (
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${t.rim}`, opacity: 0.16 }}
          />
        )}

        {/* Rotating carrier — the moon rides its edge */}
        <div className="absolute inset-0 animate-orbit motion-reduce:animate-none" style={{ animationDuration: `${duration}s` }}>
          <div
            className="absolute rounded-full"
            style={{
              width: moonSize,
              height: moonSize,
              left: `calc(50% - ${moonSize / 2}px)`,
              top: `-${moonSize / 2}px`,
              /* Undo the flatten so the moon stays round while its path is elliptical */
              transform: `scaleY(${1 / flatten})`,
              background: `radial-gradient(circle at 34% 30%, ${t.lit} 0%, ${t.mid} 55%, ${t.low} 100%)`,
              boxShadow: `0 0 ${moonSize}px ${t.glow}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Curved planet limb rising from the bottom of a section — the strongest
 * "you are above a world" cue, and cheap: one oversized rounded div.
 */
export function PlanetHorizon({ tone = 'pink', height = 340, className = '' }) {
  const t = TONES[tone] || TONES.pink
  return (
    <div className={`absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none ${className}`} style={{ height }}>
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: '190%',
          height: height * 2.6,
          top: height * 0.42,
          background: 'linear-gradient(to bottom, #16091F 0%, #0D0812 45%, #0D0812 100%)',
          boxShadow: `
            0 -1px 0 0 ${t.rim},
            0 -14px 40px -6px ${t.glow},
            0 -46px 90px -10px rgba(217,70,239,0.22)
          `,
        }}
      />
    </div>
  )
}

/** Tiled two-layer starfield with optional parallax drift. */
export function Starfield({ className = '', opacity = 0.55, drift = true }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity }}>
      <div className={`absolute -inset-[10%] starfield ${drift ? 'animate-planet-drift motion-reduce:animate-none' : ''}`} />
      <div
        className="absolute -inset-[10%] starfield-near animate-twinkle motion-reduce:animate-none"
        style={{ animationDuration: '6.5s' }}
      />
    </div>
  )
}

/**
 * Full hero scene. Large bodies are hidden on small screens where they
 * would crowd the type rather than frame it.
 */
export function HeroCosmos() {
  /* Layout is deliberately keyed to the hero's occupied regions: centred type,
     the code terminal on the right, mono labels on the left edge. Bodies fill
     the left-middle and lower-right voids, mostly cropped by the viewport so
     they read as scale rather than clutter. */
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <Starfield opacity={0.6} />

      {/* Primary world — limb cropped by the left edge, vertically centred.
          Positioned with calc rather than a translate so the drift animation
          keeps sole ownership of `transform`. */}
      <Planet
        size={300}
        tone="pink"
        light="36% 24%"
        bands
        className="hidden md:block animate-planet-drift motion-reduce:animate-none"
        /* Held just under full strength so the headline stays the brightest
           thing in the hero. */
        style={{ left: '-152px', top: 'calc(50% - 150px)', animationDuration: '26s', opacity: 0.86 }}
      />

      {/* Its moon — orbit centred on the primary world, so the pair reads
          as one system. Cyan appears here and nowhere else in the scene. */}
      <OrbitSystem
        size={470}
        tone="cyan"
        tilt={-14}
        flatten={0.3}
        duration={46}
        moonSize={9}
        className="hidden md:block"
        style={{ left: '-237px', top: 'calc(50% - 235px)' }}
      />

      {/* Ringed companion, lower right */}
      <Planet
        size={150}
        tone="lavender"
        light="30% 28%"
        ring
        ringTilt={-24}
        className="hidden lg:block animate-planet-drift motion-reduce:animate-none"
        style={{ right: '4%', bottom: '10%', animationDuration: '34s', animationDelay: '2s' }}
      />

      {/* Distant satellite — tucked left of the code terminal */}
      <Planet
        size={52}
        tone="magenta"
        light="36% 30%"
        glowScale={2}
        className="hidden sm:block animate-planet-drift motion-reduce:animate-none"
        style={{ right: '34%', top: '9%', animationDuration: '19s', animationDelay: '1.2s' }}
      />

      <PlanetHorizon tone="pink" height={300} />
    </div>
  )
}

/**
 * Lighter per-section scene so the whole page reads as one continuous
 * space rather than a cosmic hero bolted onto a flat page.
 */
export function SectionCosmos({
  planet = 'lavender',
  size = 130,
  position = { right: '-52px', top: '8%' },
  ring = false,
  orbit = false,
  stars = true,
  starOpacity = 0.34,
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars && <Starfield opacity={starOpacity} drift={false} />}

      <Planet
        size={size}
        tone={planet}
        ring={ring}
        light="33% 27%"
        className="hidden md:block animate-planet-drift motion-reduce:animate-none"
        style={{ ...position, animationDuration: '30s' }}
      />

      {orbit && (
        <OrbitSystem
          size={size * 2.6}
          tone={planet}
          duration={54}
          moonSize={7}
          className="hidden lg:block"
          style={{
            ...position,
            left: position.left ? position.left : undefined,
            marginLeft: position.left ? -size * 0.8 : undefined,
            marginRight: position.right ? -size * 0.8 : undefined,
            marginTop: -size * 0.8,
          }}
        />
      )}
    </div>
  )
}
