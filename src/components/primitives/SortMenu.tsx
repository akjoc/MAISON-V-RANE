import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

export interface SortOption {
  id: string
  label: string
}

interface SortMenuProps {
  options: SortOption[]
  value: string
  onChange: (id: string) => void
}

export function SortMenu({ options, value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = options.find((o) => o.id === value) ?? options[0]

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="sort" ref={ref}>
      <button
        type="button"
        className="sort__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="micro">Sort</span>
        <span>{active.label}</span>
        <Icon name="chevron-down" size={12} />
      </button>
      {open && (
        <ul className="sort__list" role="listbox" aria-label="Sort references">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className={`sort__option ${option.id === value ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
              >
                {option.label}
                {option.id === value && <Icon name="check" size={12} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
