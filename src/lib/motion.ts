import { isMotionReduced } from './motionPrefs'

/**
 * Motion preference helper.
 *
 * Animation itself no longer goes through a third-party timeline library:
 * entrances are CSS transitions toggled by an IntersectionObserver, and
 * scroll-scrubbed values are measured from live bounding boxes in
 * `src/lib/scrollMotion.ts`. This module only answers "should this move?".
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return isMotionReduced()
}
