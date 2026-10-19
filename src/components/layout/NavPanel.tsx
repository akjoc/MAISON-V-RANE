import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Wordmark } from '../primitives/Icon'
import { Media } from '../primitives/Media'
import { useUI } from '../../context/UIContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import type { CSSProperties } from 'react'

const links = [
  { label: 'Collections', to: '/collections/aeroform', note: 'Aéroform' },
  { label: 'Timepieces', to: '/watches', note: 'Six references' },
  { label: 'Craftsmanship', to: '/craftsmanship', note: 'The atelier' },
  { label: 'Watchmaking', to: '/watchmaking', note: 'Calibre MV·01' },
  { label: 'Services', to: '/services', note: 'Care & personalisation' },
  { label: 'Boutiques', to: '/boutiques', note: 'Eight fictional salons' },
  { label: 'Journal & appointments', to: '/appointments', note: 'By invitation' },
]

export function NavPanel() {
  const { navOpen, closeNav } = useUI()
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, navOpen, closeNav)

  return (
    <div
      className={`nav-panel ${navOpen ? 'is-open' : ''}`}
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Maison navigation"
      aria-hidden={!navOpen}
      inert={!navOpen ? true : undefined}
    >
      <div className="nav-panel__body">
        <div className="nav-panel__top">
          <Wordmark />
          <button type="button" className="icon-btn" onClick={closeNav} aria-label="Close navigation">
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav aria-label="Full navigation">
          <div className="nav-panel__links">
            {links.map((link, i) => (
              <div
                className="nav-panel__item"
                key={link.to}
                style={{ '--i': i } as CSSProperties}
              >
                <Link className="nav-panel__link" to={link.to} onClick={closeNav}>
                  <span>{link.label}</span>
                  <span className="idx">{link.note}</span>
                </Link>
              </div>
            ))}
          </div>
        </nav>
        <div className="nav-panel__meta">
          <Link to="/search" onClick={closeNav}>Search</Link>
          <Link to="/wishlist" onClick={closeNav}>Wishlist</Link>
          <Link to="/cart" onClick={closeNav}>Shopping bag</Link>
          <Link to="/account" onClick={closeNav}>Account</Link>
          <Link to="/contact" onClick={closeNav}>Contact</Link>
        </div>
      </div>
      <div className="nav-panel__aside">
        <Media imageKey="campaign-staircase" alt="Aéroform worn at the base of a travertine staircase" orientation="portrait" sizes="45vw" />
        <div className="nav-panel__caption">
          <span className="eyebrow" style={{ color: 'rgba(242,236,226,.6)' }}>Campaign</span>
          <span className="nav-panel__caption-title">
            Instruments for the hours between departure and arrival.
          </span>
          <Link to="/collections/aeroform" className="text-link" style={{ color: 'var(--ivory)' }} onClick={closeNav}>
            Explore Aéroform <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
