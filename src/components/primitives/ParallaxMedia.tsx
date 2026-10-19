import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import type { Orientation } from '../../lib/assets'
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

/** Slow, controlled image parallax inside a clipping frame. */
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

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || prefersReducedMotion()) return
    const img = wrap.querySelector('img')
    if (!img) return
    const tween = gsap.fromTo(
      img,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [strength])

  return (
    <figure className={`figure parallax ${className}`.trim()}>
      <div ref={wrapRef} style={{ overflow: 'hidden' }}>
        <div style={{ scale: '1.14' }}>
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
