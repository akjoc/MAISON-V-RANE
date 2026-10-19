import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger, registerMotion } from '../lib/motion'
import { useReducedMotion } from './useMediaQuery'

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

/** Scrolls to an element or offset, using Lenis when it is running. */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset, duration: 1.2 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior: 'smooth' })
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

export function scrollToTop(immediate = false) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate, duration: immediate ? 0 : 0.9 })
    return
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

/**
 * Smooth scrolling with Lenis, wired to GSAP's ticker and ScrollTrigger.
 * Disabled entirely when the visitor prefers reduced motion.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    registerMotion()
    if (reduced) {
      document.documentElement.classList.add('no-smooth-scroll')
      return
    }
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
      document.documentElement.classList.remove('no-smooth-scroll')
    }
  }, [reduced])
}
