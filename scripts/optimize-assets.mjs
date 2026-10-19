/**
 * Generates the responsive image set used by the site from /raw source art.
 *
 *   node scripts/optimize-assets.mjs
 *
 * For every source it writes AVIF + WebP at the widths declared below into
 * public/assets/images, plus derived macro crops per product. Missing
 * sources are reported and skipped, so the script is safe to re-run.
 */
import sharp from 'sharp'
import { mkdir, readdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const RAW = path.join(ROOT, 'raw')
const OUT = path.join(ROOT, 'public/assets/images')

const WIDE = [640, 960, 1280, 1600, 1920]
const SQUARE = [480, 800, 1200]
const PORTRAIT = [480, 768, 1024]

const SOURCES = [
  { file: 'hero-wide.png', key: 'hero-wide', sizes: WIDE },
  { file: 'hero-vertical.png', key: 'hero-vertical', sizes: PORTRAIT },
  { file: 'hero-flagship.png', key: 'hero-flagship', sizes: PORTRAIT },
  { file: 'editorial-collection.png', key: 'editorial-collection', sizes: WIDE },
  { file: 'craft-atelier.png', key: 'craft-atelier', sizes: WIDE },
  { file: 'macro-dial.png', key: 'macro-dial', sizes: SQUARE },
  { file: 'macro-bracelet.png', key: 'macro-bracelet', sizes: SQUARE },
  { file: 'macro-case.png', key: 'macro-case', sizes: SQUARE },
  { file: 'material-steel.png', key: 'material-steel', sizes: SQUARE },
  { file: 'service-engraving.png', key: 'service-engraving', sizes: SQUARE },
  { file: 'movement-macro.png', key: 'movement-macro', sizes: SQUARE },
  { file: 'campaign-staircase.png', key: 'campaign-staircase', sizes: WIDE },
  { file: 'campaign-garage.png', key: 'campaign-garage', sizes: PORTRAIT },
  { file: 'boutique-interior.png', key: 'boutique-interior', sizes: WIDE },
  { file: 'care-service.png', key: 'care-service', sizes: WIDE },
  { file: 'aeroform-graphite.png', key: 'aeroform-graphite', sizes: SQUARE, product: true },
  { file: 'aeroform-champagne.png', key: 'aeroform-champagne', sizes: SQUARE, product: true },
  { file: 'aeroform-nocturne.png', key: 'aeroform-nocturne', sizes: SQUARE, product: true },
  { file: 'aeroform-gt.png', key: 'aeroform-gt', sizes: SQUARE, product: true },
  { file: 'aeroform-skeleton.png', key: 'aeroform-skeleton', sizes: SQUARE, product: true },
  { file: 'aeroform-oxblood.png', key: 'aeroform-oxblood', sizes: SQUARE, product: true },
  { file: 'aeroform-lifestyle-wheel.png', key: 'aeroform-lifestyle-wheel', sizes: PORTRAIT, product: true },
]

const DERIVED = [
  { key: 'aeroform-graphite-dial', source: 'aeroform-graphite', crop: [0.16, 0.18, 0.56, 0.56] },
  { key: 'aeroform-graphite-case', source: 'macro-case', crop: [0, 0, 1, 1] },
  { key: 'aeroform-graphite-detail', source: 'aeroform-graphite', crop: [0.44, 0.4, 0.36, 0.36] },
  { key: 'aeroform-graphite-bracelet', source: 'aeroform-graphite', crop: [0.26, 0.6, 0.44, 0.44] },
  { key: 'aeroform-champagne-dial', source: 'aeroform-champagne', crop: [0.18, 0.2, 0.54, 0.54] },
  { key: 'aeroform-champagne-case', source: 'aeroform-champagne', crop: [0.5, 0.38, 0.38, 0.38] },
  { key: 'aeroform-champagne-detail', source: 'aeroform-champagne', crop: [0.42, 0.4, 0.36, 0.36] },
  { key: 'aeroform-champagne-bracelet', source: 'aeroform-champagne', crop: [0.28, 0.6, 0.42, 0.42] },
  { key: 'aeroform-nocturne-dial', source: 'aeroform-nocturne', crop: [0.18, 0.2, 0.54, 0.54] },
  { key: 'aeroform-nocturne-case', source: 'aeroform-nocturne', crop: [0.5, 0.38, 0.38, 0.38] },
  { key: 'aeroform-nocturne-detail', source: 'aeroform-nocturne', crop: [0.42, 0.4, 0.36, 0.36] },
  { key: 'aeroform-nocturne-bracelet', source: 'aeroform-nocturne', crop: [0.28, 0.6, 0.42, 0.42] },
  { key: 'aeroform-gt-dial', source: 'aeroform-gt', crop: [0.16, 0.2, 0.56, 0.56] },
  { key: 'aeroform-gt-case', source: 'aeroform-gt', crop: [0.5, 0.38, 0.38, 0.38] },
  { key: 'aeroform-gt-detail', source: 'aeroform-gt', crop: [0.42, 0.42, 0.36, 0.36] },
  { key: 'aeroform-gt-bracelet', source: 'aeroform-gt', crop: [0.28, 0.6, 0.42, 0.42] },
  { key: 'aeroform-skeleton-dial', source: 'aeroform-skeleton', crop: [0.18, 0.2, 0.54, 0.54] },
  { key: 'aeroform-skeleton-case', source: 'aeroform-skeleton', crop: [0.5, 0.38, 0.38, 0.38] },
  { key: 'aeroform-skeleton-detail', source: 'aeroform-skeleton', crop: [0.42, 0.42, 0.36, 0.36] },
  { key: 'aeroform-skeleton-bracelet', source: 'aeroform-skeleton', crop: [0.28, 0.6, 0.42, 0.42] },
  { key: 'aeroform-oxblood-dial', source: 'aeroform-oxblood', crop: [0.18, 0.2, 0.54, 0.54] },
  { key: 'aeroform-oxblood-case', source: 'aeroform-oxblood', crop: [0.5, 0.38, 0.38, 0.38] },
  { key: 'aeroform-oxblood-detail', source: 'aeroform-oxblood', crop: [0.44, 0.42, 0.34, 0.34] },
  { key: 'aeroform-oxblood-bracelet', source: 'aeroform-oxblood', crop: [0.28, 0.6, 0.42, 0.42] },
]

const exists = async (p) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function emit(pipeline, key, widths) {
  await Promise.all(
    widths.flatMap((w) => [
      pipeline.clone().resize({ width: w }).webp({ quality: 82, effort: 4 }).toFile(path.join(OUT, `${key}-${w}.webp`)),
      pipeline.clone().resize({ width: w }).avif({ quality: 55, effort: 3 }).toFile(path.join(OUT, `${key}-${w}.avif`)),
    ]),
  )
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const rawFiles = await readdir(RAW)
  const manifest = []
  const missing = []

  for (const source of SOURCES) {
    if (!rawFiles.includes(source.file)) {
      missing.push(source.file)
      continue
    }
    const input = path.join(RAW, source.file)
    const meta = await sharp(input).metadata()
    let pipeline = sharp(input).rotate()
    if (source.product && meta.width && meta.height && meta.width !== meta.height) {
      const side = Math.min(meta.width, meta.height)
      const left = Math.round((meta.width - side) / 2)
      const top = Math.round((meta.height - side) / 2)
      pipeline = pipeline.extract({ left, top, width: side, height: side })
    }
    await emit(pipeline, source.key, source.sizes)
    manifest.push({ key: source.key, widths: source.sizes, source: source.file })
  }

  for (const item of DERIVED) {
    const file = `${item.source}.png`
    if (!rawFiles.includes(file)) continue
    const input = path.join(RAW, file)
    const meta = await sharp(input).metadata()
    const [fl, ft, fw, fh] = item.crop
    let cropW = Math.max(1, Math.round(meta.width * fw))
    let cropH = Math.max(1, Math.round(meta.height * fh))
    if (item.source.startsWith('macro-')) {
      cropW = meta.width
      cropH = meta.height
    }
    const side = Math.min(cropW, cropH)
    const left = Math.min(meta.width - side, Math.round(meta.width * fl))
    const top = Math.min(meta.height - side, Math.round(meta.height * ft))
    const pipeline = sharp(input).rotate().extract({ left, top, width: side, height: side })
    await emit(pipeline, item.key, SQUARE)
    manifest.push({ key: item.key, widths: SQUARE, derivedFrom: item.source })
  }

  if (rawFiles.includes('hero-vertical.png')) {
    const meta = await sharp(path.join(RAW, 'hero-vertical.png')).metadata()
    const h = Math.round(meta.width * 0.62)
    const top = Math.round(meta.height * 0.1)
    const pipeline = sharp(path.join(RAW, 'hero-vertical.png')).extract({
      left: 0,
      top,
      width: meta.width,
      height: Math.min(h, meta.height - top),
    })
    await emit(pipeline, 'hero-vertical-wide', WIDE)
    manifest.push({ key: 'hero-vertical-wide', widths: WIDE, derivedFrom: 'hero-vertical' })
  }

  await writeFile(
    path.join(ROOT, 'public/assets/ASSET-MANIFEST.json'),
    JSON.stringify({ generated: new Date().toISOString(), images: manifest, missing }, null, 2),
  )

  if (missing.length) {
    console.log(`Skipped ${missing.length} not-yet-generated sources:`)
    missing.forEach((m) => console.log('  ·', m))
  }
  console.log(`Emitted ${manifest.length} image sets (avif + webp) to public/assets/images`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
