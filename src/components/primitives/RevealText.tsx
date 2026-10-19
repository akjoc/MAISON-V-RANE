import { createElement, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useInView } from '../../lib/scrollMotion'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'

interface RevealTextProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Animate immediately (hero) instead of on scroll. */
  immediate?: boolean
  delay?: number
  stagger?: number
  id?: string
}

/**
 * Masked line reveal for display typography.
 *
 * Each visual line sits inside an overflow-hidden mask; the inner span slides
 * up when the heading enters the viewport. CSS only — the observer just adds a
 * class, so a misfiring animation cannot leave a heading off-screen.
 */
export function RevealText({
  children,
  as = 'h2',
  className = '',
  immediate = false,
  delay = 0,
  stagger = 0.09,
  id,
}: RevealTextProps) {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '0px 0px -6% 0px' })
  const [armed, setArmed] = useState(false)

  useIsomorphicLayoutEffect(() => setArmed(true), [])

  const revealed = immediate ? armed : inView
  const style = {
    '--line-delay': `${delay}s`,
    '--line-stagger': `${stagger}s`,
  } as CSSProperties

  return createElement(
    as,
    {
      ref,
      id,
      style,
      className: [
        'reveal-lines',
        'reveal-lines--mask',
        className,
        armed ? 'is-armed' : '',
        revealed ? 'is-revealed' : '',
      ]
        .filter(Boolean)
        .join(' '),
    },
    <span className="reveal-lines">{children}</span>,
  )
}

export function Line({ children }: { children: ReactNode }) {
  return (
    <span className="reveal-line">
      <span data-line className="reveal-line__inner">
        {children}
      </span>
    </span>
  )
}
