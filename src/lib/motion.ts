import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function registerMotion() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({ ease: 'power3.out', duration: 1.1 })
  registered = true
}

export { gsap, ScrollTrigger }

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Shared reveal: opacity + a short, restrained vertical translation.
 * Returns a cleanup that kills every tween and trigger it created.
 */
export function revealUp(
  targets: Element | Element[] | NodeListOf<Element>,
  options: { y?: number; stagger?: number; delay?: number; trigger?: Element | null; duration?: number } = {},
) {
  registerMotion()
  if (prefersReducedMotion()) return () => {}
  const { y = 26, stagger = 0.08, delay = 0, trigger, duration = 1.15 } = options
  const tween = gsap.fromTo(
    targets,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: trigger
        ? { trigger, start: 'top 84%', once: true }
        : { trigger: (targets as Element[])[0] ?? (targets as Element), start: 'top 88%', once: true },
    },
  )
  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

/** Line-by-line mask reveal for display typography. */
export function revealLines(lines: Element[], trigger: Element) {
  registerMotion()
  if (prefersReducedMotion()) return () => {}
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start: 'top 80%', once: true },
  })
  tl.fromTo(
    lines,
    { yPercent: 112 },
    { yPercent: 0, duration: 1.25, stagger: 0.09, ease: 'power4.out' },
  )
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
