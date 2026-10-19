import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Scroll motion primitives.
 *
 * These deliberately do not depend on a third-party scroll library or on
 * pre-measured trigger positions. Every value is derived from the element's
 * live bounding box on a shared requestAnimationFrame tick, so images loading,
 * fonts swapping and sections resizing cannot leave an animation stale.
 *
 * One passive scroll listener and one rAF loop serve the whole page.
 */

type Subscriber = () => void
const subscribers = new Set<Subscriber>()
let frame = 0
let listening = false

function flush() {
  frame = 0
  for (const subscriber of subscribers) subscriber()
}

function requestFlush() {
  if (!frame) frame = window.requestAnimationFrame(flush)
}

function startListening() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener('scroll', requestFlush, { passive: true })
  window.addEventListener('resize', requestFlush)
  window.addEventListener('orientationchange', requestFlush)
}

function stopListening() {
  if (!listening) return
  listening = false
  window.removeEventListener('scroll', requestFlush)
  window.removeEventListener('resize', requestFlush)
  window.removeEventListener('orientationchange', requestFlush)
  if (frame) window.cancelAnimationFrame(frame)
  frame = 0
}

/** Runs `callback` on every frame while scrolling. Returns an unsubscribe. */
export function subscribeScroll(callback: Subscriber): () => void {
  subscribers.add(callback)
  startListening()
  callback()
  return () => {
    subscribers.delete(callback)
    if (subscribers.size === 0) stopListening()
  }
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function useInView<T extends Element>(
  options: { rootMargin?: string; threshold?: number; once?: boolean } = {},
) {
  const { rootMargin = '0px 0px -10% 0px', threshold = 0, once = true } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return { ref, inView }
}

/**
 * Progress through a pinned section: 0 when its top reaches the top of the
 * viewport, 1 when its bottom reaches the bottom. Matches position: sticky.
 */
export function pinnedProgress(node: HTMLElement | null): number {
  if (!node) return 0
  const rect = node.getBoundingClientRect()
  const distance = rect.height - window.innerHeight
  if (distance <= 0) return 0
  return clamp01(-rect.top / distance)
}

/**
 * Progress of an element through the viewport, 0 as its top enters from below
 * and 1 as its bottom leaves above.
 */
export function rangeProgress(node: HTMLElement | null): number {
  if (!node) return 0
  const rect = node.getBoundingClientRect()
  const span = window.innerHeight + rect.height
  if (span <= 0) return 0
  return clamp01((window.innerHeight - rect.top) / span)
}

/**
 * Subscribes to pinned-section progress while the element is anywhere near the
 * viewport. The callback receives a 0–1 value on every scroll frame.
 */
export function usePinnedProgress(
  ref: RefObject<HTMLElement | null>,
  callback: (progress: number) => void,
  options: { enabled?: boolean; onChapter?: (index: number) => void; chapters?: number } = {},
) {
  const { enabled = true, onChapter, chapters = 0 } = options
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const chapterRef = useRef(onChapter)
  chapterRef.current = onChapter

  useEffect(() => {
    const node = ref.current
    if (!enabled || !node) return
    if (typeof IntersectionObserver === 'undefined') return

    let subscribed: (() => void) | null = null
    let lastChapter = -1

    const update = () => {
      const progress = pinnedProgress(node)
      callbackRef.current(progress)
      if (chapterRef.current && chapters > 0) {
        const index = Math.min(chapters - 1, Math.floor(progress * chapters))
        if (index !== lastChapter) {
          lastChapter = index
          chapterRef.current(index)
        }
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!subscribed) subscribed = subscribeScroll(update)
        } else if (subscribed) {
          subscribed()
          subscribed = null
        }
      },
      { rootMargin: '40% 0px' },
    )
    observer.observe(node)
    update()

    return () => {
      observer.disconnect()
      subscribed?.()
    }
  }, [enabled, ref, chapters])
}

/**
 * Subscribes to element-through-viewport progress while it is near the screen.
 * Used for parallax.
 */
export function useRangeProgress(
  ref: RefObject<HTMLElement | null>,
  callback: (progress: number) => void,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const node = ref.current
    if (!enabled || !node) return
    if (typeof IntersectionObserver === 'undefined') {
      callbackRef.current(rangeProgress(node))
      return
    }

    let subscribed: (() => void) | null = null
    const update = () => callbackRef.current(rangeProgress(node))

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!subscribed) subscribed = subscribeScroll(update)
        } else if (subscribed) {
          subscribed()
          subscribed = null
        }
      },
      { rootMargin: '25% 0px' },
    )
    observer.observe(node)
    update()

    return () => {
      observer.disconnect()
      subscribed?.()
    }
  }, [enabled, ref])
}
