import manifest from '../data/asset-manifest.json'

/**
 * Image helper. Every generated asset is emitted by scripts/optimize-assets.mjs
 * as `{key}-{width}.{webp|avif}` inside /public/assets/images. The width sets
 * below mirror the source aspect ratios so we never upscale.
 */

/**
 * Leading-slash-prefixed public path for anything in /public.
 *
 * Vite rewrites the paths it can see at build time (index.html, CSS url()), but
 * not strings assembled in JavaScript. GitHub Pages serves this site from a
 * subpath, so asset URLs built at runtime have to carry `import.meta.env.BASE_URL`
 * ('/' locally, '/MAISON-V-RANE/' on Pages).
 */
export const BASE_PATH = import.meta.env.BASE_URL

export function assetUrl(path: string): string {
  return `${BASE_PATH}${path.replace(/^\/+/, '')}`
}

export const WIDE_WIDTHS = [640, 960, 1280, 1600, 1920]
export const SQUARE_WIDTHS = [480, 800, 1200]
export const PORTRAIT_WIDTHS = [480, 768, 1024]
export const MACRO_WIDTHS = [480, 800, 1200]

export type Orientation = 'wide' | 'square' | 'portrait'

export function widthsFor(o: Orientation): number[] {
  if (o === 'wide') return WIDE_WIDTHS
  if (o === 'portrait') return PORTRAIT_WIDTHS
  return SQUARE_WIDTHS
}

const availableWidths = manifest as Record<string, number[]>

/**
 * The widths actually generated for a key.
 *
 * Components declare the *shape* they want (square, portrait, wide), but a few
 * keys only ever ship one shape — the mega-menu feature panels, for instance,
 * show wide editorial photographs in a square frame. Asking for the wrong
 * ladder used to request files that were never emitted, which is a permanent
 * 404 and an empty frame. Clamping to the manifest makes that impossible.
 */
export function widthsForKey(key: string, orientation: Orientation): number[] {
  const available = availableWidths[key]
  if (!available?.length) return widthsFor(orientation)
  const wanted = widthsFor(orientation)
  const usable = wanted.filter((width) => available.includes(width))
  // No overlap at all: the caller picked the wrong shape for this artwork.
  // Use every generated width rather than requesting something that is absent.
  return usable.length ? usable : [...available].sort((a, b) => a - b)
}

/**
 * Bumping this invalidates every generated image URL. It exists because
 * long-lived CDN/browser caches can hold an earlier 404 for a path that has
 * since been filled in, which leaves a page with permanently "missing" art.
 */
export const ASSET_VERSION = '4'

/** Query suffix; `extra` lets a retry ask for a different cache entry. */
function cacheTag(extra = ''): string {
  return `?v=${ASSET_VERSION}${extra}`
}

export function imageSrc(
  key: string,
  width: number,
  ext: 'webp' | 'avif' = 'webp',
  extra = '',
): string {
  return `${assetUrl(`assets/images/${key}-${width}.${ext}`)}${cacheTag(extra)}`
}

export function imageSrcSet(
  key: string,
  orientation: Orientation,
  ext: 'webp' | 'avif',
  extra = '',
): string {
  return widthsForKey(key, orientation)
    .map((w) => `${imageSrc(key, w, ext, extra)} ${w}w`)
    .join(', ')
}

export function posterFor(key: string): string {
  return imageSrc(key, 1600)
}
