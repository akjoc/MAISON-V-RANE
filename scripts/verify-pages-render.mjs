/**
 * Proves the GitHub Pages build actually renders with working media.
 *
 * Builds the real entry with `base = /MAISON-V-RANE/` as a single script, runs
 * it in jsdom at a Pages-shaped URL, harvests every image, poster and video URL
 * the components produced, and fetches each one from a static server that
 * serves `dist/` under that subpath (404s fall through to 404.html, exactly as
 * Pages behaves).
 *
 *   GITHUB_PAGES=true npm run build && node scripts/make-pages-404.mjs
 *   node scripts/verify-pages-render.mjs /collections/aeroform
 */
import { createServer } from 'node:http'
import { readFile, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { extname, join, normalize } from 'node:path'
import { JSDOM, VirtualConsole } from 'jsdom'

const route = process.argv[2] ?? '/collections/aeroform'
const outDir = process.env.OUT_DIR ?? 'dist'
const base = (process.env.PAGES_BASE ?? '/MAISON-V-RANE/').replace(/\/*$/, '/')
const port = Number(process.env.PORT ?? 4181)

if (!existsSync(join(outDir, 'index.html'))) {
  console.error(`No ${outDir}/index.html — run the Pages build first.`)
  process.exit(1)
}

// 1. Build the harness bundle with the Pages base.
execFileSync('npx', ['vite', 'build', '--config', 'vite.smoke.config.ts'], {
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true', PAGES_BASE: base },
})
const bundle = await readFile('dist-smoke/app.iife.js', 'utf8')

// 2. Serve dist/ under the subpath, Pages-style.
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
}
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (!pathname.startsWith(base)) return res.writeHead(404).end('outside base')
  const file = join(outDir, normalize(pathname.slice(base.length) || 'index.html'))
  try {
    const info = await stat(file)
    if (info.isDirectory()) throw new Error('dir')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/html' }).end(await readFile(join(outDir, '404.html')))
  }
})
await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${port}`

// 3. Run the app at a Pages URL.
const errors = []
const virtualConsole = new VirtualConsole()
virtualConsole.on('jsdomError', (e) => {
  if (!/HTMLMediaElement/.test(e.message)) errors.push(`jsdom: ${e.message}`)
})
virtualConsole.on('error', (...args) => errors.push(`console.error: ${args.map(String).join(' ')}`.slice(0, 300)))

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: `${origin}${base.replace(/\/$/, '')}${route}`,
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
})
const { window } = dom
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})
window.IntersectionObserver = class {
  constructor(cb) {
    this.cb = cb
  }
  observe(target) {
    window.setTimeout(() => this.cb([{ isIntersecting: true, target }], this), 0)
  }
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.HTMLCanvasElement.prototype.getContext = () => null
window.scrollTo = () => {}

window.eval(bundle)
await new Promise((resolve) => window.setTimeout(resolve, 1200))

const document = window.document

// 4. Harvest every media URL the components produced.
const urls = new Set()
const addCandidate = (value) => {
  if (!value) return
  for (const part of String(value).split(',')) {
    const url = part.trim().split(/\s+/)[0]
    if (url && url.includes('/assets/')) urls.add(url)
  }
}
for (const img of document.querySelectorAll('img')) {
  addCandidate(img.getAttribute('src'))
  addCandidate(img.getAttribute('srcSet') ?? img.getAttribute('srcset'))
}
for (const source of document.querySelectorAll('source')) {
  addCandidate(source.getAttribute('src'))
  addCandidate(source.getAttribute('srcSet') ?? source.getAttribute('srcset'))
}
for (const video of document.querySelectorAll('video')) addCandidate(video.getAttribute('poster'))

// Where did a given URL come from? Helps trace a wrong width ladder.
const sources = new Map()
const record = (url, el) => {
  if (!url || !sources.has(url)) sources.set(url, el.outerHTML.slice(0, 160))
}
for (const img of document.querySelectorAll('img')) {
  for (const part of (img.getAttribute('srcSet') ?? '').split(',')) {
    const url = part.trim().split(/\s+/)[0]
    if (url) record(url, img)
  }
  if (img.getAttribute('src')) record(img.getAttribute('src'), img)
}

const missingBase = [...urls].filter((url) => !url.startsWith(base))
const failures = []
const checkedUrls = [...urls].filter((u) => u.startsWith(base))
// Fetch in small batches: sequential requests to a local server are slow,
// unbounded concurrency is unkind to the sandbox.
for (let i = 0; i < checkedUrls.length; i += 8) {
  await Promise.all(
    checkedUrls.slice(i, i + 8).map(async (url) => {
      const res = await fetch(origin + url)
      await res.arrayBuffer()
      if (res.status !== 200) failures.push(`${res.status} ${url}`)
    }),
  )
}

const rendered = document.querySelector('#root')?.textContent ?? ''
if (process.env.DEBUG === '1') {
  console.log('DEBUG imgs:', document.querySelectorAll('img').length)
  console.log('DEBUG root html length:', document.querySelector('#root')?.innerHTML.length)
  console.log('DEBUG text:', rendered.slice(0, 300))
  console.log('DEBUG h1:', document.querySelector('h1')?.textContent)
}
const report = {
  url: `${base.replace(/\/$/, '')}${route}`,
  mounted: Boolean(document.querySelector('#root')?.children.length),
  notFound: /Page not found|404/i.test(rendered.slice(0, 400)),
  mediaUrls: urls.size,
  missingBase: missingBase.length,
  httpFailures: failures.length,
  sample: [...urls].slice(0, 3),
  errors: errors.slice(0, 5),
}

server.close()
console.log(JSON.stringify(report, null, 2))

const problems = []
if (!report.mounted) problems.push('application did not mount')
if (report.notFound) problems.push('router showed the not-found page at the Pages URL')
if (report.mediaUrls === 0) problems.push('no media URLs rendered')
if (missingBase.length) problems.push(`${missingBase.length} URL(s) missing the subpath: ${missingBase.slice(0, 5).join(', ')}`)
problems.push(...failures.slice(0, 10), ...report.errors)

if (process.env.DEBUG === '1' && failures.length) {
  for (const line of failures.slice(0, 4)) {
    const url = line.split(' ')[1]
    console.log('\nORIGIN', url, '\n ', sources.get(url))
  }
}

window.close()
if (problems.length) {
  console.error(`\nFAIL\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('\nEvery rendered media URL resolves under the GitHub Pages subpath.')
// jsdom keeps timers alive; the check itself is done.
process.exit(0)
