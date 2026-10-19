import { createElement, useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

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
 * Splits a heading/paragraph into line masks and reveals them slowly.
 * The markup stays semantically intact: each visual line is a span inside
 * the original heading element (children are passed as whole lines).
 */
export function RevealText({
  children,
  as = 'h2',
  className = '',
  immediate = false,
  delay = 0,
  stagger = 0.08,
  id,
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const lines = node.querySelectorAll<HTMLElement>('[data-line]')
    if (lines.length === 0) return
    if (prefersReducedMotion()) {
      gsap.set(lines, { yPercent: 0, autoAlpha: 1 })
      return
    }
    const tween = gsap.fromTo(
      lines,
      { yPercent: 118 },
      {
        yPercent: 0,
        duration: 1.25,
        delay,
        stagger,
        ease: 'power4.out',
        scrollTrigger: immediate ? undefined : { trigger: node, start: 'top 88%', once: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [immediate, delay, stagger])

  return createElement(
    as,
    { ref, className, id },
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
