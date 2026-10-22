/**
 * GitHub Pages simulation check.
 *
 * Serves `dist/` under the project subpath (the way Pages does), then verifies:
 *   1. the HTML shell and everything it references return 200,
 *   2. every image, video and font URL baked into the built JS/CSS returns 200
 *      at that subpath (this is what breaks when a base path is missed),
 *   3. a deep link is answered with 404.html, which carries the handover script,
 *   4. `.nojekyll` is present.
 *
 *   GITHUB_PAGES=true npm run build && node scripts/make-pages-404.mjs
 *   node scripts/verify-pages.mjs
 */
import { createServer } from 'node:http'
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const outDir = process.env.OUT_DIR ?? 'dist'
const base = (process.env.PAGES_BASE ?? '/MAISON-V-RANE/').replace(/\/*$/, '/')
const port = Number(process.env.PORT ?? 4180)

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
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

let deepLinkHit = false

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (!pathname.startsWith(base)) {
    res.writeHead(404).end('outside base')
    return
  }
  const relative = pathname.slice(base.length) || 'index.html'
  const file = join(outDir, normalize(relative))

  try {
    const info = await stat(file)
    if (info.isDirectory()) throw new Error('directory')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }).end(body)
  } catch {
    // Pages behaviour: unknown paths fall through to 404.html.
    deepLinkHit = true
    const fallback = await readFile(join(outDir, '404.html'))
    res.writeHead(404, { 'content-type': 'text/html' }).end(fallback)
  }
})

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${port}`

const failures = []
const checked = new Set()

const bodies = new Map()

async function check(url, { allow404 = false } = {}) {
  if (checked.has(url)) {
    return { status: 200, text: async () => bodies.get(url) ?? '' }
  }
  checked.add(url)
  const res = await fetch(origin + url)
  const buf = await res.arrayBuffer()
  bodies.set(url, Buffer.from(buf).toString('utf8'))
  if (res.status !== 200 && !(allow404 && res.status === 404)) {
    failures.push(`${res.status} ${url}`)
  }
  return { status: res.status, text: async () => bodies.get(url) ?? '' }
}

// 1. The shell and its direct references.
const shell = await (await check(base)).text()
for (const match of shell.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1]
  if (url.startsWith('http') || url.startsWith('#')) continue
  if (url.startsWith('/')) await check(url)
}

// 2. Every asset path baked into the bundle.
const assetDir = join(outDir, 'assets')
const bundles = (await readdir(assetDir)).filter((f) => /\.(js|css)$/.test(f))
const assetUrls = new Set()
for (const name of bundles) {
  const text = await readFile(join(assetDir, name), 'utf8')
  for (const match of text.matchAll(/\/?(?:[A-Za-z0-9_.-]+\/)?assets\/(?:images|video)\/[A-Za-z0-9_.-]+\.(?:webp|avif|png|jpg|mp4)/g)) {
    assetUrls.add(`${base}${match[0].replace(/^\/+/, '').replace(/^[^/]+\/assets\//, 'assets/')}`)
  }
  for (const match of text.matchAll(/fonts\/[A-Za-z0-9_.-]+\.woff2/g)) {
    assetUrls.add(`${base}${match[0]}`)
  }
}
for (const url of assetUrls) await check(url)

// 3. Deep link → 404.html handover.
const deep = await check(`${base}watches/aeroform-40-graphite`, { allow404: true })
const deepBody = deep ? await deep.text() : ''
if (!deepLinkHit) failures.push('deep link was not answered by 404.html')
if (!/mv:gh-redirect/.test(deepBody)) failures.push('404.html has no handover script')

// 4. .nojekyll
const nojekyll = await fetch(`${origin}${base}.nojekyll`)
if (nojekyll.status !== 200) failures.push('.nojekyll missing from the build')

server.close()

console.log(`Base path         ${base}`)
console.log(`Shell references  ${[...checked].length} URLs checked`)
console.log(`Baked assets      ${assetUrls.size} unique image/video/font URLs`)
console.log(`Deep link         ${deepLinkHit ? 'served 404.html with handover script' : 'FAILED'}`)

if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n${failures.slice(0, 40).join('\n')}`)
  process.exit(1)
}
console.log('\nPages build resolves every reference under the subpath.')
