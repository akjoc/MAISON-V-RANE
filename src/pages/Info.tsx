import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Accordion } from '../components/primitives/Accordion'
import { Icon } from '../components/primitives/Icon'
import { faqs } from '../data/faq'
import { boutiques } from '../data/boutiques'
import { emailError, demoReference, required } from '../lib/validation'
import { useUI } from '../context/UIContext'

export type InfoPage = 'about' | 'faq' | 'contact' | 'shipping-returns' | 'client-care'

interface InfoProps {
  page: InfoPage
}

const META: Record<InfoPage, { title: string; description: string; path: string }> = {
  about: {
    title: 'About the maison',
    description:
      'The story, principles and fictional founding of MAISON VÉRANE — an original watchmaking house created for this design prototype.',
    path: '/about',
  },
  faq: {
    title: 'Frequently asked questions',
    description: 'Answers on orders, care, services and the fictional nature of this MAISON VÉRANE prototype.',
    path: '/faq',
  },
  contact: {
    title: 'Contact',
    description: 'Write to the fictional maison, request client care or arrange a consultation. Demonstration form only.',
    path: '/contact',
  },
  'shipping-returns': {
    title: 'Shipping & returns',
    description: 'Demonstration delivery, packaging and returns information for the fictional Aéroform collection.',
    path: '/shipping-returns',
  },
  'client-care': {
    title: 'Client care',
    description: 'Servicing, repairs, strap fitting and contact channels for owners of fictional MAISON VÉRANE pieces.',
    path: '/client-care',
  },
}

/* ————————————————————————— About ————————————————————————— */

