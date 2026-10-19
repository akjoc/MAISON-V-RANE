/**
 * Renders every route on the server to catch render-time runtime errors.
 * Effects and browser APIs are not exercised (that is what the manual QA covers).
 *
 *   node scripts/render-check.mjs
 */
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const routes = [
  ['/', '/src/pages/Home.tsx', 'Home'],
  ['/collections/aeroform', '/src/pages/CollectionAeroform.tsx', 'default'],
  ['/watches', '/src/pages/Watches.tsx', 'default'],
  ['/watches/aeroform-40-graphite', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-40-champagne', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-38-nocturne', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-gt-chronograph', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-skeleton-edition', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/aeroform-40-oxblood', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/watches/not-a-reference', '/src/pages/WatchDetail.tsx', 'default', undefined, '/watches/:slug'],
  ['/craftsmanship', '/src/pages/Craftsmanship.tsx', 'default'],
  ['/watchmaking', '/src/pages/Watchmaking.tsx', 'default'],
  ['/services', '/src/pages/Services.tsx', 'default'],
  ['/services/personalisation', '/src/pages/Personalisation.tsx', 'default'],
  ['/services/care-repair', '/src/pages/CareRepair.tsx', 'default'],
  ['/appointments', '/src/pages/Appointments.tsx', 'default'],
  ['/boutiques', '/src/pages/Boutiques.tsx', 'default'],
  ['/search?q=graphite', '/src/pages/SearchPage.tsx', 'default'],
  ['/wishlist', '/src/pages/Wishlist.tsx', 'default'],
  ['/cart', '/src/pages/Cart.tsx', 'default'],
  ['/checkout', '/src/pages/Checkout.tsx', 'default'],
  ['/account', '/src/pages/Account.tsx', 'default'],
  ['/client-care', '/src/pages/Info.tsx', 'default', { page: 'client-care' }],
  ['/faq', '/src/pages/Info.tsx', 'default', { page: 'faq' }],
  ['/contact', '/src/pages/Info.tsx', 'default', { page: 'contact' }],
  ['/shipping-returns', '/src/pages/Info.tsx', 'default', { page: 'shipping-returns' }],
  ['/about', '/src/pages/Info.tsx', 'default', { page: 'about' }],
  ['/legal/privacy', '/src/pages/Legal.tsx', 'default', undefined, '/legal/:section'],
  ['/nope', '/src/pages/NotFound.tsx', 'default'],
]

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })

const { StoreProvider } = await server.ssrLoadModule('/src/context/StoreContext.tsx')
const { UIProvider } = await server.ssrLoadModule('/src/context/UIContext.tsx')

let failures = 0
for (const [pathName, file, exportName, props, pattern] of routes) {
  try {
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
    if (!html || html.length < 200) throw new Error(`suspiciously short output (${html.length} chars)`)
    console.log(`ok   ${pathName.padEnd(36)} ${String(html.length).padStart(6)} chars`)
  } catch (error) {
    failures += 1
    console.error(`FAIL ${pathName}`)
    console.error('     ', error?.message ?? error)
  }
}

await server.close()
console.log(failures === 0 ? '\nAll routes render.' : `\n${failures} route(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
