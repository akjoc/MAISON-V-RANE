import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages serves this repository from https://<user>.github.io/<repo>/, so
 * the production build has to be base-relative. Local development and preview
 * keep serving from the root, which is what the sandbox preview expects.
 *
 *   GITHUB_PAGES=true npm run build      → /MAISON-V-RANE/
 *   PAGES_BASE=/other-repo/ ...          → override the subpath
 */
// The config runs in Node; declaring `process` here keeps the project's own
// type-check (which targets the browser) happy without adding @types/node.
declare const process: { env: Record<string, string | undefined> }

const PAGES_BASE = process.env.PAGES_BASE ?? '/MAISON-V-RANE/'
const base = process.env.GITHUB_PAGES ? PAGES_BASE : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three'
          if (id.includes('node_modules/lenis')) return 'motion'
          return undefined
        },
      },
    },
  },
})
