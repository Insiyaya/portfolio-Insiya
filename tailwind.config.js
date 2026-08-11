/** @type {import('tailwindcss').Config} */

/* ──────────────────────────────────────────────────────────────
   DESIGN TOKENS — "Cyber Femme" theme
   Mirrors the CSS custom properties declared in src/index.css.
   Ratio target: ~75% dark purple · 15% pink · 7% lavender · 3% cyan
   ────────────────────────────────────────────────────────────── */
const tokens = {
  void:     '#0D0812',  // page background — very dark purple-black
  surface:  '#160D1C',  // primary surface (cards, sections)
  surface2: '#211126',  // elevated components
  surface3: '#2B1732',  // highest elevation / hover fills
  line:     '#33203A',  // default border
  line2:    '#4A294F',  // stronger border (secondary CTA)

  hotpink:  '#FF2DAA',  // primary brand accent
  neon:     '#FF4FC3',  // highlights + hover
  magenta:  '#D946EF',  // secondary accent
  lavender: '#C084FC',  // gradients + soft highlights
  softpink: '#F9A8D4',  // sparing soft accent
  cyber:    '#67E8F9',  // AI / technical details ONLY — use rarely

  ink:      '#FFF7FC',  // primary text
  dim:      '#C4B5C9',  // secondary text
  faint:    '#8F7A96',  // muted text
}

/* Neutral text ramp — purple-tinted, replaces Tailwind's cold blue-grey
   slate scale so every existing `text-slate-*` lands inside the system. */
const neutral = {
  50:  '#FFFDFE',
  100: '#FFFBFD',
  200: '#FFF7FC',
  300: '#E4D3E9',
  400: '#C4B5C9',
  500: '#A38FAA',
  600: '#8F7A96',
  700: '#6B5572',
  800: '#4A294F',
  900: '#211126',
  950: '#160D1C',
}

/* Legacy palette aliases — the previous theme used indigo/violet/sky/emerald.
   Remapping them keeps any stray utility class inside the new palette. */
const pinkScale     = { 200:'#FFD1EC', 300:'#FFA8DC', 400:'#FF4FC3', 500:'#FF2DAA', 600:'#E0128C', 700:'#B00E6E' }
const magentaScale  = { 200:'#F5D0FE', 300:'#EBA8FB', 400:'#D946EF', 500:'#C026D3', 600:'#A21CAF', 700:'#86198F' }
const lavenderScale = { 200:'#EBDCFF', 300:'#DCC6FF', 400:'#C084FC', 500:'#A855F7', 600:'#9333EA', 700:'#7E22CE' }
const cyberScale    = { 200:'#CFFAFE', 300:'#A5F3FC', 400:'#67E8F9', 500:'#22D3EE', 600:'#06B6D4', 700:'#0E7490' }

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ...tokens,
        slate:   neutral,
        indigo:  pinkScale,
        violet:  magentaScale,
        sky:     lavenderScale,
        emerald: cyberScale,
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        /* Glow is an accent, never ambience — keep alphas low. */
        'glow-xs':   '0 0 0 1px rgba(255,45,170,0.16)',
        'glow-sm':   '0 4px 18px rgba(255,45,170,0.18)',
        'glow-md':   '0 10px 34px rgba(255,45,170,0.22)',
        'glow-lg':   '0 18px 54px rgba(255,45,170,0.26)',
        'glow-mag':  '0 14px 44px rgba(217,70,239,0.20)',
        'glow-lav':  '0 14px 44px rgba(192,132,252,0.18)',
        'glow-cyan': '0 10px 34px rgba(103,232,249,0.16)',
        'inset-hair':'inset 0 1px 0 rgba(255,247,252,0.05)',
      },
      backgroundImage: {
        'grad-brand':  'linear-gradient(90deg, #FF2DAA 0%, #D946EF 52%, #C084FC 100%)',
        'grad-brand-d':'linear-gradient(135deg, #FF2DAA 0%, #D946EF 55%, #C084FC 100%)',
      },
      /* Only compositor-friendly properties (transform / opacity) are animated
         here, so ambient motion stays off the main thread while scrolling.
         `shimmer` is the one exception and is applied to text backgrounds only. */
      animation: {
        shimmer:     'shimmer 6s linear infinite',
        'spin-slow': 'spin 14s linear infinite',
        blink:       'blink 1.1s step-end infinite',
        'pulse-dot': 'pulseDot 2.4s ease-in-out infinite',
        /* ── Planetary motion — slow enough to feel like orbit, not spin ── */
        orbit:       'orbit 28s linear infinite',
        twinkle:     'twinkle 5.5s ease-in-out infinite',
        'planet-drift': 'planetDrift 22s ease-in-out infinite',
        surface:     'surface 14s linear infinite',
      },
      keyframes: {
        shimmer: { '0%':{ backgroundPosition:'200% 0' }, '100%':{ backgroundPosition:'-200% 0' } },
        blink:   { '0%,100%':{ opacity:1 }, '50%':{ opacity:0 } },
        pulseDot:{ '0%,100%':{ opacity:1, transform:'scale(1)' }, '50%':{ opacity:0.45, transform:'scale(0.82)' } },
        orbit:   { '0%':{ transform:'rotate(0deg)' }, '100%':{ transform:'rotate(360deg)' } },
        twinkle: { '0%,100%':{ opacity:'0.35' }, '50%':{ opacity:'0.9' } },
        planetDrift: {
          '0%,100%': { transform:'translate3d(0,0,0)' },
          '50%':     { transform:'translate3d(-14px,18px,0)' },
        },
        /* Scrolls a planet's longitude stripes by exactly one 13px period, so
           the surface appears to rotate with no visible seam. Uses transform
           rather than background-position to stay on the compositor. */
        surface: {
          '0%':   { transform:'translate3d(0,0,0)' },
          '100%': { transform:'translate3d(13px,0,0)' },
        },
      },
    },
  },
  plugins: [],
}
