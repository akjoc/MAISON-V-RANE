# MAISON VÉRANE — Aéroform

An original, fictional luxury watchmaking house, built as a full React prototype. The site pairs a
restrained editorial art direction (warm ivory, graphite, brushed silver, champagne, oxblood) with
slow, precise motion, an optional interactive 3D study, and a complete set of working commerce
interactions — all clearly labelled as demonstration content.

> **Fictional brand.** MAISON VÉRANE does not exist. Every product, price, reference, boutique,
> service, address, order and appointment on this site is invented. No payment is taken, no form is
> transmitted, and no order or booking is created. No Cartier campaign photography, branding,
> layouts or artwork has been reproduced.

---

## Stack

- **React 19 + TypeScript + Vite 8**
- **React Router 7** (all routes; browser back/forward supported)
- **GSAP 3 + ScrollTrigger** for reveals, pinned sequences and scroll-linked transitions
- **Lenis** for smooth scrolling, wired into GSAP’s ticker and disabled under reduced motion
- **Three.js via @react-three/fiber + drei** for an opt-in, stylised procedural watch study
- **Plain CSS** design system (`src/styles/`) with tokens, layout, components and page layers
- **sharp** for the AVIF/WebP asset pipeline

No UI framework, CSS-in-JS runtime, map SDK or external image host is required.

---

## Setup

```bash
# Node 20+ recommended (built on Node 22)
npm install
npm run dev          # http://localhost:5173
```

Production build and preview:

```bash
npm run build        # type-check (tsc -b) then vite build
npm run preview      # http://localhost:4173
```

Asset pipeline (optional — already-generated derivatives are committed):

```bash
npm run optimize-assets
```

Reads source renders from `raw/` and writes responsive AVIF/WebP plus derived gallery crops to
`public/assets/images`. See **ASSETS.md** for the full inventory and provenance.

---

## What is implemented

### Pages and routes

| Route | Page | Notable interactions |
| --- | --- | --- |
| `/` | Home | Video hero with poster + controls + fallback, parallax editorial, featured grid, alternating story, dark craft band, **scroll-scrubbed film**, campaign, material studies, services, appointment invitation |
| `/collections/aeroform` | Flagship collection | Editorial hero, philosophy, four style directions, featured references, **scroll-rotated 3D study with hotspots and finish switching**, **scroll-scrubbed film**, dial/bracelet detail, interactive strap selector |
| `/watches` | Catalogue | URL-synced filters (dial, material, case size, movement, strap, availability), filter drawer, sort menu, grid/list views, active chips, load more, empty state |
| `/watches/:slug` | Product detail | Gallery with thumbnails, swipe and zoom, 360/interactive study tab, reference + strap selection, quantity, add to bag, wishlist, availability, five accordions, recommendations, 404 for unknown slugs |
| `/craftsmanship` | Editorial feature | Full-bleed hero, four disciplines, pinned material sequence (GSAP), **scroll-scrubbed atelier film**, closing CTA |
| `/watchmaking` | Educational overview | Sticky chapter index, interactive SVG cutaway with selectable components, five chapters, specs |
| `/services` | Services hub | Three service modules, promise section, service stats |
| `/services/personalisation` | Personalisation | Working local-state configurator: reference, strap, engraving text and style, live SVG caseback preview, price summary, locally saved configuration |
| `/services/care-repair` | Care & repair | Service tiers, process, validated repair form (name, email, phone, reference, service, year, description, consent), simulated confirmation with reference, FAQ accordion |
| `/appointments` | Appointments | Boutique and service selection, date + time-slot controls, validated contact fields, simulated confirmation with full summary |
| `/boutiques` | Boutique finder | Search, region/type filters, list/map toggle, original designed locator placeholder, selectable pins, fictional-location disclosure, empty state |
| `/search` | Search results | Query state in the URL, live product results, suggestions, recent searches, arrow-key result navigation, no-results and empty views |
| `/wishlist` | Wishlist | Persisted saved pieces, removal, product links, add-to-bag, informative empty state, recommendations |
| `/cart` | Bag | Quantity changes, removal, empty bag, subtotal, continue shopping, demo checkout CTA, mock terms |
| `/checkout` | Demonstration checkout | Three validated steps (details, delivery, review), mock payment notice with no card fields, simulated confirmation, order stored locally |
| `/account` | Demo account | Transparent mock authentication, client-side validation, session in `sessionStorage`, simulated order history, sign out |
| `/client-care` | Client care hub | Six care modules, contact channels, accordions |
| `/faq` | FAQ | Search + category filtering, ten accessible disclosure answers, cross-links |
| `/contact` | Contact | Validated demonstration form, simulated confirmation, fictional contact details, boutique links |
| `/shipping-returns` | Shipping & returns | Delivery table, five accordions, honest mock terms |
| `/about` | About | Editorial brand story, three principles, fictional chronology, explicit disclosure section |
| `/legal/:section` | Legal | Privacy, terms, storage/cookies and accessibility notices |
| `*` | Not found | Designed 404 with recovery links |

