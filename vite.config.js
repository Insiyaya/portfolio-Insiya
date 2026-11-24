import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Canonical path: Windows terminals may report "c:" where Vite resolves "C:",
// and the mismatch breaks inline styles in index.html.
const root = realpathSync.native(process.cwd())

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(root, 'src') },
  },
  build: {
    // three.js is one lazy chunk, loaded behind the intro
    chunkSizeWarningLimit: 900,
  },
})
