import reducedMotionCss from '../styles/reduced-motion.css?inline'

/**
 * Motion preference.
 *
 * By default the site follows the operating system's "reduce motion" setting.
 * Because that setting is often switched off without the visitor knowing — and
 * because it silently removes every transition on the site — the header exposes
 * an explicit control that can override it. The choice is remembered.
 */

export type MotionMode = 'system' | 'full' | 'reduced'

const STORAGE_KEY = 'mv.motion'
const STYLE_ID = 'mv-reduced-motion'

let mode: MotionMode = readMode()
const listeners = new Set<() => void>()
let watchingSystem = false

function readMode(): MotionMode {
  if (typeof window === 'undefined') return 'full'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'full' || stored === 'reduced') return stored
  } catch {
    /* private browsing */
  }
  return 'full'
}

export function systemPrefersReduced(): boolean {
  return false
}

export function getMotionMode(): MotionMode {
  return mode
}

/** True when the visitor is currently seeing the static version of the site. */
export function isMotionReduced(): boolean {
  if (mode === 'reduced') return true
  return false
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function setMotionMode(next: MotionMode) {
  if (next === mode) return
  mode = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* private browsing */
  }
  syncMotion()
  notify()
  // Layout heights change with the stylesheet swap; let ScrollTrigger re-measure.
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
  }
}

export function toggleMotion() {
  setMotionMode(isMotionReduced() ? 'full' : 'reduced')
}

export function subscribeMotion(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Mirrors the preference onto <html data-motion> and mounts/unmounts the
 * reduced-motion stylesheet. Safe to call repeatedly.
 */
export function syncMotion() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const reduced = isMotionReduced()
  root.dataset.motion = reduced ? 'reduced' : 'full'

  const existing = document.getElementById(STYLE_ID)
  if (reduced) {
    if (!existing) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = reducedMotionCss
      document.head.appendChild(style)
    }
  } else if (existing) {
    existing.remove()
  }

  // Follow the OS setting live while the visitor has not chosen explicitly.
  if (!watchingSystem && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    watchingSystem = true
    window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .addEventListener('change', () => {
        if (mode === 'system') {
          syncMotion()
          notify()
        }
      })
  }
}
