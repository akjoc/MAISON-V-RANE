import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds the real application entry as a single IIFE so it can be executed in a
// DOM harness (scripts/motion-check.mjs) without a browser.
declare const process: { env: Record<string, string | undefined> }

// Mirrors the app config so the harness can test the GitHub Pages subpath too.
const PAGES_BASE = process.env.PAGES_BASE ?? '/MAISON-V-RANE/'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? PAGES_BASE : '/',
  plugins: [react()],
  define: { 'process.env.NODE_ENV': '"development"' },
  build: {
    outDir: 'dist-smoke',
    cssCodeSplit: false,
    minify: false,
    lib: {
      entry: 'src/main.tsx',
      name: 'MVApp',
      formats: ['iife'],
      fileName: () => 'app.iife.js',
    },
  },
})
