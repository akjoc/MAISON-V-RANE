# Original visual assets

Every image and video in this prototype was created originally for MAISON VÉRANE. No Cartier
photography, logos, screenshots or campaign artwork is used, hot-linked or reproduced. The brand,
collection, calibres, boutiques and all copy are fictional. Visuals were generated with an AI image
model, then art-directed (referenced back to the flagship render) for consistency of case, dial,
crown, bracelet and material finish.

## Where assets live

```
public/assets/
  images/   responsive AVIF + WebP derivatives (generated)
  video/    original studio loop (MP4 H.264 + WebM VP9)
  ASSET-MANIFEST.json   list of generated sets and their widths
raw/        source PNG renders (not shipped; git-ignored due to size)
scripts/optimize-assets.mjs   derivation pipeline (sharp)
```

Regenerate everything with:

```bash
npm run optimize-assets
```

This writes AVIF + WebP at the declared widths, plus the derived macro crops used in product
galleries. Missing sources are reported and skipped, so it is safe to re-run at any time.

## Generated sources and usage

| Source (`raw/`) | Shipped key | Ratio / widths | Used on |
| --- | --- | --- | --- |
| `hero-wide.png` | `hero-wide` | 21:9, 640–1920 | homepage film poster, shipping aside |
| `hero-vertical.png` | `hero-vertical` | 3:4, 480–1024 | collection strap story |
| `hero-flagship.png` | `hero-flagship` | 3:4, 480–1024 | source-of-truth reference; not displayed directly |
| `editorial-collection.png` | `editorial-collection` | 3:2, 640–1920 | homepage intro, collection hero, about, mega menu |
| `craft-atelier.png` | `craft-atelier` | 3:2, 640–1920 | craftsmanship hero, homepage craft band, care & repair |
| `macro-dial.png` | `macro-dial` | 1:1, 480–1200 | dial storytelling, watchmaking chapter |
| `macro-bracelet.png` | `macro-bracelet` | 1:1, 480–1200 | bracelet storytelling, material studies |
| `macro-case.png` | `macro-case` | 1:1, 480–1200 | case storytelling, collection chapters |
| `material-steel.png` | `material-steel` | 1:1, 480–1200 | homepage materials, craftsmanship sequence |
| `service-engraving.png` | `service-engraving` | 1:1, 480–1200 | personalisation, services, mega menu |
| `aeroform-graphite.png` | `aeroform-graphite` | 1:1, 480–1200 | flagship product card, gallery, 3D fallback |
| `aeroform-champagne.png` | `aeroform-champagne` | 1:1, 480–1200 | champagne reference |
| `aeroform-nocturne.png` | `aeroform-nocturne` | 1:1, 480–1200 | Nocturne reference |
| `aeroform-gt.png` | `aeroform-gt` | 1:1, 480–1200 | GT Chronograph, mega menu |
| `aeroform-skeleton.png` | `aeroform-skeleton` | 1:1, 480–1200 | Skeleton Édition |
| `aeroform-oxblood.png` | `aeroform-oxblood` | 1:1, 480–1200 | Oxblood reference |
| `movement-macro.png` | `movement-macro` | 1:1, 480–1200 | watchmaking hero, craftsmanship engineering |
| `campaign-staircase.png` | `campaign-staircase` | 21:9, 640–1920 | homepage campaign, full navigation panel |
| `boutique-interior.png` | `boutique-interior` | 21:9, 640–1920 | appointments, services, boutiques |
| `care-service.png` | `care-service` | 21:9, 640–1920 | services, care & repair |
| `aeroform-lifestyle-wheel.png` | `aeroform-lifestyle-wheel` | 3:4, 480–1024 | lifestyle product gallery entry |

Derived square crops (dial, case, bracelet and “detail”) are produced automatically for each
product from its source render, so gallery thumbnails always match the piece.

## Video

`public/assets/video/aeroform-loop.mp4` and `.webm` are an original nine-second studio loop
generated from the `hero-wide` render (slow push-in, 1600 × 680, no audio). It is a **replaceable
placeholder**: swap the files and keep the poster key in `VideoHero`. If the file cannot decode or
autoplay is blocked, the hero falls back to the poster image and still exposes play/pause and mute
controls (hidden automatically under `prefers-reduced-motion`).

## Provenance and licensing

- All renders are AI-generated specifically for this fictional brand; no third-party product
  photography is reused.
- Typography: Cormorant Garamond and Jost, both SIL Open Font License, self-hosted from
  `@fontsource` into `public/fonts`.
- Icons and the MV monogram are original inline SVG.
- The boutique locator and watch cutaway are original vector illustrations, not third-party maps or
  technical drawings.
