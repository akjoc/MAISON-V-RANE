import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

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
 * seamless; an outer wrapper takes a small scroll-scrubbed offset so the band
 * feels connected to the page. Decorative: hidden from assistive tech.
 */
export function Marquee({ items, speed = 44, className = '', reactive = true }: MarqueeProps) {
  const leanRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lean = leanRef.current
    const track = trackRef.current
    if (!lean || !track || !reactive || prefersReducedMotion()) return

    const tween = gsap.fromTo(
      lean,
      { xPercent: 3 },
      {
        xPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: lean,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
          onUpdate: (self) => {
            // Nudge the loop faster while the page is moving quickly.
            const boost = Math.min(0.55, Math.abs(self.getVelocity()) / 5200)
            track.style.animationDuration = `${Math.max(speed * 0.55, speed * (1 - boost))}s`
          },
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      track.style.animationDuration = ''
    }
  }, [reactive, speed])

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
