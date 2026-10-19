import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { imageSrcSet, widthsFor, type Orientation } from '../../lib/assets'

interface MediaProps {
  imageKey: string
  alt: string
  orientation?: Orientation
  className?: string
  /** Above-the-fold images load eagerly and skip the fade. */
  priority?: boolean
  sizes?: string
  ratio?: 'square' | 'portrait' | 'wide' | 'editorial' | 'cinema' | 'auto'
  objectPosition?: string
  style?: CSSProperties
  zoomOnHover?: boolean
  decorative?: boolean
}

const ratioClass: Record<string, string> = {
  square: 'media--square',
  portrait: 'media--portrait',
  wide: 'media--wide',
  editorial: 'media--editorial',
  cinema: 'media--cinema',
  auto: '',
}

const intrinsic: Record<Orientation, [number, number]> = {
  wide: [1920, 1080],
  square: [1200, 1200],
  portrait: [1024, 1365],
}

/**
 * Responsive, lazily loaded picture with an AVIF source, WebP fallback,
 * reserved dimensions and a quiet skeleton. Generated assets are described
 * in ASSETS.md.
 */
export function Media({
  imageKey,
  alt,
  orientation = 'wide',
  className = '',
  priority = false,
  sizes = '100vw',
  ratio = 'auto',
  objectPosition,
  style,
  zoomOnHover = false,
  decorative = false,
}: MediaProps) {
  const [loaded, setLoaded] = useState(priority)
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const [w, h] = intrinsic[orientation]
  const largest = widthsFor(orientation).at(-1) ?? w

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div
      className={`media ${ratioClass[ratio]} ${zoomOnHover ? 'media--zoom' : ''} ${className}`.trim()}
      style={style}
    >
      {!loaded && !failed && <div className="media__skeleton" aria-hidden="true" />}
      {failed && (
        <div className="media__fallback" role="img" aria-label={alt}>
          <span className="media__fallback-mark" aria-hidden="true">MV</span>
          <span className="media__fallback-text">{alt}</span>
          <span className="media__fallback-meta">Visual study unavailable</span>
        </div>
      )}
      {!failed && (
      <picture>
        <source type="image/avif" srcSet={imageSrcSet(imageKey, orientation, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={imageSrcSet(imageKey, orientation, 'webp')} sizes={sizes} />
        <img
          ref={imgRef}
          src={`/assets/images/${imageKey}-${largest}.webp`}
          srcSet={imageSrcSet(imageKey, orientation, 'webp')}
          sizes={sizes}
          width={w}
          height={h}
          alt={decorative ? '' : alt}
          aria-hidden={decorative || undefined}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(true)
            setFailed(true)
          }}
          className={loaded ? 'is-loaded' : 'is-loading'}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </picture>
      )}
    </div>
  )
}
