import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { revealUp } from '../../lib/motion'

interface RevealSectionProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Animate direct children one after another. */
  stagger?: boolean
  delay?: number
  y?: number
  /** Use an external trigger element instead of this section. */
  triggerSelector?: string
}

export function RevealSection({
  children,
  as: Tag = 'div',
  className = '',
  stagger = false,
  delay = 0,
  y = 26,
  triggerSelector,
}: RevealSectionProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const trigger = triggerSelector
      ? document.querySelector(triggerSelector)
      : node
    const targets = stagger
      ? Array.from(node.children).filter((child) => !child.classList.contains('reveal-ignore'))
      : [node]
    const cleanup = revealUp(targets, {
      y,
      delay,
      trigger: (trigger as Element) ?? node,
      stagger: stagger ? 0.09 : 0,
    })
    return cleanup
  }, [stagger, delay, y, triggerSelector])

  return (
    <Tag ref={ref as never} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  )
}
