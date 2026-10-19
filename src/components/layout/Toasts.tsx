import { useUI } from '../../context/UIContext'
import { Icon } from '../primitives/Icon'

export function Toasts() {
  const { toasts, dismissToast } = useUI()
  if (toasts.length === 0) return null
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          <span>{toast.message}</span>
          <button type="button" className="toast__close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss message">
            <Icon name="close" size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
