import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { boutiques } from '../data/boutiques'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Icon } from '../components/primitives/Icon'

const REGIONS = ['All regions', 'Europe', 'Asia', 'Americas', 'Middle East']
const TYPES = ['All types', 'Maison', 'Salon', 'Atelier']

function MapPlaceholder({
  activeId,
  onSelect,
}: {
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="map">
      <div className="map__canvas">
        <svg viewBox="0 0 1000 560" className="map__svg" role="img" aria-label="Stylised locator map of fictional MAISON VÉRANE boutiques">
          <defs>
            <linearGradient id="map-sea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eee7da" />
              <stop offset="100%" stopColor="#e4dbcb" />
            </linearGradient>
            <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0V50" fill="none" stroke="#c9c0af" strokeWidth="0.5" opacity="0.55" />
            </pattern>
          </defs>
          <rect width="1000" height="560" fill="url(#map-sea)" />
          <rect width="1000" height="560" fill="url(#map-grid)" />
          {/* Abstract land contours — deliberately not a real map */}
          <path
            d="M70 168c52-42 118-56 176-38 44 14 70 7 106 25 36 18 38 60 12 84-26 24-64 18-92 34-28 16-28 52-60 58-40 8-74-22-96-56-24-36-72-78-46-107Z"
            fill="#ded4c2"
            stroke="#b9ad97"
            strokeWidth="1"
          />
          <path
            d="M300 350c34-18 74-8 96 18 22 26 16 62 46 82 30 20 76 12 86 38 10 26-30 44-74 40-52-4-86-28-116-62-28-32-70-96-38-116Z"
            fill="#ded4c2"
            stroke="#b9ad97"
            strokeWidth="1"
          />
          <path
            d="M468 140c46-34 112-28 152 2 40 30 62 16 96 34 34 18 58 8 90 30 32 22 88 24 104 58 16 34-18 66-62 78-44 12-84-8-126 2-42 10-64 42-108 38-44-4-62-40-72-76-10-36-30-58-48-88-18-30-52-56-26-78Z"
            fill="#ded4c2"
            stroke="#b9ad97"
            strokeWidth="1"
          />
          <path
            d="M742 386c30-16 66-8 84 12 18 20 8 48-18 60-26 12-62 8-80-10-18-18-14-46 14-62Z"
            fill="#ded4c2"
            stroke="#b9ad97"
            strokeWidth="1"
          />
          <path d="M0 470c120-26 240-10 340 12s210 22 330-6 230-14 330 10" fill="none" stroke="#c9c0af" strokeWidth="0.8" strokeDasharray="2 6" />
          <text x="28" y="536" fontSize="9" letterSpacing="2.4" fill="#9a917f">STYLISED LOCATOR · NOT TO SCALE</text>
          <text x="760" y="536" fontSize="9" letterSpacing="2.4" fill="#9a917f">MAISON VÉRANE</text>
        </svg>
        {boutiques.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`map__pin ${activeId === b.id ? 'is-active' : ''}`}
            style={{ left: `${b.coordinates.x}%`, top: `${b.coordinates.y}%` }}
            onClick={() => onSelect(b.id)}
            aria-label={`${b.name}, ${b.type}`}
            aria-pressed={activeId === b.id}
          >
            <span className="map__pin-dot" aria-hidden="true" />
            <span className="map__pin-label">{b.city}</span>
          </button>
        ))}
      </div>
      <p className="map__note">
        <Icon name="map-pin" size={14} />
        Stylised map placeholder — no map API is configured in this prototype. All locations are
        fictional.
      </p>
    </div>
  )
}

