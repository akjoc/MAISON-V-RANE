import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Icon } from '../components/primitives/Icon'

const services = [
  {
    index: '01',
    title: 'Personalisation',
    copy: 'An engraved caseback, a dial direction, a strap chosen from the archive. Small decisions, made with you.',
    to: '/services/personalisation',
    cta: 'Begin a configuration',
    image: 'service-engraving',
    alt: 'An engraver working on a watch caseback',
    meta: 'Engraving · straps · dials',
  },
  {
    index: '02',
    title: 'Care & repair',
    copy: 'Servicing, refinishing and restoration. Most instruments return within eight weeks, with their rate recorded.',
    to: '/services/care-repair',
    cta: 'Request a service',
    image: 'care-service',
    alt: 'A watchmaker inspecting a movement with a loupe',
    meta: 'Servicing · refinishing · restoration',
  },
  {
    index: '03',
    title: 'Expert consultation',
    copy: 'An hour with a specialist — in a salon or by video — to consider the collection, compare references or discuss a first commission.',
    to: '/appointments',
    cta: 'Book an appointment',
    image: 'boutique-interior',
    alt: 'A quiet salon interior with a table and warm light',
    meta: 'Salon · video · atelier',
  },
]

export default function Services() {
  useSeo({
    title: 'Client services',
    description:
      'Personalisation, care and repair, and expert consultations from the fictional MAISON VÉRANE atelier.',
    path: '/services',
    image: '/assets/images/service-engraving-1200.webp',
  })

  return (
    <div className="services-page">
      <div className="container">
        <header className="page-intro services-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Client services</span>
          </nav>
          <div className="services-intro__grid">
            <RevealText as="h1" immediate>
              <Line>The</Line>
              <Line>aftercare.</Line>
            </RevealText>
            <div className="services-intro__copy">
              <p className="lede">
                A watch is not finished when it leaves the atelier. These are the services that keep
                it accurate, personal and wearable for a long time.
              </p>
              <p className="micro">All services, fees and lead times are demonstration content</p>
            </div>
          </div>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <RevealSection key={service.index} className="service-card">
              <Link to={service.to} className="service-card__link">
                <div className="service-card__media">
                  <Media
                    imageKey={service.image}
                    alt={service.alt}
                    orientation={service.image === 'care-service' || service.image === 'boutique-interior' ? 'wide' : 'square'}
                    ratio="editorial"
                    sizes="(min-width: 900px) 30vw, 92vw"
                    zoomOnHover
                  />
                </div>
                <div className="service-card__body">
                  <div className="service-card__top">
                    <span className="service-card__index">{service.index}</span>
                    <span className="micro">{service.meta}</span>
                  </div>
                  <h2>{service.title}</h2>
                  <p>{service.copy}</p>
                  <span className="text-link">
                    {service.cta} <Icon name="arrow-right" size={13} />
                  </span>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>

        <section className="services-promise">
          <RevealSection className="services-promise__copy" stagger>
            <p className="eyebrow">The maison’s promise</p>
            <h2>Kept, not merely sold.</h2>
            <p className="prose">
              Every reference is recorded in a client register so that servicing, refinishing and
              strap changes can be carried out consistently years later. In this prototype the
              register is simulated in your browser — but the principle is real.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/client-care" className="btn btn--outline">
                <span>Client care</span>
              </Link>
              <Link to="/contact" className="btn btn--outline">
                <span>Contact the maison</span>
              </Link>
            </div>
          </RevealSection>
          <RevealSection className="services-promise__stats" stagger>
            {[
              ['08', 'weeks typical service'],
              ['05', 'years warranty'],
              ['1962', 'fictional founding year'],
            ].map(([value, label]) => (
              <div key={label} className="services-promise__stat">
                <span className="serif">{value}</span>
                <span className="micro">{label}</span>
              </div>
            ))}
          </RevealSection>
        </section>
      </div>
    </div>
  )
}
