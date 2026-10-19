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
  video/    original studio loops (MP4 H.264, dense keyframes for scroll scrubbing)
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
| `aeroform-lifestyle-wheel.png` | `aeroform-lifestyle-wheel` | 3:4, 480–1024 | reserved (source kept for future crop) |

Derived square crops (dial, case, bracelet and “detail”) are produced automatically for each
product from its source render, so gallery thumbnails always match the piece.

## Video

Three original nine-second studio films, each generated from one of the renders above. All are
**replaceable placeholders** — swap the files and keep the poster key in the consuming component.

| File | Derived from | Size / use |
| --- | --- | --- |
| `aeroform-loop.mp4` | `hero-wide.png` | 1600 × 680 · 9 s · homepage hero (autoplay) and collection scroll film |
| `editorial-loop.mp4` | `editorial-collection.png` | 1600 × 686 · 8 s · homepage scroll-scrubbed film |
| `atelier-loop.mp4` | `craft-atelier.png` | 1280 × 720 · 8 s · craftsmanship scroll-scrubbed film |

All three are H.264 MP4 only (no WebM twin) and are encoded with a keyframe every 8 frames
(`-g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart`) so scroll scrubbing lands on a real
frame immediately instead of waiting for the next keyframe.

Encoded with `-g 15` (a keyframe every 0.6 s) so scroll-seeking lands on real frames rather than
snapping between distant keyframes. No audio track is included. If a file cannot decode, autoplay is
blocked, or motion is reduced, the poster image and the chapter text remain, and controls are
disabled rather than faked.

## Provenance and licensing

- All renders are AI-generated specifically for this fictional brand; no third-party product
  photography is reused.
- Typography: Cormorant Garamond and Jost, both SIL Open Font License, self-hosted from
  `@fontsource` into `public/fonts`.
- Icons and the MV monogram are original inline SVG.
- The boutique locator and watch cutaway are original vector illustrations, not third-party maps or
  technical drawings.
