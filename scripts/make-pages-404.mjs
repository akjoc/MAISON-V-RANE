/**
 * GitHub Pages post-build step.
 *
 * Pages has no rewrite rules, so any deep link (`/MAISON-V-RANE/watches/...`)
 * is answered with `404.html`. This writes a 404 page that hands the requested
 * path to the app: it stores the path in sessionStorage, returns to the project
 * root, and the tiny script in index.html restores it with replaceState — so
 * BrowserRouter sees the URL the visitor actually asked for.
 *
 * Also writes `.nojekyll` so Pages serves the build verbatim.
 *
 *   GITHUB_PAGES=true npm run build && node scripts/make-pages-404.mjs
 *   PAGES_BASE=/other-repo/ node scripts/make-pages-404.mjs
 */
import { writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const outDir = process.env.OUT_DIR ?? 'dist'
const base = process.env.PAGES_BASE ?? '/MAISON-V-RANE/'
const normalised = base.endsWith('/') ? base : `${base}/`

if (!existsSync(join(outDir, 'index.html'))) {
  console.error(`No ${outDir}/index.html — run the build first.`)
  process.exit(1)
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>MAISON VÉRANE — opening…</title>
    <script>
      // Deep-link handover. Runs before anything is painted, so the visitor
      // lands on the requested route instead of a 404 page.
      (function () {
        var base = ${JSON.stringify(normalised)}
        var target = location.pathname + location.search + location.hash
        try {
          sessionStorage.setItem('mv:gh-redirect', target)
        } catch (e) {
          /* storage blocked — fall back to the project root */
        }
        location.replace(base)
      })()
    </script>
    <noscript>
      <p style="font-family: Georgia, serif; padding: 2rem">
        This experience uses JavaScript.
        <a href="${normalised}">Open MAISON VÉRANE</a>.
      </p>
    </noscript>
  </head>
  <body></body>
</html>
`

writeFileSync(join(outDir, '404.html'), html)
writeFileSync(join(outDir, '.nojekyll'), '')
console.log(`Wrote ${outDir}/404.html and ${outDir}/.nojekyll (base ${normalised})`)
