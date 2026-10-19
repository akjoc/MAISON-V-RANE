import { useEffect, useRef } from 'react'
import { subscribeScroll } from '../../lib/scrollMotion'
import { useReducedMotion } from '../../hooks/useMediaQuery'

interface MarqueeProps {
  /** Words or short phrases, separated by a diamond in the render. */
  items: string[]
  /** Seconds for one full loop. */
  speed?: number
  className?: string
  /** A little scroll-linked lean on an outer wrapper, so the band breathes. */
  reactive?: boolean
}

/**
 * A slow horizontal ticker. The list is rendered twice so the CSS loop is
 * seamless; an outer wrapper takes a small scroll-scrubbed offset and the loop
 * speeds up slightly while the page is moving. Decorative: hidden from
 * assistive tech.
 */
export function Marquee({ items, speed = 44, className = '', reactive = true }: MarqueeProps) {
  const leanRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const lean = leanRef.current
    const track = trackRef.current
    if (!lean || !track || !reactive || reduced) return

    let previous = window.scrollY
    return subscribeScroll(() => {
      const rect = lean.getBoundingClientRect()
      const offset = window.innerHeight / 2 - (rect.top + rect.height / 2)
      lean.style.transform = `translate3d(${Math.max(-24, Math.min(24, offset * 0.04)).toFixed(2)}px, 0, 0)`
      const velocity = Math.abs(window.scrollY - previous)
      previous = window.scrollY
      const boost = Math.min(0.55, velocity / 90)
      track.style.animationDuration = `${Math.max(speed * 0.55, speed * (1 - boost)).toFixed(1)}s`
    })
  }, [reactive, reduced, speed])

  const group = (key: string) => (
    <span className="marquee__group" aria-hidden="true" key={key}>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <span className="marquee__dot" aria-hidden="true" />
        </span>
      ))}
    </span>
  )

  return (
    <div className={`marquee ${className}`.trim()} role="presentation">
      <div ref={leanRef} className="marquee__lean">
        <div ref={trackRef} className="marquee__track" style={{ animationDuration: `${speed}s` }}>
          {group('a')}
          {group('b')}
        </div>
      </div>
    </div>
  )
}
