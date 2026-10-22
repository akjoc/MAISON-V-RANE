import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { imageSrc, imageSrcSet, widthsForKey, type Orientation } from '../../lib/assets'

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
 * How many times a failing image is re-requested before we admit defeat.
 * Retries drop the AVIF source (so a codec hiccup cannot strand the picture)
 * and ask for a fresh cache entry via a query tag.
 */
const MAX_ATTEMPTS = 3
const LOAD_TIMEOUT_MS = 9000

/**
 * Responsive, lazily loaded picture with an AVIF source, WebP fallback,
 * reserved dimensions and a quiet skeleton. If a request fails — a stale
 * cached 404, a dropped connection, an unsupported codec — the image is
 * re-requested instead of being replaced by the fallback panel.
 * Generated assets are described in ASSETS.md.
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
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const [w, h] = intrinsic[orientation]
  const largest = widthsForKey(imageKey, orientation).at(-1) ?? w

  // AVIF is only offered on the first try; retries are WebP-only.
  const offerAvif = attempt === 0
  const tag = attempt > 0 ? `&r=${attempt}` : ''

  const retry = () => {
    setAttempt((current) => {
      if (current >= MAX_ATTEMPTS - 1) {
        setFailed(true)
        return current
      }
      return current + 1
    })
  }

  // An image that never fires load *or* error (a stalled request through a
  // proxy, say) is retried on a timer so a blank frame cannot persist.
  useEffect(() => {
    if (loaded || failed) return
    const timer = window.setTimeout(() => {
      if (imgRef.current?.complete && (imgRef.current?.naturalWidth ?? 0) > 0) {
        setLoaded(true)
        return
      }
      retry()
    }, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [attempt, loaded, failed])

  useEffect(() => {
    if (imgRef.current?.complete && (imgRef.current?.naturalWidth ?? 0) > 0) setLoaded(true)
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
        <picture key={attempt}>
          {offerAvif && (
            <source
              type="image/avif"
              srcSet={imageSrcSet(imageKey, orientation, 'avif', tag)}
              sizes={sizes}
            />
          )}
          <source
            type="image/webp"
            srcSet={imageSrcSet(imageKey, orientation, 'webp', tag)}
            sizes={sizes}
          />
          <img
            ref={imgRef}
            src={imageSrc(imageKey, largest, 'webp', tag)}
            srcSet={imageSrcSet(imageKey, orientation, 'webp', tag)}
            sizes={sizes}
            width={w}
            height={h}
            alt={decorative ? '' : alt}
            aria-hidden={decorative || undefined}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => {
              setLoaded(true)
              setFailed(false)
            }}
            onError={retry}
            className={loaded ? 'is-loaded' : 'is-loading'}
            style={objectPosition ? { objectPosition } : undefined}
          />
        </picture>
      )}
    </div>
  )
}