### Immersive scroll systems (added in the second pass)

The flagship collection page is now a scroll-driven universe in its own right, built from original
interactions rather than copied sequences:

1. **Scroll-rotated 3D study** (`src/components/three/ScrollStudy.tsx` + `ScrollStudyCanvas.tsx`)
   A tall section with a sticky stage. Document scroll rotates the procedural watch roughly 345°
   with a gentle tilt and dolly; four chapters crossfade their copy, and a labelled hotspot travels
   with the model for the active chapter. A finish switcher (steel/graphite, champagne, oxblood)
   changes the materials live. Rotation is read from a ref inside `useFrame`, never from React
   state, so scrolling stays at frame rate. The canvas unmounts its render loop when off-screen
   (`frameloop="never"`).
2. **Scroll-scrubbed film** (`src/components/primitives/ScrollFilm.tsx`)
   A pinned film section where scrolling seeks the video frame by frame. The three films are
   encoded with a keyframe every 15 frames (`-g 15`) specifically so seeking is smooth, and the
   scrubber is guarded against overlapping seeks. A play button hands over to continuous playback;
   playback stops automatically when the section leaves the viewport.
3. **Graceful alternatives.** Without WebGL, on mobile, or with `prefers-reduced-motion`, the study
   becomes a labelled four-frame image sequence driven by the same scroll, or a static editorial
   grid. The film degrades to its poster with the same chapter text. Nothing is scroll-jacked:
   chapters are buttons, and normal page scrolling is never prevented.
4. **Reading-progress hairline** under the header, one pixel of champagne, fading in as you scroll.

### Global systems

- **Header**: announcement strip, wordmark, desktop navigation with accessible mega menus
  (`aria-expanded`, focus and hover opening, Escape and outside-click dismissal), search, wishlist and
  bag with live counts, condensed sticky state, full-screen editorial navigation panel with imagery,
  focus trap and Escape-to-close.
- **Footer**: newsletter form with validation and local-only success, three link columns, social
  controls with honest feedback, legal links and a working region selector persisted locally.
- **State**: `StoreContext` for bag and wishlist (localStorage); `UIContext` for search, navigation,
  bag drawer and toasts. Cart totals include strap surcharges.
- **Motion**: one easing language (`power3`/`power4` out, long durations), masked line reveals,
  staggered section reveals, image parallax, pinned material sequence, route cross-fade, drawer and
  accordion transitions. All GSAP timelines and ScrollTriggers are cleaned up on unmount. Reduced
  motion disables smooth scrolling, hero video, parallax and reveals.
- **Accessibility**: skip link, semantic landmarks, one `h1` per page, logical heading order,
  descriptive alt text, keyboard dialogs with focus traps and restoration, visible `:focus-visible`
  rings, 44px tap targets, labelled controls, live regions for filter counts, toasts and
  confirmations.
- **Performance**: route-level code splitting, lazy Three.js bundle (loaded only when the visitor
  opts in), responsive AVIF/WebP with `srcset`/`sizes`, reserved image dimensions, lazy loading below
  the fold, priority hints on hero art, off-screen 3D paused via IntersectionObserver, WebGL
  detection and error boundary with an image fallback.
- **SEO**: per-route title, description, canonical, Open Graph and Twitter metadata via `useSeo`,
  `robots.txt`, `sitemap.xml`, descriptive URLs and a favicon.

---

## Design system notes

- **Typography**: Cormorant Garamond (display, self-hosted) and Jost (sans, self-hosted), with fluid
  `clamp()` scales. Uppercase 9–11px labels with 0.18–0.26em tracking; no display text below 300
  weight.
