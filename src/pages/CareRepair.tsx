import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Accordion } from '../components/primitives/Accordion'
import { Icon } from '../components/primitives/Icon'
import { products } from '../data/products'
import { emailError, demoReference, phoneError } from '../lib/validation'
import { useUI } from '../context/UIContext'

const tiers = [
  { name: 'Maintenance', price: 'from £320', time: '3–4 weeks', copy: 'Case cleaning, bracelet refinishing, gasket replacement and rate check.' },
  { name: 'Full service', price: 'from £680', time: '8 weeks', copy: 'Complete disassembly, movement cleaning, lubrication, regulation and water testing.' },
  { name: 'Restoration', price: 'on assessment', time: '12–20 weeks', copy: 'For vintage or damaged pieces. Dial and case conservation by the atelier.' },
]

const steps = [
  ['01', 'Request', 'Complete the form with the reference and a description of the fault.'],
  ['02', 'Assessment', 'The atelier confirms the work, a fixed quote and a lead time in writing.'],
  ['03', 'Service', 'Disassembly, cleaning, replacement of worn parts, lubrication and regulation.'],
  ['04', 'Return', 'Water-resistance testing, a final rate record and insured return.'],
]

interface FormState {
  name: string
  email: string
  phone: string
  reference: string
  service: string
  purchaseYear: string
  description: string
  consent: boolean
}

const initial: FormState = {
  name: '',
  email: '',
  phone: '',
  reference: products[0].ref,
  service: 'Full service',
  purchaseYear: '',
  description: '',
  consent: false,
}

