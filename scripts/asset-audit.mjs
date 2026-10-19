/**
 * Asset audit.
 *
 * Renders the main routes on the server, harvests every image/video URL the
 * components actually emit (including srcset candidates), then checks that each
 * one maps to a file in /public and is served with a 200 from the dev server.
 *
 *   node scripts/asset-audit.mjs            # file check only
 *   BASE=http://127.0.0.1:5173 node scripts/asset-audit.mjs   # + HTTP check
 */
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const routes = [
  ['/', '/src/pages/Home.tsx', 'Home'],
  ['/collections/aeroform', '/src/pages/CollectionAeroform.tsx', 'default'],
  ['/watches', '/src/pages/Watches.tsx', 'default'],
  ['/watches/aeroform-40-graphite', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-40-champagne', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/craftsmanship', '/src/pages/Craftsmanship.tsx', 'default'],
  ['/watchmaking', '/src/pages/Watchmaking.tsx', 'default'],
  ['/services', '/src/pages/Services.tsx', 'default'],
  ['/appointments', '/src/pages/Appointments.tsx', 'default'],
  ['/boutiques', '/src/pages/Boutiques.tsx', 'default'],
  ['/watches/aeroform-38-nocturne', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-gt-chronograph', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-skeleton-edition', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-40-oxblood', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/services/personalisation', '/src/pages/Personalisation.tsx', 'default'],
  ['/services/care-repair', '/src/pages/CareRepair.tsx', 'default'],
  ['/search?q=graphite', '/src/pages/SearchPage.tsx', 'default'],
  ['/wishlist', '/src/pages/Wishlist.tsx', 'default'],
  ['/cart', '/src/pages/Cart.tsx', 'default'],
  ['/checkout', '/src/pages/Checkout.tsx', 'default'],
  ['/account', '/src/pages/Account.tsx', 'default'],
  ['/client-care', '/src/pages/Info.tsx', 'default', { page: 'client-care' }],
  ['/contact', '/src/pages/Info.tsx', 'default', { page: 'contact' }],
]

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { StoreProvider } = await server.ssrLoadModule('/src/context/StoreContext.tsx')
const { UIProvider } = await server.ssrLoadModule('/src/context/UIContext.tsx')

const urls = new Map()

for (const [pathName, file, exportName, props, pattern] of routes) {
  const mod = await server.ssrLoadModule(file)
  const Component = mod[exportName] ?? mod.default
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: [pathName] },
      React.createElement(
        StoreProvider,
        null,
        React.createElement(
          UIProvider,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: pattern ?? pathName.split('?')[0],
              element: React.createElement(Component, props),
            }),
          ),
        ),
      ),
    ),
  )

  for (const match of html.matchAll(/(?:src|srcSet|poster)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0]
      if (url?.startsWith('/assets/')) {
        if (!urls.has(url)) urls.set(url, [])
        urls.get(url).push(pathName)
      }
    }
  }
}

await server.close()

const missing = []
for (const [url, pages] of urls) {
  const file = join('public', url.split('?')[0])
  if (!existsSync(file)) missing.push({ url, pages })
}

let httpFailures = 0
const base = process.env.BASE
if (base) {
  await Promise.all(
    [...urls.keys()].map(async (url) => {
      try {
        const res = await fetch(base.replace(/\/$/, '') + url, { method: 'GET' })
        if (res.status !== 200) {
          httpFailures += 1
          console.error(`HTTP ${res.status} ${url}`)
        }
        await res.arrayBuffer()
      } catch (error) {
        httpFailures += 1
        console.error(`ERR ${url} — ${error.message}`)
      }
    }),
  )
}

console.log(`${urls.size} asset URLs referenced across ${routes.length} routes`)
if (missing.length) {
  console.error(`\n${missing.length} missing file(s):`)
  for (const item of missing) console.error(`  ${item.url}  (from ${[...new Set(item.pages)].join(', ')})`)
} else {
  console.log('all referenced files exist in public/')
}
if (base) console.log(httpFailures === 0 ? 'all URLs served 200' : `${httpFailures} HTTP failure(s)`)

process.exit(missing.length === 0 && httpFailures === 0 ? 0 : 1)
