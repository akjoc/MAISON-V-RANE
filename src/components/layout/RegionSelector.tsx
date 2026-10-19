import { useEffect, useRef, useState } from 'react'
import { Icon } from '../primitives/Icon'
import { regions } from '../../data/nav'
import { readJSON, writeJSON } from '../../lib/storage'
import { useUI } from '../../context/UIContext'

export function RegionSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string>(() => readJSON<string>('mv.region', 'uk'))
  const ref = useRef<HTMLDivElement>(null)
  const { pushToast } = useUI()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const active = regions.find((r) => r.code === current) ?? regions[0]

  return (
    <div className="region" ref={ref}>
      <button
        type="button"
        className="region__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{active.label}</span>
        <span className="cur">{active.currency}</span>
        <Icon name="chevron-down" size={12} />
      </button>
      {open && (
        <div className="region__list" role="menu" aria-label="Select region">
          {regions.map((r) => (
            <button
              key={r.code}
              type="button"
              role="menuitemradio"
              aria-checked={r.code === current}
              className="region__option"
              onClick={() => {
                setCurrent(r.code)
                writeJSON('mv.region', r.code)
                setOpen(false)
                pushToast(`Region set to ${r.label}. Prices remain in GBP for this demonstration.`)
              }}
            >
              <span>{r.label}</span>
              <span className="cur">{r.currency}</span>
            </button>
          ))}
          <p className="field__hint" style={{ padding: '0.6rem 0.75rem 0.35rem', borderTop: '1px solid var(--hairline-soft)', marginTop: '0.35rem' }}>
            Saved locally. Prices stay in GBP in this prototype.
          </p>
        </div>
      )}
    </div>
  )
}