export default function CareRepair() {
  const { pushToast } = useUI()
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<{ ref: string; service: string; name: string } | null>(null)

  useSeo({
    title: 'Care & repair',
    description:
      'Servicing, refinishing and restoration information for the fictional Aéroform collection, with a demonstration repair request form.',
    path: '/services/care-repair',
    image: '/assets/images/care-service-1600.webp',
  })

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    const em = emailError(form.email)
    if (em) next.email = em
    const ph = phoneError(form.phone, true)
    if (ph) next.phone = ph
    if (!form.description.trim() || form.description.trim().length < 20) {
      next.description = 'Please describe the piece and the issue in at least 20 characters.'
    }
    if (form.purchaseYear && !/^(19|20)\d{2}$/.test(form.purchaseYear)) {
      next.purchaseYear = 'Please enter a four-digit year.'
    }
    if (!form.consent) next.consent = 'Please confirm you understand this is a demonstration.'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      pushToast('Please check the highlighted fields.', 'error')
      return
    }
    setSubmitted({ ref: demoReference('SRV'), service: form.service, name: form.name.trim() })
  }

  return (
    <div className="care-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <Link to="/services">Services</Link>
            <span className="sep">/</span>
            <span aria-current="page">Care &amp; repair</span>
          </nav>
          <div className="care-intro">
            <RevealText as="h1" immediate>
              <Line>Care,</Line>
              <Line>
                and keeping<em>.</em>
              </Line>
            </RevealText>
            <div className="care-intro__copy">
              <p className="lede">
                A mechanical watch is a small machine that expects attention. A service every five
                to seven years keeps the rate, the finish and the water resistance true.
              </p>
              <p className="micro">Service information is mock content · the request form is not transmitted</p>
            </div>
          </div>
        </header>

        <div className="care-hero">
          <Media
            imageKey="care-service"
            alt="A watchmaker's bench with tools, a movement and a loupe under warm light"
            orientation="wide"
            ratio="cinema"
            sizes="100vw"
            priority
          />
        </div>

        <section className="section care-tiers">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow"><span className="eyebrow__num">01</span> Service levels</p>
              <h2>Three kinds of attention</h2>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.92rem' }}>
                Fees are indicative placeholders. An assessment is always required before work
                begins.
              </p>
            </div>
          </RevealSection>
          <div className="care-tiers__grid">
            {tiers.map((tier) => (
              <RevealSection key={tier.name} className="care-tier">
                <div className="care-tier__head">
                  <h3>{tier.name}</h3>
                  <span className="micro">{tier.time}</span>
                </div>
                <p className="serif care-tier__price">{tier.price}</p>
                <p>{tier.copy}</p>
              </RevealSection>
            ))}
          </div>
        </section>

        <section className="section care-process">
          <div className="care-process__grid">
            <RevealSection className="care-process__copy" stagger>
              <p className="eyebrow"><span className="eyebrow__num">02</span> The process</p>
              <h2>Four steps, recorded at every stage</h2>
              <p className="prose">
                Every service is logged against the reference, with the rate before and after and
                any parts replaced. The record follows the watch.
              </p>
              <div className="care-steps">
                {steps.map(([n, title, copy]) => (
                  <div className="care-step" key={n}>
                    <span className="care-step__num">{n}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
            <RevealSection className="care-process__media">
              <Media
                imageKey="craft-atelier"
                alt="A watchmaker at the bench in the atelier"
                orientation="wide"
                ratio="portrait"
                sizes="(min-width: 900px) 40vw, 92vw"
              />
              <p className="micro" style={{ marginTop: '0.6rem' }}>Atelier · service bench</p>
            </RevealSection>
          </div>
        </section>

        <section className="section care-form-section" id="request">
          <div className="care-form-section__grid">
            <RevealSection className="care-form-section__copy" stagger>
              <p className="eyebrow"><span className="eyebrow__num">03</span> Request an assessment</p>
              <h2>Tell us about the piece</h2>
              <p className="prose">
                This is a demonstration form. It validates what you enter and shows a confirmation,
                but nothing is sent, stored remotely or reviewed by a watchmaker.
              </p>
              <ul className="care-contacts">
                <li>
                  <Icon name="phone" size={16} />
                  <span className="micro">Client care · +44 (0)20 0000 0000 (fictional)</span>
                </li>
                <li>
                  <Icon name="mail" size={16} />
                  <span className="micro">care@maisonverane.example (fictional)</span>
                </li>
                <li>
                  <Icon name="map-pin" size={16} />
                  <span className="micro">Ateliers in Paris &amp; Geneva — by appointment</span>
                </li>
              </ul>
            </RevealSection>

            <div className="care-form">
              {submitted ? (
                <div className="form-confirm" role="status">
                  <span className="form-confirm__icon"><Icon name="check" size={22} /></span>
                  <p className="eyebrow">Demonstration request recorded</p>
                  <h3>Thank you, {submitted.name}.</h3>
                  <p>
                    Your simulated {submitted.service.toLowerCase()} request has the reference{' '}
                    <strong>{submitted.ref}</strong>. In a live maison this would be reviewed within
                    two working days.
                  </p>
                  <p className="field__hint">
                    No data was transmitted. This confirmation exists only in this browser session.
                  </p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn--outline" onClick={() => { setSubmitted(null); setForm(initial) }}>
                      <span>Start another request</span>
                    </button>
                    <Link to="/appointments" className="btn btn--outline">
                      <span>Book an appointment</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="form-grid">
                    <div className="field span-2">
                      <label className="field__label" htmlFor="cr-name">Full name <span className="req">*</span></label>
                      <input
                        id="cr-name"
                        className="input"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'cr-name-error' : undefined}
                        autoComplete="name"
                      />
                      {errors.name && <p className="field__error" id="cr-name-error">{errors.name}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="cr-email">Email <span className="req">*</span></label>
                      <input
                        id="cr-email"
                        type="email"
                        className="input"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'cr-email-error' : undefined}
                        autoComplete="email"
                      />
                      {errors.email && <p className="field__error" id="cr-email-error">{errors.email}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="cr-phone">Telephone <span className="micro">(optional)</span></label>
                      <input
                        id="cr-phone"
                        type="tel"
                        className="input"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'cr-phone-error' : undefined}
                        autoComplete="tel"
                      />
                      {errors.phone && <p className="field__error" id="cr-phone-error">{errors.phone}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="cr-ref">Reference</label>
                      <select id="cr-ref" className="select" value={form.reference} onChange={(e) => update('reference', e.target.value)}>
                        {products.map((p) => (
                          <option key={p.id} value={p.ref}>{p.ref} — {p.name}</option>
                        ))}
                        <option value="Other">Other / not listed</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="cr-service">Service</label>
                      <select id="cr-service" className="select" value={form.service} onChange={(e) => update('service', e.target.value)}>
                        {tiers.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
                        <option value="Diagnosis">Not sure — please advise</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="cr-year">Year of acquisition</label>
                      <input
                        id="cr-year"
                        className="input"
                        inputMode="numeric"
                        placeholder="e.g. 2021"
                        value={form.purchaseYear}
                        onChange={(e) => update('purchaseYear', e.target.value)}
                        aria-invalid={Boolean(errors.purchaseYear)}
                        aria-describedby={errors.purchaseYear ? 'cr-year-error' : undefined}
                      />
                      {errors.purchaseYear && <p className="field__error" id="cr-year-error">{errors.purchaseYear}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="cr-when">Preferred contact</label>
                      <select id="cr-when" className="select" defaultValue="email">
                        <option value="email">Email</option>
                        <option value="phone">Telephone</option>
                      </select>
                    </div>
                    <div className="field span-2">
                      <label className="field__label" htmlFor="cr-desc">Describe the piece and the issue <span className="req">*</span></label>
                      <textarea
                        id="cr-desc"
                        className="textarea"
                        value={form.description}
                        onChange={(e) => update('description', e.target.value)}
                        placeholder="Reference, symptoms, when it was last serviced…"
                        aria-invalid={Boolean(errors.description)}
                        aria-describedby={errors.description ? 'cr-desc-error' : 'cr-desc-hint'}
                      />
                      <p className="field__hint" id="cr-desc-hint">{form.description.length} characters · minimum 20</p>
                      {errors.description && <p className="field__error" id="cr-desc-error">{errors.description}</p>}
                    </div>
                    <div className="span-2">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => update('consent', e.target.checked)}
                          aria-invalid={Boolean(errors.consent)}
                          aria-describedby={errors.consent ? 'cr-consent-error' : undefined}
                        />
                        <span>
                          I understand this is a fictional demonstration and no request will be sent,
                          stored remotely or reviewed by a watchmaker.
                        </span>
                      </label>
                      {errors.consent && <p className="field__error" id="cr-consent-error" style={{ marginTop: 6 }}>{errors.consent}</p>}
                    </div>
                  </div>
                  <button type="submit" className="btn" style={{ marginTop: '1.5rem' }}>
                    <span>Submit demonstration request</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="section care-faq">
          <div className="care-faq__grid">
            <div>
              <p className="eyebrow">Questions</p>
              <h2>Before you send a watch</h2>
            </div>
            <Accordion
              items={[
                {
                  id: 'water',
                  title: 'Is my watch still water resistant?',
                  content: <p>Gaskets age. Water resistance is tested at every service, and we recommend an annual pressure test for watches used in water.</p>,
                },
                {
                  id: 'strap',
                  title: 'Can the bracelet be refinished?',
                  content: <p>Yes. Refinishing restores the directional brush and polished ribs. Deep scratches may remain visible as part of the watch’s history.</p>,
                },
                {
                  id: 'shipping',
                  title: 'How would I send the piece?',
                  content: <p>In a real maison, insured shipping is arranged by the boutique. This prototype does not arrange shipping or collect parcels.</p>,
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
