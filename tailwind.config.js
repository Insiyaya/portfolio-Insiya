/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        blob:       'blob 9s ease-in-out infinite',
        blob2:      'blob2 11s ease-in-out infinite',
        blob3:      'blob3 13s ease-in-out infinite',
        shimmer:    'shimmer 5s linear infinite',
        floatY:     'floatY 2.5s ease-in-out infinite',
        'spin-slow':'spin 12s linear infinite',
        blink:      'blink 1.1s step-end infinite',
      },
      keyframes: {
        blob:    { '0%,100%':{ transform:'translate(0,0) scale(1)' }, '33%':{ transform:'translate(28px,-45px) scale(1.08)' }, '66%':{ transform:'translate(-18px,22px) scale(0.94)' } },
        blob2:   { '0%,100%':{ transform:'translate(0,0) scale(1)' }, '33%':{ transform:'translate(-30px,40px) scale(1.12)' }, '66%':{ transform:'translate(36px,-18px) scale(0.88)' } },
        blob3:   { '0%,100%':{ transform:'translate(0,0) scale(1)' }, '33%':{ transform:'translate(22px,28px) scale(0.92)' }, '66%':{ transform:'translate(-28px,-36px) scale(1.06)' } },
        shimmer: { '0%':{ backgroundPosition:'200% 0' }, '100%':{ backgroundPosition:'-200% 0' } },
        floatY:  { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(8px)' } },
        blink:   { '0%,100%':{ opacity:1 }, '50%':{ opacity:0 } },
      },
    },
  },
  plugins: [],
}
