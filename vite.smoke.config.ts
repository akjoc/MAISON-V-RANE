import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds the real application entry as a single IIFE so it can be executed in a
// DOM harness (scripts/motion-check.mjs) without a browser.
export default defineConfig({
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