function About() {
  const timeline = [
    { year: '1962', title: 'A bench in the sixth', copy: 'A fictional watchmaker repairs instrumentation for rally teams from a single bench in Paris. The maison’s founding myth.' },
    { year: '1974', title: 'The first cushion', copy: 'A prototype case is drawn around a stopwatch movement. It is never sold, but it defines the geometry used decades later.' },
    { year: '2009', title: 'A private archive', copy: 'The maison begins collecting its own references, service records and drawings rather than treating them as ephemera.' },
    { year: '2024', title: 'Aéroform', copy: 'The collection returns to the founding silhouette, with a modern calibre and a single, repeatable finish.' },
  ]

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">About</span>
          </nav>
          <div className="about-hero__grid">
            <RevealText as="h1" immediate>
              <Line>A house</Line>
              <Line>of small</Line>
              <Line>
                decisions<em>.</em>
              </Line>
            </RevealText>
            <RevealSection className="about-hero__aside" stagger>
              <p className="lede">
                MAISON VÉRANE is an invented maison — a design exercise in restraint, proportion and
                the language of instruments.
              </p>
              <p className="micro">Fictional brand · original visuals · no affiliation</p>
            </RevealSection>
          </div>
        </div>
        <div className="about-hero__figure">
          <Media imageKey="editorial-collection" alt="Aéroform on a travertine plinth in warm architectural light" orientation="wide" ratio="cinema" sizes="100vw" priority />
        </div>
      </section>

      <section className="section section--lg">
        <div className="container about-story">
          <RevealSection className="about-story__lead">
            <p className="eyebrow"><span className="eyebrow__num">01</span> The premise</p>
            <RevealText as="h2">
              <Line>We did not need</Line>
              <Line>another watch.</Line>
              <Line>We wanted a</Line>
              <Line>
                quieter <em>instrument.</em>
              </Line>
            </RevealText>
          </RevealSection>
          <RevealSection className="about-story__copy" stagger>
            <p className="prose">
              Aéroform began as a drawing exercise: what remains of a luxury sports watch when
              everything decorative is removed? The answer kept returning to three things — a
              cushion silhouette, a single direction of brushing, and a dial you can read at a
              glance without looking twice.
            </p>
            <p className="prose">
              This prototype imagines the maison that would make such a watch. It is entirely
              original: the brand, collection, calibres, boutiques and client services do not exist.
              The craftsmanship described is grounded in real watchmaking practice, but no real
              workshop, designer or brand is represented.
            </p>
            <div className="about-signature">
              <p className="serif">— The maison, in fiction</p>
              <p className="micro">Designed and built as a demonstration</p>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="section about-principles">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow"><span className="eyebrow__num">02</span> Principles</p>
              <h2>Three rules, kept deliberately few</h2>
            </div>
          </div>
          <div className="about-principles__grid">
            {[
              ['Proportion', 'The case is drawn before the dial. If the silhouette does not work at arm’s length, no finish will save it.'],
              ['One direction', 'Each brushed surface is finished in a single pass. Multiple directions read as noise at a distance.'],
              ['One colour', 'Oxblood is the only accent in the collection, and it is used sparingly — a cabochon, a seconds tip, a single dial.'],
            ].map(([title, copy], i) => (
              <RevealSection key={title} className="about-principle">
                <span className="about-principle__num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--lg about-timeline">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow"><span className="eyebrow__num">03</span> A fictional chronology</p>
              <h2>Four moments, invented</h2>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.92rem' }}>
                Dates and events are part of the fiction. They exist to give the collection a
                coherent memory, not to make a historical claim.
              </p>
            </div>
          </div>
          <ol className="about-timeline__list">
            {timeline.map((item) => (
              <li key={item.year}>
                <RevealSection className="about-timeline__item" stagger>
                  <span className="about-timeline__year">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </RevealSection>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section about-disclaimer" id="disclaimer">
        <div className="container about-disclaimer__inner">
          <div>
            <p className="eyebrow">Disclosure</p>
            <h2>An honest prototype.</h2>
          </div>
          <div className="about-disclaimer__copy">
            <p className="prose">
              MAISON VÉRANE is a fictional luxury watch brand created for a web design and
              development demonstration. It is not affiliated with any existing maison. All
              references, calibres, boutiques, addresses, prices, services and personalisation
              options are invented. All imagery was generated originally for this project; no
              third-party campaign photography, branding or artwork has been copied or hot-linked.
            </p>
            <p className="prose">
              Forms on this site simulate success states and store limited data in your browser. No
              information is transmitted, no orders or appointments are created, and no payment
              details are ever collected.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <Link to="/watches" className="btn btn--outline"><span>Explore the collection</span></Link>
              <Link to="/legal/privacy" className="btn btn--outline"><span>Privacy notice</span></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ————————————————————————— FAQ ————————————————————————— */

function Faq() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const categories = ['All', 'Orders', 'Care', 'Services', 'Maison']

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs.filter((f) => {
      const matchCat = category === 'All' || f.category === category
      const matchQ = !q || `${f.question} ${f.answer}`.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [category, query])

  return (
    <div className="faq-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Frequently asked</span>
          </nav>
          <div className="faq-intro">
            <h1>Questions,<br /><em>answered.</em></h1>
            <div>
              <p className="lede">
                Orders, care, services and the fictional nature of this prototype. If something is
                missing, write to the maison and we will add it.
              </p>
            </div>
          </div>
        </header>

        <div className="faq-toolbar">
          <div className="faq-search">
            <label htmlFor="faq-q" className="visually-hidden">Search questions</label>
            <Icon name="search" size={16} />
            <input id="faq-q" type="search" placeholder="Search questions…" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={14} /></button>}
          </div>
          <div className="chips" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button key={c} type="button" className={`chip ${category === c ? 'is-selected' : ''}`} aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="faq-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'answer' : 'answers'}
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="eyebrow">Nothing found</p>
            <h2>No question matches that search.</h2>
            <p>Try a shorter phrase, or browse all categories.</p>
            <button type="button" className="btn" onClick={() => { setQuery(''); setCategory('All') }}>
              <span>Reset the search</span>
            </button>
          </div>
        ) : (
          <div className="faq-list">
            {filtered.map((item) => (
              <details className="faq-item" key={item.id}>
                <summary>
                  <span className="faq-item__cat">{item.category}</span>
                  <span className="faq-item__q">{item.question}</span>
                  <span className="faq-item__icon" aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        )}

        <div className="faq-help">
          <div>
            <p className="eyebrow">Still uncertain?</p>
            <h2>Speak with client care.</h2>
            <p className="prose">A specialist can answer by email, telephone or in a salon — in this prototype, through demonstration forms only.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn"><span>Contact the maison</span></Link>
            <Link to="/client-care" className="btn btn--outline"><span>Client care</span></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ————————————————————————— Contact ————————————————————————— */

function Contact() {
  const { pushToast } = useUI()
  const [form, setForm] = useState({ name: '', email: '', topic: 'A timepiece', message: '', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<{ ref: string; name: string } | null>(null)

  const update = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    const nameErr = required(form.name)
    if (nameErr) next.name = nameErr
    const em = emailError(form.email)
    if (em) next.email = em
    if (form.message.trim().length < 20) next.message = 'Please write at least 20 characters so we can help.'
    if (!form.consent) next.consent = 'Please confirm you understand this is a demonstration.'
    setErrors(next)
    if (Object.keys(next).length) {
      pushToast('Please check the form.', 'error')
      return
    }
    setSent({ ref: demoReference('MSG'), name: form.name.trim() })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Contact</span>
          </nav>
          <div className="contact-intro">
            <h1>Write to<br /><em>the maison.</em></h1>
            <div>
              <p className="lede">
                For the collection, a service, an appointment or a press enquiry. Replies would
                normally arrive within two working days.
              </p>
              <div className="demo-note" style={{ marginTop: '0.75rem' }}>Demonstration form · nothing is sent</div>
            </div>
          </div>
        </header>

        <div className="contact-layout">
          <div className="contact-form-wrap">
            {sent ? (
              <div className="form-confirm" role="status">
                <span className="form-confirm__icon"><Icon name="check" size={22} /></span>
                <p className="eyebrow">Demonstration message recorded</p>
                <h2>Thank you, {sent.name}.</h2>
                <p>
                  Your message would carry the reference <strong>{sent.ref}</strong>. No message has
                  been sent and no member of a client care team will see it.
                </p>
                <p className="field__hint">This confirmation exists only in this browser session.</p>
                <button type="button" className="btn btn--outline" onClick={() => { setSent(null); setForm({ name: '', email: '', topic: 'A timepiece', message: '', consent: false }) }}>
                  <span>Write another message</span>
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="form-grid">
                  <div className="field span-2">
                    <label className="field__label" htmlFor="ct-name">Your name <span className="req">*</span></label>
                    <input id="ct-name" className="input" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} aria-invalid={Boolean(errors.name)} />
                    {errors.name && <p className="field__error">{errors.name}</p>}
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="ct-email">Email <span className="req">*</span></label>
                    <input id="ct-email" type="email" className="input" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} aria-invalid={Boolean(errors.email)} />
                    {errors.email && <p className="field__error">{errors.email}</p>}
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="ct-topic">Subject</label>
                    <select id="ct-topic" className="select" value={form.topic} onChange={(e) => update('topic', e.target.value)}>
                      {['A timepiece', 'A service or repair', 'An appointment', 'Personalisation', 'Press', 'Something else'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field span-2">
                    <label className="field__label" htmlFor="ct-message">Message <span className="req">*</span></label>
                    <textarea id="ct-message" className="textarea" value={form.message} onChange={(e) => update('message', e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby="ct-message-hint" />
                    <p className="field__hint" id="ct-message-hint">{form.message.length} characters · minimum 20</p>
                    {errors.message && <p className="field__error">{errors.message}</p>}
                  </div>
                  <div className="span-2">
                    <label className="checkbox">
                      <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} aria-invalid={Boolean(errors.consent)} />
                      <span>I understand this is a fictional demonstration and my message will not be sent or stored remotely.</span>
                    </label>
                    {errors.consent && <p className="field__error" style={{ marginTop: 6 }}>{errors.consent}</p>}
                  </div>
                </div>
                <button type="submit" className="btn" style={{ marginTop: '1.5rem' }}>
                  <span>Send demonstration message</span>
                </button>
              </form>
            )}
          </div>

          <aside className="contact-aside">
            <RevealSection className="contact-aside__block" stagger>
              <p className="micro">Client care</p>
              <p className="contact-aside__line">care@maisonverane.example</p>
              <p className="field__hint">Fictional address · not monitored</p>
            </RevealSection>
            <RevealSection className="contact-aside__block" stagger>
              <p className="micro">Telephone</p>
              <p className="contact-aside__line">+44 (0)20 0000 0000</p>
              <p className="field__hint">Monday to Friday, 09:00–18:00 GMT · fictional number</p>
            </RevealSection>
            <RevealSection className="contact-aside__block" stagger>
              <p className="micro">Boutiques</p>
              <ul className="contact-boutiques">
                {boutiques.slice(0, 4).map((b) => (
                  <li key={b.id}>
                    <span className="serif">{b.city}</span>
                    <span className="micro">{b.type}</span>
                  </li>
                ))}
              </ul>
              <Link to="/boutiques" className="text-link">All locations <Icon name="arrow-right" size={12} /></Link>
            </RevealSection>
            <RevealSection className="contact-aside__block" stagger>
              <p className="micro">Faster answers</p>
              <Link to="/faq" className="text-link">Frequently asked <Icon name="arrow-right" size={12} /></Link>
              <Link to="/appointments" className="text-link">Book an appointment <Icon name="arrow-right" size={12} /></Link>
            </RevealSection>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ————————————————————————— Shipping & returns ————————————————————————— */

function ShippingReturns() {
  return (
    <div className="shipping-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Shipping &amp; returns</span>
          </nav>
          <div className="shipping-intro">
            <h1>Delivery &amp;<br /><em>returns.</em></h1>
            <div>
              <p className="lede">
                Insured, signed for and carefully packed. This page describes how a live order would
                work; no order in this prototype is real.
              </p>
              <div className="demo-note" style={{ marginTop: '0.75rem' }}>Mock terms · no shipments</div>
            </div>
          </div>
        </header>

        <div className="shipping-layout">
          <section className="shipping-main">
            <h2>Delivery</h2>
            <table className="table shipping-table">
              <thead>
                <tr><th scope="col">Method</th><th scope="col">Time</th><th scope="col">Cost</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Insured courier</th><td>2–5 working days</td><td>Complimentary (mock)</td></tr>
                <tr><th scope="row">Boutique collection</th><td>Ready in 3 working days</td><td>Complimentary (mock)</td></tr>
                <tr><th scope="row">Atelier collection</th><td>By appointment</td><td>Complimentary (mock)</td></tr>
              </tbody>
            </table>
            <p className="field__hint">All timings and terms are illustrative and not an offer.</p>

            <Accordion
              multiple
              defaultOpen={['pack']}
              items={[
                {
                  id: 'pack',
                  title: 'How a piece would be packed',
                  content: (
                    <p>
                      In a lacquered graphite case lined with undyed wool, inside a plain outer box,
                      with the bracelet fitted to your measurement. The outer packaging carries no
                      branding, and the parcel requires a signature.
                    </p>
                  ),
                },
                {
                  id: 'tracking',
                  title: 'Tracking and signature',
                  content: (
                    <p>
                      A tracking number would be issued on dispatch, with delivery to the address on
                      the order only. In this prototype no tracking number exists and no courier is
                      involved.
                    </p>
                  ),
                },
                {
                  id: 'returns',
                  title: 'Returns',
                  content: (
                    <p>
                      Unworn pieces may be returned within 30 days of delivery, with seals intact and
                      all presentation materials. Personalised pieces — engraved casebacks,
                      commissioned dials — cannot be returned. Return shipping would be arranged by
                      the boutique.
                    </p>
                  ),
                },
                {
                  id: 'exchanges',
                  title: 'Exchanges and strap fitting',
                  content: (
                    <p>
                      A different strap or bracelet size can be exchanged within 30 days. Sizing is
                      complimentary in salon for the life of the watch.
                    </p>
                  ),
                },
                {
                  id: 'duties',
                  title: 'Taxes and duties',
                  content: (
                    <p>
                      Prices would be shown inclusive of local taxes where applicable. Any import
                      duties outside the delivery region would be shown before confirmation.
                    </p>
                  ),
                },
              ]}
            />
          </section>

          <aside className="shipping-aside">
            <Media imageKey="hero-vertical-wide" alt="Aéroform worn at the wheel of a grand-touring car" orientation="wide" ratio="editorial" sizes="(min-width: 900px) 34vw, 92vw" />
            <p className="micro">Campaign study · the collection on the wrist</p>
            <div className="shipping-aside__links">
              <Link to="/faq" className="text-link">Questions <Icon name="arrow-right" size={12} /></Link>
              <Link to="/contact" className="text-link">Contact client care <Icon name="arrow-right" size={12} /></Link>
              <Link to="/legal/terms" className="text-link">Terms of use <Icon name="arrow-right" size={12} /></Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ————————————————————————— Client care ————————————————————————— */

function ClientCare() {
  return (
    <div className="clientcare-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Client care</span>
          </nav>
          <div className="clientcare-intro">
            <h1>At your<br /><em>service.</em></h1>
            <div>
              <p className="lede">
                Sizing, servicing, straps, travel cases or a question about a piece you already own.
                A specialist would be glad to help.
              </p>
              <div className="demo-note" style={{ marginTop: '0.75rem' }}>Demonstration support · fictional contacts</div>
            </div>
          </div>
        </header>

        <div className="clientcare-grid">
          {[
            { title: 'Service & repair', copy: 'Maintenance, full servicing, refinishing and restoration.', to: '/services/care-repair', cta: 'Request a service', icon: 'sparkle' as const },
            { title: 'Straps & sizing', copy: 'Six archive straps, bracelet sizing, clasps and quick-release fitting.', to: '/services/personalisation', cta: 'Explore straps', icon: 'rotate' as const },
            { title: 'Appointments', copy: 'Salon, atelier or video consultations with a specialist.', to: '/appointments', cta: 'Book a time', icon: 'map-pin' as const },
            { title: 'Shipping & returns', copy: 'Delivery, packaging, returns and exchanges.', to: '/shipping-returns', cta: 'Read the terms', icon: 'bag' as const },
            { title: 'Frequently asked', copy: 'Answers on warranty, water resistance, servicing intervals and more.', to: '/faq', cta: 'Read the answers', icon: 'search' as const },
            { title: 'Contact', copy: 'Write to client care, or arrange a call at a convenient hour.', to: '/contact', cta: 'Write to us', icon: 'mail' as const },
          ].map((item) => (
            <RevealSection key={item.title} className="clientcare-card">
              <Icon name={item.icon} size={20} />
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
              <Link to={item.to} className="text-link">{item.cta} <Icon name="arrow-right" size={12} /></Link>
            </RevealSection>
          ))}
        </div>

        <section className="clientcare-info">
          <div>
            <p className="eyebrow">Direct</p>
            <h2>Speak with a person</h2>
            <dl className="clientcare-info__list">
              <div><dt className="micro">Email</dt><dd>care@maisonverane.example</dd></div>
              <div><dt className="micro">Telephone</dt><dd>+44 (0)20 0000 0000</dd></div>
              <div><dt className="micro">Hours</dt><dd>Monday to Friday, 09:00–18:00 GMT</dd></div>
              <div><dt className="micro">Post</dt><dd>Fictional atelier, Paris — see boutiques</dd></div>
            </dl>
            <p className="field__hint">All details are fictional and not monitored.</p>
          </div>
          <div className="clientcare-info__accordion">
            <Accordion
              items={[
                { id: 'own', title: 'Registering a piece', content: <p>A register would record the reference, date of purchase and service history, extending the warranty. In this prototype the register is simulated in the demo account.</p> },
                { id: 'travel', title: 'Travelling with a watch', content: <p>Carry mechanical pieces in hand luggage, wound and set. Avoid magnets in airport scanners; the watch itself is unaffected by normal screening.</p> },
                { id: 'magnet', title: 'Magnetism', content: <p>Keep mechanical watches away from strong magnets — tablet covers and speakers are common culprits. If the rate becomes erratic, an atelier can demagnetise the movement in minutes.</p> },
                { id: 'water', title: 'Water resistance', content: <p>Gaskets age and should be tested annually for regularly submerged watches. Never operate the crown or pushers underwater.</p> },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

/* ————————————————————————— Entry ————————————————————————— */

export function Info({ page }: InfoProps) {
  const meta = META[page]
  useSeo({ title: meta.title, description: meta.description, path: meta.path })

  switch (page) {
    case 'about':
      return <About />
    case 'faq':
      return <Faq />
    case 'contact':
      return <Contact />
    case 'shipping-returns':
      return <ShippingReturns />
    case 'client-care':
      return <ClientCare />
    default:
      return null
  }
}

export default Info
