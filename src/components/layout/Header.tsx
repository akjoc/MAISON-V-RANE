import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon, Wordmark } from '../primitives/Icon'
import { MegaMenu } from './MegaMenu'
import { primaryNav } from '../../data/nav'
import { useUI } from '../../context/UIContext'
import { useStore } from '../../context/StoreContext'

export function Header() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [condensed, setCondensed] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const { searchOpen, openSearch, openNav, navOpen } = useUI()
  const { cartCount, wishlist } = useStore()

  useEffect(() => {
    setOpenIndex(null)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenIndex(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 160)
  }
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
  }

  const isActive = (to?: string) => {
    if (!to) return false
    if (to === '/') return location.pathname === '/'
    const base = to.split('#')[0]
    return location.pathname === base || location.pathname.startsWith(`${base}/`)
  }

  return (
    <>
      <div className="announce">
        <span className="announce__long">A fictional maison · an original watchmaking prototype</span>
        <span className="announce__dot" aria-hidden="true" />
        <span>
          <Link to="/about#disclaimer">All products &amp; services are demonstration content</Link>
        </span>
      </div>
      <header
        className={`hdr ${condensed ? 'is-condensed' : ''} ${openIndex !== null ? 'is-panel-open' : ''}`}
        ref={headerRef}
      >
        <div className="hdr__inner">
          <div className="hdr__left">
            <nav className="hdr__nav" aria-label="Primary">
              {primaryNav.map((item, i) => (
                <div
                  key={item.label}
                  onMouseEnter={() => {
                    cancelClose()
                    if (window.matchMedia('(min-width: 1024px)').matches) setOpenIndex(i)
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {item.groups ? (
                    <button
                      type="button"
                      className={`hdr__link ${isActive(item.to) ? 'is-active' : ''}`}
                      aria-expanded={openIndex === i}
                      aria-controls={`mega-${i}`}
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      onFocus={() => setOpenIndex(i)}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.to ?? '/'}
                      className={({ isActive: a }) => `hdr__link ${a ? 'is-active' : ''}`}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <Link to="/" className="hdr__logo" aria-label="MAISON VÉRANE — home">
            <Wordmark />
          </Link>

          <div className="hdr__right">
            <button
              type="button"
              className="hdr__search-wide"
              onClick={openSearch}
              aria-label="Search the maison"
              aria-expanded={searchOpen}
            >
              <Icon name="search" size={17} />
              <span className="label">Search</span>
            </button>
            <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <Icon name="heart" size={18} />
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" aria-label={`Shopping bag, ${cartCount} items`}>
              <Icon name="bag" size={18} />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>
            <button
              type="button"
              className="hdr__menu-btn"
              onClick={openNav}
              aria-expanded={navOpen}
              aria-label="Open full navigation menu"
            >
              <span className="bars" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="hdr__menu-label">Menu</span>
            </button>
          </div>
        </div>

        {primaryNav.map((item, i) =>
          item.groups ? (
            <MegaMenu
              key={item.label}
              id={`mega-${i}`}
              item={item}
              open={openIndex === i}
              onClose={() => setOpenIndex(null)}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            />
          ) : null,
        )}
      </header>
    </>
  )
}
