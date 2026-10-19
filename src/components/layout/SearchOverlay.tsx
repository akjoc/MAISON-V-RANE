import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Icon } from '../primitives/Icon'
import { Media } from '../primitives/Media'
import { useUI } from '../../context/UIContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { products } from '../../data/products'
import { readJSON, writeJSON } from '../../lib/storage'
import { formatPrice } from '../../lib/format'

const SUGGESTIONS = ['Aéroform', 'Graphite', 'Chronograph', 'Skeleton', 'Alligator', 'Oxblood']

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState<string[]>(() => readJSON<string[]>('mv.recentSearches', []))
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  useFocusTrap(panelRef, searchOpen, closeSearch)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) =>
        [p.name, p.ref, p.dial, p.material, p.availabilityLabel, p.tagline]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 5)
  }, [query])

  useEffect(() => {
    if (!searchOpen) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(t)
  }, [searchOpen])

  const remember = (term: string) => {
    const clean = term.trim()
    if (!clean) return
    const next = [clean, ...recent.filter((r) => r.toLowerCase() !== clean.toLowerCase())].slice(0, 5)
    setRecent(next)
    writeJSON('mv.recentSearches', next)
  }

  const submit = (term: string) => {
    if (!term.trim()) return
    remember(term)
    closeSearch()
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(results.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(-1, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && results[active]) {
        remember(query)
        closeSearch()
        navigate(`/watches/${results[active].slug}`)
      } else {
        submit(query)
      }
    }
  }

  if (!searchOpen) return null

  return createPortal(
    <div className="nav-panel is-open search-overlay" ref={panelRef} role="dialog" aria-modal="true" aria-label="Search the maison" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
      <div className="nav-panel__body" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <div className="nav-panel__top">
          <p className="eyebrow eyebrow--plain" style={{ color: 'rgba(242,236,226,.55)' }}>
            Search the maison
          </p>
          <button type="button" className="icon-btn" onClick={closeSearch} aria-label="Close search">
            <Icon name="close" size={22} />
          </button>
        </div>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            submit(query)
          }}
          style={{ borderBottom: '1px solid rgba(242,236,226,.25)', display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}
        >
          <Icon name="search" size={26} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(-1)
            }}
            onKeyDown={onKeyDown}
            placeholder="A reference, a material, a movement…"
            aria-label="Search timepieces and the maison"
            aria-controls="search-results"
            aria-activedescendant={active >= 0 ? `search-result-${active}` : undefined}
            style={{
              flex: 1,
              background: 'transparent',
              border: 0,
              color: 'var(--ivory)',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
              fontWeight: 300,
              padding: '0.5rem 0',
            }}
          />
          <kbd className="micro" style={{ color: 'rgba(242,236,226,.4)', display: 'none' }}>ESC</kbd>
        </form>

        <div id="search-results" style={{ paddingTop: '1.75rem', overflowY: 'auto' }}>
          {query.trim() && results.length === 0 && (
            <div role="status" style={{ paddingBlock: '2rem' }}>
              <p className="eyebrow" style={{ color: 'var(--champagne)' }}>No results</p>
              <p style={{ color: 'rgba(242,236,226,.7)', marginTop: '0.75rem', maxWidth: '40ch' }}>
                Nothing in the collection matches “{query}”. Try a reference such as AF·40·GR, a
                material, or browse the full collection.
              </p>
              <Link to="/watches" className="text-link" style={{ color: 'var(--ivory)', marginTop: '1.25rem' }} onClick={closeSearch}>
                View all timepieces <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <ul style={{ display: 'grid', gap: '0.25rem' }}>
              {results.map((p, i) => (
                <li key={p.id}>
                  <Link
                    id={`search-result-${i}`}
                    to={`/watches/${p.slug}`}
                    onClick={() => {
                      remember(query)
                      closeSearch()
                    }}
                    className={`search-result ${active === i ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className="search-result__media">
                      <Media imageKey={p.images.primary.key} alt="" orientation="square" ratio="square" sizes="72px" decorative />
                    </span>
                    <span className="search-result__name">{p.name}</span>
                    <span className="search-result__meta">{p.dial}</span>
                    <span className="search-result__price tabular">{formatPrice(p.price, p.currency)}</span>
                    <Icon name="arrow-up-right" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!query.trim() && (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {recent.length > 0 && (
                <div>
                  <p className="micro" style={{ color: 'rgba(242,236,226,.45)', marginBottom: '0.75rem' }}>Recent</p>
                  <div className="chips">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className="chip"
                        style={{ borderColor: 'rgba(242,236,226,.25)', color: 'rgba(242,236,226,.8)' }}
                        onClick={() => submit(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="micro" style={{ color: 'rgba(242,236,226,.45)', marginBottom: '0.75rem' }}>Suggested</p>
                <div className="chips">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="chip"
                      style={{ borderColor: 'rgba(242,236,226,.25)', color: 'rgba(242,236,226,.8)' }}
                      onClick={() => submit(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="micro" style={{ color: 'rgba(242,236,226,.45)', marginBottom: '0.75rem' }}>Most considered</p>
                <div className="search-suggest-grid">
                  {products.slice(0, 3).map((p) => (
                    <Link key={p.id} to={`/watches/${p.slug}`} onClick={closeSearch} className="search-suggest">
                      <Media imageKey={p.images.primary.key} alt={p.images.primary.alt} orientation="square" ratio="square" sizes="(min-width: 900px) 220px, 45vw" />
                      <span className="search-suggest__name">{p.name}</span>
                      <span className="micro" style={{ color: 'rgba(242,236,226,.5)' }}>{p.ref}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="micro" style={{ marginTop: 'auto', paddingTop: '2rem', color: 'rgba(242,236,226,.35)' }}>
          Use ↑ ↓ to move through results · Enter to open · Escape to close
        </p>
      </div>
    </div>,
    document.body,
  )
}
