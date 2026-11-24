/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      /* Values live in src/index.css so plain CSS and utilities share them. */
      colors: {
        ink: 'var(--ink)',
        soft: 'var(--soft)',
        dim: 'var(--dim)',
        paper: 'var(--paper)',
        violet: { DEFAULT: 'var(--violet)', soft: 'var(--violet-soft)' },
        pink: 'var(--pink)',
        mint: 'var(--mint)',
        line: 'rgba(255, 255, 255, 0.16)',
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'Arial', 'sans-serif'],
        serif: ['"Newsreader Variable"', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
