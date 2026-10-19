import { Link } from 'react-router-dom'
import { footerNav } from '../../data/nav'
import { Wordmark, Icon } from '../primitives/Icon'
import { NewsletterForm } from '../forms/NewsletterForm'
import { RegionSelector } from './RegionSelector'
import { useUI } from '../../context/UIContext'

const socials = ['Instagram', 'Pinterest', 'YouTube'] as const

export function Footer() {
  const { pushToast } = useUI()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Wordmark />
            <p className="footer__statement">
              Mechanical instruments for the hours between departure and arrival.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <RegionSelector />
            </div>
          </div>
          <div className="footer__cols">
            {footerNav.map((col) => (
              <div key={col.title} className="footer__col">
                <p className="footer__col-title">{col.title}</p>
                <div className="footer__links">
                  {col.links.map((link) => (
                    <Link key={link.to + link.label} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__news">
          <div>
            <h3>Correspondence from the maison</h3>
            <p>
              Occasional letters on new chapters, atelier process and private viewings. No more than
              one a month.
            </p>
          </div>
          <NewsletterForm compact />
        </div>

        <div className="footer__bottom">
          <div className="footer__legal">
            <Link to="/legal/privacy">Privacy</Link>
            <Link to="/legal/terms">Terms</Link>
            <Link to="/legal/cookies">Cookies</Link>
            <Link to="/legal/accessibility">Accessibility</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer__social">
            {socials.map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`${s} — fictional channel`}
                onClick={() => pushToast(`${s} would open here. Social channels are fictional in this prototype.`)}
              >
                {s === 'Instagram' ? <Icon name="instagram" size={16} /> : <span style={{ fontSize: 9, letterSpacing: '0.08em' }}>{s.slice(0, 2).toUpperCase()}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="footer__notice">
          <span>© 2026 MAISON VÉRANE — a fictional maison for design demonstration.</span>
          <span>No products, prices, boutiques or orders on this site are real.</span>
        </div>
      </div>
      <div className="footer__giant" aria-hidden="true">
        AÉROFORM
      </div>
    </footer>
  )
}