- **Palette**: warm ivory `#F2ECE2`, graphite `#1B1B19`, brushed silver `#B9B7AE`, muted champagne
  `#C3A878`, deep oxblood `#5E1A1F`.
- **Geometry**: near-square corners (1–3px), 1px hairlines, a 12-column editorial grid, generous
  whitespace and asymmetric composition.
- **Logo**: original stacked wordmark and an original MV chevron monogram (inline SVG), plus a custom
  favicon.

---

## Prototype limitations (stated deliberately)

- **Forms do not transmit.** Appointment, repair, contact, newsletter, checkout and account forms
  validate locally and render a confirmation; nothing reaches a server.
- **No payment fields exist.** The checkout shows a labelled, non-interactive mock payment panel and
  never collects card data.
- **The 3D study is a stylised procedural prototype**, not a photographic or engineering model, and
  is opt-in. Product photography remains the primary reference.
- **The boutique locator is an original drawn placeholder**, not a live map; replacing
  `MapPlaceholder` with a real SDK is the documented integration point.
- **The films are original generated placeholder loops** (slow push-ins) and can be swapped without
  code changes; see ASSETS.md.
- **The reference site named in the brief was not accessible to inspect** (reCAPTCHA gate). The
  interactions here are an original response to that *genre* of experience — pinned scroll scenes, a
  rotating product study, hotspots and scrubbed footage — and reproduce no Cartier layout, copy,
  imagery or animation sequence.
- **Asset provenance** is documented in ASSETS.md, including which source render drives which page.

---

## Folder structure

```
src/
  components/
    layout/       Header, MegaMenu, NavPanel, Footer, SearchOverlay, BagDrawer, Toasts, Layout
    primitives/   Media, ProductCard, ProductGallery, FilterDrawer/Panel, SortMenu, Accordion,
                  Modal, VideoHero, RevealSection/Text, ParallaxMedia, Icon, RequestState bits
    three/        ProductViewer (lazy wrapper), ProductViewerCanvas, viewer support
    forms/        NewsletterForm
  context/        StoreContext (bag + wishlist), UIContext (surfaces + toasts)
  data/           products, navigation, boutiques, editorial chapters, FAQ
  hooks/          Lenis, focus trap, media queries
  lib/            assets, format, motion, seo, storage, validation
  pages/          all routes listed above
  styles/         tokens, base, layout, components, pages
public/assets/    generated images, video, manifest
scripts/          optimize-assets.mjs
```

---

## QA performed

- `npx tsc -b` — strict TypeScript, no unused locals/parameters, passes.
- `npm run check:render` — server-renders all 29 route examples (including every product slug and
  the not-found states) to catch render-time errors.
- Asset audit — every image key referenced by the pages and product data resolves to generated
  WebP/AVIF files at the declared widths; all six video files exist. A designed fallback panel is
  shown if any asset is ever missing.
- `npm run build` — production build succeeds; route chunks generated; Three.js isolated.
- Manual review of route table, state flows (bag/wishlist persistence, quantity limits, filter
  parameters, form validation, checkout snapshot before bag clear) and responsive breakpoints at
  320 / 480 / 768 / 1024 / 1440 / 1920.
- Reduced-motion, failed-video and no-WebGL paths implemented with visible fallbacks.
- Console: no external requests, no dead links in navigation or footer, no fabricated success
  messages without a visible “demonstration” label.

### Route checklist

- [x] `/`
- [x] `/collections/aeroform`
- [x] `/watches`
- [x] `/watches/aeroform-40-graphite`
- [x] `/watches/aeroform-40-champagne`
- [x] `/watches/aeroform-38-nocturne`
- [x] `/watches/aeroform-gt-chronograph`
- [x] `/watches/aeroform-skeleton-edition`
- [x] `/watches/aeroform-40-oxblood`
- [x] `/watches/unknown` → designed not-found state
- [x] `/craftsmanship`
- [x] `/watchmaking`
- [x] `/services`
- [x] `/services/personalisation`
- [x] `/services/care-repair`
- [x] `/appointments`
- [x] `/boutiques`
- [x] `/search` (+ `?q=`)
- [x] `/wishlist`
- [x] `/cart`
- [x] `/checkout`
- [x] `/account`
- [x] `/client-care`
- [x] `/faq`
- [x] `/contact`
- [x] `/shipping-returns`
- [x] `/about`
- [x] `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/legal/accessibility`
- [x] `*` not found
