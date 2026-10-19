import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { useStore } from '../context/StoreContext'
import { productById } from '../data/products'
import { formatPrice } from '../lib/format'
import { Icon } from '../components/primitives/Icon'
import { Media } from '../components/primitives/Media'
import { emailError, phoneError, demoReference } from '../lib/validation'
import { writeJSON } from '../lib/storage'
import { useUI } from '../context/UIContext'

type Delivery = 'standard' | 'boutique'

interface Fields {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  postal: string
  country: string
  delivery: Delivery
  safePlace: boolean
  consent: boolean
}

const initial: Fields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  postal: '',
  country: 'United Kingdom',
  delivery: 'standard',
  safePlace: false,
  consent: false,
}

export default function Checkout() {
  const { cart, subtotal, clearBag } = useStore()
  const { pushToast } = useUI()
  const [step, setStep] = useState(1)
  const [fields, setFields] = useState<Fields>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [order, setOrder] = useState<{
    ref: string
    total: number
    email: string
    items: { key: string; name: string; strap: string; qty: number; total: number; currency: 'GBP' | 'EUR' | 'USD'; imageKey: string; imageAlt: string }[]
  } | null>(null)

  useSeo({
    title: 'Demonstration checkout',
    description: 'A clearly labelled demonstration checkout. No payment details are collected and no order is placed.',
    path: '/checkout',
    noindex: true,
  })

  const lines = useMemo(
    () =>
      cart.map((line) => {
        const product = productById(line.productId)
        const strap = product?.straps.find((s) => s.id === line.strapId)
        return { line, product, strap, unit: (product?.price ?? 0) + (strap?.surcharge ?? 0) }
      }),
    [cart],
  )

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  if (!order && cart.length === 0) {
    return (
      <div className="container checkout-page">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Checkout</span>
          </nav>
          <h1 style={{ marginTop: '1.5rem' }}>Your bag is empty.</h1>
        </header>
        <div className="empty-state">
          <p className="eyebrow">Nothing to check out</p>
          <h2>Add a reference to begin.</h2>
          <p>The checkout exists to demonstrate validation and a simulated confirmation — it is not a real shop.</p>
          <Link to="/watches" className="btn"><span>Discover timepieces</span></Link>
        </div>
      </div>
    )
  }

  const validateDetails = () => {
    const next: Record<string, string> = {}
    if (!fields.firstName.trim()) next.firstName = 'Required.'
    if (!fields.lastName.trim()) next.lastName = 'Required.'
    const em = emailError(fields.email)
    if (em) next.email = em
    const ph = phoneError(fields.phone, false)
    if (ph) next.phone = ph
    if (!fields.address1.trim()) next.address1 = 'Required.'
    if (!fields.city.trim()) next.city = 'Required.'
    if (!/[A-Za-z0-9][A-Za-z0-9\s-]{2,}/.test(fields.postal.trim())) next.postal = 'Enter a valid postal code.'
    return next
  }

  const validateReview = () => {
    const next: Record<string, string> = {}
    if (!fields.consent) next.consent = 'Please acknowledge the demonstration before continuing.'
    return next
  }

  const nextStep = () => {
    if (step === 1) {
      const next = validateDetails()
      setErrors(next)
      if (Object.keys(next).length) {
        pushToast('Please complete the delivery details.', 'error')
        return
      }
    }
    if (step === 2) {
      setStep(3)
      return
    }
    if (step === 3) {
      const next = validateReview()
      setErrors(next)
      if (Object.keys(next).length) {
        pushToast('Please acknowledge the demonstration.', 'error')
        return
      }
      const ref = demoReference('DEMO')
      const record = {
        ref,
        total: subtotal,
        email: fields.email,
        date: new Date().toISOString(),
        items: lines.map((l) => ({ name: l.product?.name, qty: l.line.quantity })),
      }
      writeJSON('mv.lastOrder', record)
      setOrder({
        ref,
        total: subtotal,
        email: fields.email,
        items: lines.map(({ line, product, strap, unit }) => ({
          key: line.key,
          name: product?.name ?? 'Reference',
          strap: strap?.name ?? '',
          qty: line.quantity,
          total: unit * line.quantity,
          currency: product?.currency ?? 'GBP',
          imageKey: product?.images.primary.key ?? 'editorial-collection',
          imageAlt: product?.images.primary.alt ?? '',
        })),
      })
      clearBag()
      pushToast('Demonstration order recorded in this browser only.', 'success')
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <header className="checkout-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <Link to="/cart">Bag</Link>
            <span className="sep">/</span>
            <span aria-current="page">Checkout</span>
          </nav>
          <div className="checkout-head__row">
            <h1>Demonstration checkout</h1>
            <span className="demo-note">Simulated · no payment · no order</span>
          </div>
        </header>

        {order ? (
          <div className="checkout-confirm">
            <span className="form-confirm__icon"><Icon name="check" size={22} /></span>
            <p className="eyebrow">Order simulated</p>
            <h2>Thank you, {fields.firstName}.</h2>
            <p>
              Your demonstration order <strong>{order.ref}</strong> has been recorded in this
              browser. No payment was taken, no confirmation email was sent and no watch will be
              dispatched.
            </p>
            <dl className="confirm-list">
              <div><dt className="micro">Reference</dt><dd>{order.ref}</dd></div>
              <div><dt className="micro">Total (placeholder)</dt><dd>{formatPrice(order.total)}</dd></div>
              <div><dt className="micro">Email (not sent)</dt><dd>{order.email}</dd></div>
              <div><dt className="micro">Delivery</dt><dd>{fields.delivery === 'boutique' ? 'Boutique collection (mock)' : 'Insured delivery (mock)'}</dd></div>
            </dl>
            <div className="checkout-confirm__receipt">
              {order.items.map((item) => (
                <div key={item.key} className="checkout-confirm__line">
                  <span>{item.name} · {item.strap} × {item.qty}</span>
                  <span className="tabular">{formatPrice(item.total, item.currency)}</span>
                </div>
              ))}
            </div>
            <p className="field__hint">Nothing was transmitted. You may close this page at any time.</p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              <Link to="/watches" className="btn"><span>Return to the collection</span></Link>
              <Link to="/account" className="btn btn--outline"><span>View demo account</span></Link>
            </div>
          </div>
        ) : (
          <div className="checkout-layout">
            <div className="checkout-main">
              <ol className="checkout-steps">
                {['Delivery details', 'Delivery method', 'Review & confirm'].map((label, i) => (
                  <li key={label} className={`checkout-step ${step === i + 1 ? 'is-current' : ''} ${step > i + 1 ? 'is-done' : ''}`}>
                    <span className="checkout-step__num">{step > i + 1 ? <Icon name="check" size={11} /> : `0${i + 1}`}</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ol>

              {step === 1 && (
                <section className="checkout-panel" aria-labelledby="step-1-title">
                  <h2 id="step-1-title">Delivery details</h2>
                  <p className="field__hint" style={{ marginBottom: '1.25rem' }}>
                    Entered for demonstration only. Nothing is stored remotely or shared.
                  </p>
                  <div className="form-grid">
                    <div className="field">
                      <label className="field__label" htmlFor="co-first">First name <span className="req">*</span></label>
                      <input id="co-first" className="input" autoComplete="given-name" value={fields.firstName} onChange={(e) => update('firstName', e.target.value)} aria-invalid={Boolean(errors.firstName)} />
                      {errors.firstName && <p className="field__error">{errors.firstName}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="co-last">Last name <span className="req">*</span></label>
                      <input id="co-last" className="input" autoComplete="family-name" value={fields.lastName} onChange={(e) => update('lastName', e.target.value)} aria-invalid={Boolean(errors.lastName)} />
                      {errors.lastName && <p className="field__error">{errors.lastName}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="co-email">Email <span className="req">*</span></label>
                      <input id="co-email" type="email" className="input" autoComplete="email" value={fields.email} onChange={(e) => update('email', e.target.value)} aria-invalid={Boolean(errors.email)} />
                      {errors.email && <p className="field__error">{errors.email}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="co-phone">Telephone <span className="req">*</span></label>
                      <input id="co-phone" type="tel" className="input" autoComplete="tel" value={fields.phone} onChange={(e) => update('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} />
                      {errors.phone && <p className="field__error">{errors.phone}</p>}
                    </div>
                    <div className="field span-2">
                      <label className="field__label" htmlFor="co-address">Address <span className="req">*</span></label>
                      <input id="co-address" className="input" autoComplete="address-line1" value={fields.address1} onChange={(e) => update('address1', e.target.value)} aria-invalid={Boolean(errors.address1)} />
                      {errors.address1 && <p className="field__error">{errors.address1}</p>}
                    </div>
                    <div className="field span-2">
                      <label className="field__label" htmlFor="co-address2">Apartment, suite <span className="micro">(optional)</span></label>
                      <input id="co-address2" className="input" autoComplete="address-line2" value={fields.address2} onChange={(e) => update('address2', e.target.value)} />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="co-city">City <span className="req">*</span></label>
                      <input id="co-city" className="input" autoComplete="address-level2" value={fields.city} onChange={(e) => update('city', e.target.value)} aria-invalid={Boolean(errors.city)} />
                      {errors.city && <p className="field__error">{errors.city}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="co-postal">Postal code <span className="req">*</span></label>
                      <input id="co-postal" className="input" autoComplete="postal-code" value={fields.postal} onChange={(e) => update('postal', e.target.value)} aria-invalid={Boolean(errors.postal)} />
                      {errors.postal && <p className="field__error">{errors.postal}</p>}
                    </div>
                    <div className="field span-2">
                      <label className="field__label" htmlFor="co-country">Country</label>
                      <select id="co-country" className="select" value={fields.country} onChange={(e) => update('country', e.target.value)}>
                        {['United Kingdom', 'France', 'Germany', 'Japan', 'United States', 'India', 'United Arab Emirates'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="checkout-panel" aria-labelledby="step-2-title">
                  <h2 id="step-2-title">Delivery method</h2>
                  <p className="field__hint" style={{ marginBottom: '1.25rem' }}>Both options are simulated.</p>
                  <div className="delivery-options" role="radiogroup" aria-label="Delivery method">
                    {[
                      { id: 'standard' as Delivery, title: 'Insured delivery', meta: 'Complimentary · 2–5 working days (mock)', copy: 'Signature on receipt, fully insured, in unmarked packaging.' },
                      { id: 'boutique' as Delivery, title: 'Collect in boutique', meta: 'Complimentary · ready in 3 working days (mock)', copy: 'Chosen salon, fitted to the wrist, with a glass of something cold.' },
                    ].map((opt) => (
                      <label key={opt.id} className={`delivery-option ${fields.delivery === opt.id ? 'is-active' : ''}`}>
                        <input type="radio" name="delivery" value={opt.id} checked={fields.delivery === opt.id} onChange={() => update('delivery', opt.id)} />
                        <span className="delivery-option__mark" aria-hidden="true" />
                        <span>
                          <span className="delivery-option__title">{opt.title}</span>
                          <span className="micro">{opt.meta}</span>
                          <span className="delivery-option__copy">{opt.copy}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <label className="checkbox" style={{ marginTop: '1.5rem' }}>
                    <input type="checkbox" checked={fields.safePlace} onChange={(e) => update('safePlace', e.target.checked)} />
                    <span>If I am out, leave the parcel with a neighbour or in a safe place (mock option).</span>
                  </label>
                </section>
              )}

              {step === 3 && (
                <section className="checkout-panel" aria-labelledby="step-3-title">
                  <h2 id="step-3-title">Review &amp; confirm</h2>
                  <div className="review-block">
                    <div>
                      <p className="micro">Deliver to</p>
                      <p className="small">
                        {fields.firstName} {fields.lastName}<br />
                        {fields.address1}{fields.address2 ? `, ${fields.address2}` : ''}<br />
                        {fields.city}, {fields.postal}<br />
                        {fields.country}
                      </p>
                    </div>
                    <div>
                      <p className="micro">Contact</p>
                      <p className="small">{fields.email}<br />{fields.phone}</p>
                      <button type="button" className="text-link" style={{ marginTop: '0.5rem', fontSize: '9px' }} onClick={() => setStep(1)}>
                        Edit details
                      </button>
                    </div>
                    <div>
                      <p className="micro">Method</p>
                      <p className="small">{fields.delivery === 'boutique' ? 'Collect in boutique (mock)' : 'Insured delivery (mock)'}</p>
                      <button type="button" className="text-link" style={{ marginTop: '0.5rem', fontSize: '9px' }} onClick={() => setStep(2)}>
                        Change method
                      </button>
                    </div>
                  </div>

                  <div className="demo-payment">
                    <div className="demo-payment__head">
                      <Icon name="lock" size={16} />
                      <p className="eyebrow eyebrow--plain">Payment — not collected</p>
                    </div>
                    <p>
                      This prototype does not accept or store payment credentials. No card fields are
                      shown, no card is charged, and the button below simply records a simulated
                      confirmation in your browser.
                    </p>
                    <div className="demo-payment__mock" aria-hidden="true">
                      <span>•••• •••• •••• ••••</span>
                      <span className="micro">DEMONSTRATION ONLY</span>
                    </div>
                  </div>

                  <label className="checkbox" style={{ marginTop: '1.25rem' }}>
                    <input type="checkbox" checked={fields.consent} onChange={(e) => update('consent', e.target.checked)} aria-invalid={Boolean(errors.consent)} />
                    <span>
                      I understand this is a design demonstration: no payment will be taken, no order
                      will be placed, and no personal data will be transmitted.
                    </span>
                  </label>
                  {errors.consent && <p className="field__error" style={{ marginTop: 6 }}>{errors.consent}</p>}
                </section>
              )}

              <div className="checkout-nav">
                {step > 1 ? (
                  <button type="button" className="text-link" onClick={() => setStep((s) => s - 1)}>
                    <Icon name="arrow-left" size={13} /> Back
                  </button>
                ) : (
                  <Link to="/cart" className="text-link"><Icon name="arrow-left" size={13} /> Back to bag</Link>
                )}
                <button type="button" className="btn" onClick={nextStep}>
                  <span>{step === 3 ? 'Place demonstration order' : 'Continue'}</span>
                </button>
              </div>
            </div>

            <aside className="checkout-summary" aria-label="Order summary">
              <h2 className="cart-summary__title">Your order</h2>
              <div className="checkout-summary__lines">
                {lines.map(({ line, product, strap, unit }) =>
                  product ? (
                    <div key={line.key} className="checkout-summary__line">
                      <div className="checkout-summary__thumb">
                        <Media imageKey={product.images.primary.key} alt={product.images.primary.alt} orientation="square" ratio="square" sizes="72px" />
                      </div>
                      <div>
                        <p className="small" style={{ color: 'var(--ink)' }}>{product.name}</p>
                        <p className="micro">{strap?.name} · ×{line.quantity}</p>
                      </div>
                      <span className="tabular small">{formatPrice(unit * line.quantity, product.currency)}</span>
                    </div>
                  ) : null,
                )}
              </div>
              <div className="cart-summary__rows">
                <div><span>Subtotal</span><span className="tabular">{formatPrice(subtotal)}</span></div>
                <div><span>Delivery</span><span className="micro">Complimentary (mock)</span></div>
              </div>
              <div className="cart-summary__total"><span>Total</span><span className="tabular">{formatPrice(subtotal)}</span></div>
              <p className="field__hint">Prices are demonstration placeholders, not offers.</p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
