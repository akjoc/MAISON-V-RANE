import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { products } from '../data/products'
import { ProductCard } from '../components/primitives/ProductCard'
import { Icon } from '../components/primitives/Icon'
import { RevealSection } from '../components/primitives/RevealSection'
import { readJSON, writeJSON } from '../lib/storage'
import { useUI } from '../context/UIContext'

const SUGGESTIONS = [
  'Aéroform',
  'Graphite',
  'Chronograph',
  'Skeleton',
  'Alligator',
  'Oxblood',
  'Champagne',
  'Ink blue',
]

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [recent, setRecent] = useState<string[]>(() => readJSON<string[]>('mv.recentSearches', []))
  const [highlight, setHighlight] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { pushToast } = useUI()

  useSeo({
    title: q ? `Search: ${q}` : 'Search',
    description: 'Search the fictional MAISON VÉRANE collection by reference, dial, material or movement.',
    path: `/search${q ? `?q=${encodeURIComponent(q)}` : ''}`,
    noindex: true,
  })

  useEffect(() => {
    setInput(q)
  }, [q])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return products.filter((p) =>
      [p.name, p.ref, p.dial, p.material, p.tagline, p.summary, p.availabilityLabel, ...p.materialTags]
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [q])

  const remember = (term: string) => {
    const clean = term.trim()
    if (!clean) return
    const next = [clean, ...recent.filter((r) => r.toLowerCase() !== clean.toLowerCase())].slice(0, 6)
    setRecent(next)
    writeJSON('mv.recentSearches', next)
  }

  const submit = (term: string) => {
    const clean = term.trim()
    if (!clean) {
      pushToast('Enter a search term first.')
      return
    }
    remember(clean)
    setParams({ q: clean })
    setHighlight(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(results.length - 1, h + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(-1, h - 1))
    } else if (e.key === 'Enter' && highlight >= 0 && results[highlight]) {
      e.preventDefault()
      navigate(`/watches/${results[highlight].slug}`)
    }
  }

  const clearRecent = () => {
    setRecent([])
    writeJSON('mv.recentSearches', [])
  }

  return (
    <div className="search-page">
      <div className="container">
        <header className="page-intro search-page__intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Search</span>
          </nav>
          <p className="eyebrow" style={{ marginTop: '1.5rem' }}>Search the maison</p>
          <form
            role="search"
            className="search-page__form"
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
          >
            <Icon name="search" size={24} />
            <input
              ref={inputRef}
              type="search"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setHighlight(-1)
              }}
              onKeyDown={onKeyDown}
              placeholder="A reference, a dial, a material…"
              aria-label="Search timepieces and the maison"
              autoFocus
            />
            {input && (
              <button type="button" onClick={() => { setInput(''); setParams({}); inputRef.current?.focus() }} aria-label="Clear search">
                <Icon name="close" size={18} />
              </button>
            )}
            <button type="submit" className="btn btn--small">
              <span>Search</span>
            </button>
          </form>

          <div className="search-page__suggest">
            <span className="micro">Suggested</span>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => { setInput(s); submit(s) }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        {!q && (
          <div className="search-page__empty">
            <div>
              <p className="eyebrow">Begin with a reference</p>
              <h2>What would you like to find?</h2>
              <p className="prose">
                Search across all six references, their dials, materials and movements. Every result
                links to the relevant example in the collection.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                <Link to="/watches" className="btn btn--outline"><span>Browse all timepieces</span></Link>
                <Link to="/collections/aeroform" className="btn btn--outline"><span>The collection</span></Link>
              </div>
            </div>
            {recent.length > 0 && (
              <div className="search-page__recent">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                  <p className="micro">Recent searches</p>
                  <button type="button" className="micro" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }} onClick={clearRecent}>
                    Clear
                  </button>
                </div>
                <ul>
                  {recent.map((r) => (
                    <li key={r}>
                      <button type="button" onClick={() => { setInput(r); submit(r) }}>
                        <Icon name="search" size={13} /> {r}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {q && (
          <section className="search-results" aria-live="polite">
            <div className="search-results__head">
              <p className="eyebrow">
                {results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”
              </p>
              <Link to="/watches" className="text-link">Refine in the catalogue <Icon name="arrow-right" size={13} /></Link>
            </div>

            {results.length === 0 ? (
              <div className="empty-state">
                <h2>Nothing in the collection matches that.</h2>
                <p>
                  Try a reference such as AF·40·GR, or a broader term such as “steel”, “chronograph”
                  or “alligator”. The full catalogue may be easier to explore.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn" onClick={() => { setInput(''); setParams({}); inputRef.current?.focus() }}>
                    <span>Try another search</span>
                  </button>
                  <Link to="/watches" className="btn btn--outline"><span>View all timepieces</span></Link>
                </div>
              </div>
            ) : (
              <>
                <div className="search-results__grid">
                  {results.map((p, i) => (
                    <RevealSection key={p.id}>
                      <ProductCard product={p} priority={i < 3} />
                    </RevealSection>
                  ))}
                </div>
                <p className="field__hint" style={{ marginTop: '2rem' }}>
                  Tip: use ↑ and ↓ in the search field to move through results, Enter to open.
                </p>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
