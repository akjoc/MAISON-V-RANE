import { useEffect, useState, useSyncExternalStore } from 'react'
import { isMotionReduced, subscribeMotion } from '../lib/motionPrefs'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** Reactive: updates when the header's Motion control is used. */
export const useReducedMotion = () =>
  useSyncExternalStore(subscribeMotion, isMotionReduced, () => false)
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