export default function Boutiques() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All regions')
  const [type, setType] = useState('All types')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [activeId, setActiveId] = useState<string | null>(boutiques[0].id)

  useSeo({
    title: 'Boutiques',
    description:
      'Find a fictional MAISON VÉRANE salon, maison or atelier. Search by city, filter by region and view the stylised locator map.',
    path: '/boutiques',
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return boutiques.filter((b) => {
      const matchesQuery =
        !q ||
        [b.city, b.country, b.name, b.services.join(' ')].join(' ').toLowerCase().includes(q)
      const matchesRegion = region === 'All regions' || b.region === region
      const matchesType = type === 'All types' || b.type === type
      return matchesQuery && matchesRegion && matchesType
    })
  }, [query, region, type])

  const active = boutiques.find((b) => b.id === activeId) ?? filtered[0] ?? null

  const reset = () => {
    setQuery('')
    setRegion('All regions')
    setType('All types')
  }

  return (
    <div className="boutiques-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Boutiques</span>
          </nav>
          <div className="boutiques-intro">
            <RevealText as="h1" immediate>
              <Line>Where to</Line>
              <Line>
                find us<em>.</em>
              </Line>
            </RevealText>
            <div className="boutiques-intro__copy">
              <p className="lede">
                Eight fictional locations, each with its own character: a loft in New York, a
                courtyard in Milan, a haveli in Jaipur. All are marked as fictional in this
                prototype.
              </p>
              <div className="demo-note">Simulated locations · no real store addresses</div>
            </div>
          </div>
        </header>

        <div className="boutique-toolbar">
          <div className="boutique-search">
            <label htmlFor="boutique-q" className="visually-hidden">Search boutiques by city or country</label>
            <Icon name="search" size={17} />
            <input
              id="boutique-q"
              type="search"
              placeholder="Search a city, country or service…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
          <div className="boutique-filters">
            <label className="visually-hidden" htmlFor="boutique-region">Region</label>
            <select id="boutique-region" className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <label className="visually-hidden" htmlFor="boutique-type">Type</label>
            <select id="boutique-type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="toggle-group" role="group" aria-label="View as">
              <button type="button" aria-pressed={view === 'list'} aria-label="List view" onClick={() => setView('list')}>
                <Icon name="list" size={15} />
              </button>
              <button type="button" aria-pressed={view === 'map'} aria-label="Map view" onClick={() => setView('map')}>
                <Icon name="map-pin" size={15} />
              </button>
            </div>
          </div>
        </div>

        <p className="boutique-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'location' : 'locations'}
          {region !== 'All regions' || type !== 'All types' || query ? ' matching' : ' in the register'}
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state" role="status">
            <p className="eyebrow">No locations</p>
            <h2>No salon matches that search.</h2>
            <p>Try a different city or region, or clear the filters to see all eight fictional locations.</p>
            <button type="button" className="btn" onClick={reset}>
              <span>Clear search &amp; filters</span>
            </button>
          </div>
        ) : (
          <div className={`boutique-layout ${view === 'map' ? 'is-map' : ''}`}>
            <div className="boutique-list">
              {filtered.map((b) => (
                <article
                  key={b.id}
                  className={`boutique-card ${active?.id === b.id ? 'is-active' : ''}`}
                >
                  <button
                    type="button"
                    className="boutique-card__select"
                    onClick={() => setActiveId(b.id)}
                    aria-pressed={active?.id === b.id}
                  >
                    <span className="boutique-card__top">
                      <span className="boutique-card__type">{b.type}</span>
                      <span className="micro">{b.country}</span>
                    </span>
                    <span className="boutique-card__city">{b.city}</span>
                    <span className="boutique-card__name">{b.name}</span>
                    <span className="boutique-card__address">{b.addressLine}</span>
                    <span className="boutique-card__services">
                      {b.services.map((s) => <span key={s} className="micro">{s}</span>)}
                    </span>
                  </button>
                  <div className="boutique-card__actions">
                    <Link to="/appointments" className="text-link">
                      Book here <Icon name="arrow-right" size={12} />
                    </Link>
                    <span className="micro">{b.hours}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="boutique-visual">
              <MapPlaceholder activeId={active?.id ?? null} onSelect={setActiveId} />
              {active && (
                <div className="boutique-visual__detail" role="status">
                  <p className="micro">Selected location</p>
                  <h2>{active.city}</h2>
                  <p className="serif" style={{ fontSize: '1.1rem' }}>{active.name}</p>
                  <p className="small">{active.note}</p>
                  <div className="boutique-visual__row">
                    <span className="micro">Hours</span>
                    <span className="small">{active.hours}</span>
                  </div>
                  <div className="boutique-visual__row">
                    <span className="micro">Address</span>
                    <span className="small">{active.addressLine}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <Link to="/appointments" className="btn btn--small">
                      <span>Arrange a visit</span>
                    </Link>
                    <Link to="/contact" className="btn btn--outline btn--small">
                      <span>Contact</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <section className="section boutique-note">
          <RevealSection className="boutique-note__inner" stagger>
            <p className="eyebrow">A note on this page</p>
            <h2>An honest placeholder.</h2>
            <p className="prose">
              No map provider is configured for this prototype, so the locator above is an original
              illustration rather than a live map. The eight locations, their addresses, hours and
              services are invented for demonstration. To make this page live, replace the
              MapPlaceholder component with your preferred map SDK and supply verified locations.
            </p>
            <Link to="/appointments" className="text-link">
              Book a simulated appointment <Icon name="arrow-right" size={13} />
            </Link>
          </RevealSection>
        </section>
      </div>
    </div>
  )
}
