import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { Icon } from './Icon'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  onClear: () => void
  activeCount: number
  children: ReactNode
  resultCount: number
}

export function FilterDrawer({ open, onClose, onClear, activeCount, children, resultCount }: FilterDrawerProps) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)

  if (!open) return null
  return createPortal(
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <aside className="drawer drawer--wide" ref={ref} role="dialog" aria-modal="true" aria-label="Filters">
        <div className="drawer__head">
          <span className="drawer__title">
            Filter · {activeCount > 0 ? `${activeCount} active` : 'all references'}
          </span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close filters">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        <div className="drawer__foot">
          <div className="filter-drawer__actions">
            <button type="button" className="text-link" onClick={onClear}>
              Clear all
            </button>
            <button type="button" className="btn" onClick={onClose}>
              <span>Show {resultCount} {resultCount === 1 ? 'reference' : 'references'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>,
    document.body,
  )
}
