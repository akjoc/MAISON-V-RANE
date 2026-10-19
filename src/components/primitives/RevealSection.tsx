import { useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useInView } from '../../lib/scrollMotion'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'

interface RevealSectionProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Animate direct children one after another. */
  stagger?: boolean
  delay?: number
  y?: number
  /** Kept for API compatibility; reveals are driven by the element itself. */
  triggerSelector?: string
}

/**
 * Entrance reveal.
 *
 * The element arms itself on mount (so content is visible without JS), then
 * un-hides when an IntersectionObserver sees it. The movement itself is pure
 * CSS transition — no scroll library, no measured trigger positions, and
 * therefore nothing that can go stale when images load.
 */
export function RevealSection({
  children,
  as: Tag = 'div',
  className = '',
  stagger = false,
  delay = 0,
  y = 26,
}: RevealSectionProps) {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '0px 0px -8% 0px' })
  const [armed, setArmed] = useState(false)

  useIsomorphicLayoutEffect(() => setArmed(true), [])

  const style = {
    '--reveal-y': `${y}px`,
    '--reveal-delay': `${delay}s`,
  } as CSSProperties

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={[
        'reveal',
        stagger ? 'reveal--stagger' : '',
        armed ? 'is-armed' : '',
        inView ? 'is-revealed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
}
