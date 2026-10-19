import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { getMotionMode, setMotionMode } from '../../lib/motionPrefs'

const DISMISS_KEY = 'mv.motion.notice'

/**
 * The site honours prefers-reduced-motion by removing every transition. When
 * that setting comes from the operating system rather than an explicit choice
 * here, the visitor may be seeing a completely static site they never asked
 * for. This one-line note explains it and offers the switch.
 */
export function MotionNotice() {
  const reduced = useReducedMotion()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === 'dismissed')
    } catch {
      setDismissed(false)
    }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(DISMISS_KEY, 'dismissed')
    } catch {
      /* private browsing */
    }
  }

  if (!reduced || dismissed || getMotionMode() !== 'system') return null

  return (
    <aside className="motion-note" role="status" aria-live="polite">
      <p className="motion-note__text">
        Your system asks for reduced motion, so animations are paused here.
      </p>
      <div className="motion-note__actions">
        <button
          type="button"
          className="motion-note__btn motion-note__btn--primary"
          onClick={() => {
            setMotionMode('full')
            dismiss()
          }}
        >
          Turn animations on
        </button>
        <button type="button" className="motion-note__btn" onClick={dismiss}>
          Keep them off
        </button>
      </div>
    </aside>
  )
}
