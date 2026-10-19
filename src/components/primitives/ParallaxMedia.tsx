import { useRef } from 'react'
import type { Orientation } from '../../lib/assets'
import { useRangeProgress } from '../../lib/scrollMotion'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Media } from './Media'

interface ParallaxMediaProps {
  imageKey: string
  alt: string
  orientation?: Orientation
  ratio?: 'square' | 'portrait' | 'wide' | 'editorial' | 'cinema' | 'auto'
  strength?: number
  sizes?: string
  className?: string
  priority?: boolean
  caption?: string
  index?: string
}

/**
 * Slow, controlled image parallax inside a clipping frame.
 *
 * Progress is read from the element's live bounding box on a shared scroll
 * frame — no pre-measured trigger ranges, so late-loading images and font swaps
 * cannot desynchronise it.
 */
export function ParallaxMedia({
  imageKey,
  alt,
  orientation = 'wide',
  ratio = 'wide',
  strength = 12,
  sizes = '100vw',
  className = '',
  priority = false,
  caption,
  index,
}: ParallaxMediaProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useRangeProgress(
    wrapRef,
    (progress) => {
      const inner = innerRef.current
      if (!inner) return
      const offset = (progress - 0.5) * 2 * strength
      inner.style.transform = `translate3d(0, ${offset.toFixed(2)}%, 0) scale(1.14)`
    },
    { enabled: !reduced },
  )

  return (
    <figure className={`figure parallax ${className}`.trim()}>
      <div ref={wrapRef} style={{ overflow: 'hidden' }}>
        <div ref={innerRef} style={{ transform: 'translate3d(0,0,0) scale(1.14)' }}>
          <Media
            imageKey={imageKey}
            alt={alt}
            orientation={orientation}
            ratio={ratio}
            sizes={sizes}
            priority={priority}
          />
        </div>
      </div>
      {(caption || index) && (
        <figcaption>
          {index && <span className="num">{index}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  )
}
