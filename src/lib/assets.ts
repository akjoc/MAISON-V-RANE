/**
 * Image helper. Every generated asset is emitted by scripts/optimize-assets.mjs
 * as `{key}-{width}.{webp|avif}` inside /public/assets/images. The width sets
 * below mirror the source aspect ratios so we never upscale.
 */

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

export function imageSrc(key: string, width: number, ext: 'webp' | 'avif' = 'webp'): string {
  return `/assets/images/${key}-${width}.${ext}`
}

export function imageSrcSet(key: string, orientation: Orientation, ext: 'webp' | 'avif'): string {
  return widthsFor(orientation)
    .map((w) => `${imageSrc(key, w, ext)} ${w}w`)
    .join(', ')
}

export function posterFor(key: string): string {
  return imageSrc(key, 1600)
}
