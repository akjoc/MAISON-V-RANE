import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productBySlug, products } from '../data/products'
import { useSeo } from '../lib/seo'
import { formatPrice } from '../lib/format'
import { ProductGallery } from '../components/primitives/ProductGallery'
import { Accordion } from '../components/primitives/Accordion'
import { ProductCard } from '../components/primitives/ProductCard'
import { Icon } from '../components/primitives/Icon'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { useStore } from '../context/StoreContext'
import { useUI } from '../context/UIContext'
import { NotFound } from './NotFound'

export default function WatchDetail() {
  const { slug = '' } = useParams()
  const product = productBySlug(slug)
  const { addToBag, isSaved, toggleWishlist } = useStore()
  const { openBag, pushToast } = useUI()
  const [strapId, setStrapId] = useState(product?.straps[0].id ?? '')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product) setStrapId(product.straps[0].id)
    setQuantity(1)
  }, [product])

  useSeo({
    title: product ? product.name : 'Timepiece not found',
    description: product
      ? `${product.summary} A fictional ${product.family} reference, ${product.caseSize} mm, ${product.movement.toLowerCase()}.`
      : 'This reference could not be found.',
    path: `/watches/${slug}`,
    image: product ? `/assets/images/${product.images.primary.key}-1200.webp` : undefined,
    type: 'article',
  })

  if (!product) return <NotFound />

  const strap = product.straps.find((s) => s.id === strapId) ?? product.straps[0]
  const total = product.price + strap.surcharge
  const saved = isSaved(product.id)
  const related = products.filter((p) => p.id !== product.id && p.caseSize === product.caseSize).slice(0, 3)
  const recommendations = related.length >= 2 ? related : products.filter((p) => p.id !== product.id).slice(0, 3)

  const specItems = [
    {
      id: 'specification',
      title: 'Specification',
      meta: `${product.caseSize} mm`,
      content: (
        <table className="table">
          <tbody>
            {product.specs.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      id: 'delivery',
      title: 'Delivery & returns',
      meta: 'Demonstration',
      content: (
        <>
          <p>
            <strong>Mock content.</strong> In a live maison, this reference would be dispatched
            insured and signed for, with complimentary delivery within five working days. Returns
            would be accepted within 30 days of delivery, unworn and with the seals intact.
          </p>
          <p>
            This prototype does not process orders or payments. Nothing will be shipped and no
            personal data is transmitted.
          </p>
          <Link to="/shipping-returns" className="text-link" style={{ marginTop: '1rem' }}>
            Shipping &amp; returns <Icon name="arrow-right" size={13} />
          </Link>
        </>
      ),
    },
    {
      id: 'warranty',
      title: 'Warranty & care',
      meta: 'Five years',
      content: (
        <>
          <p>
            The fictional maison describes a five-year international warranty covering defects in
            materials and workmanship. Wear, accidental damage and water ingress through an open
            crown sit outside it.
          </p>
          <p>
            Service intervals of five to seven years are recommended. The {product.name} is rated to{' '}
            {product.waterResistance}.
          </p>
          <Link to="/services/care-repair" className="text-link" style={{ marginTop: '1rem' }}>
            Care &amp; repair <Icon name="arrow-right" size={13} />
          </Link>
        </>
      ),
    },
    {
      id: 'gift',
      title: 'Gift presentation',
      meta: 'Complimentary',
      content: (
        <p>
          <strong>Mock content.</strong> Each piece would be presented in a lacquered graphite case
          lined in undyed wool, with a travel pouch, a signed certificate and a hand-written card on
          request. Gift wrapping and a personal message can be prepared in the salon.
        </p>
      ),
    },
    {
      id: 'service',
      title: 'Ownership & servicing',
      meta: 'Client care',
      content: (
        <p>
          Registration in the (fictional) client register would extend the warranty and record the
          service history. Our client care team can advise on sizing, strap changes and service
          scheduling — in this prototype, through the demonstration forms only.
        </p>
      ),
    },
  ]

  return (
    <div className="pdp">
      <div className="container">
        <nav className="crumbs pdp__crumbs" aria-label="Breadcrumb">
          <Link to="/">Maison</Link>
          <span className="sep">/</span>
          <Link to="/watches">Timepieces</Link>
          <span className="sep">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp__layout">
          <div className="pdp__gallery">
            <ProductGallery product={product} />
          </div>

          <aside className="pdp__panel" aria-label="Configure and purchase">
            <div className="pdp__panel-inner">
              <div className="pdp__heading">
                <p className="micro">{product.ref} · {product.edition ?? product.movement}</p>
                <h1>{product.name}</h1>
                <p className="pdp__tagline">{product.tagline}</p>
              </div>

              <div className="pdp__price-row">
                <span className="pdp__price tabular">{formatPrice(total, product.currency)}</span>
                <span className="status-dot" data-availability={product.availability}>
                  {product.availabilityLabel}
                </span>
              </div>
              <p className="field__hint">
                Demonstration price, including {strap.surcharge > 0 ? 'the selected strap' : 'the standard bracelet'}. No
                purchase is possible.
              </p>

              {/* Reference selection */}
              <fieldset className="pdp__fieldset">
                <legend className="pdp__legend">
                  Reference <span className="pdp__legend-value">{product.dial}</span>
                </legend>
                <div className="pdp__refs" role="radiogroup" aria-label="Reference">
                  {products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/watches/${p.slug}`}
                      className={`pdp__ref ${p.id === product.id ? 'is-active' : ''}`}
                      aria-label={`${p.name}, ${p.dial}`}
                      aria-current={p.id === product.id}
                    >
                      <span className="pdp__ref-swatch" style={{ background: p.dialHex }} />
                      <span className="pdp__ref-name">{p.name.replace('Aéroform ', '')}</span>
                    </Link>
                  ))}
                </div>
              </fieldset>

              {/* Strap selection */}
              <fieldset className="pdp__fieldset">
                <legend className="pdp__legend">
                  Strap <span className="pdp__legend-value">{strap.name}</span>
                </legend>
                <div className="pdp__straps" role="radiogroup" aria-label="Strap">
                  {product.straps.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={strap.id === s.id}
                      className={`pdp__strap ${strap.id === s.id ? 'is-active' : ''}`}
                      onClick={() => setStrapId(s.id)}
                      title={s.note}
                    >
                      <span className="pdp__strap-swatch" style={{ background: s.swatch }} aria-hidden="true" />
                      <span className="pdp__strap-label">
                        <span>{s.name}</span>
                        <span className="micro">
                          {s.material}
                          {s.surcharge > 0 ? ` · +${formatPrice(s.surcharge, product.currency)}` : ' · included'}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="field__hint" style={{ marginTop: '0.6rem' }}>{strap.note}</p>
              </fieldset>

              {/* Quantity + actions */}
              <div className="pdp__buy">
                <div className="qty" aria-label="Quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    <Icon name="minus" size={13} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={quantity}
                    aria-label="Quantity"
                    onChange={(e) => {
                      const next = Number(e.target.value)
                      if (!Number.isNaN(next)) setQuantity(Math.min(5, Math.max(1, next)))
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    aria-label="Increase quantity"
                    disabled={quantity >= 5}
                  >
                    <Icon name="plus" size={13} />
                  </button>
                </div>
                <button
                  type="button"
                  className="btn pdp__add"
                  onClick={() => {
                    addToBag(product, strap.id, quantity)
                    openBag()
                  }}
                >
                  <span>Add to bag</span>
                </button>
                <button
                  type="button"
                  className={`pdp__wish ${saved ? 'is-saved' : ''}`}
                  aria-pressed={saved}
                  aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Icon name={saved ? 'heart-filled' : 'heart'} size={18} />
                  <span className="micro">{saved ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {product.availability === 'waitlist' && (
                <p className="form-status" style={{ marginTop: '0.25rem' }}>
                  <Icon name="sparkle" size={16} />
                  <span>
                    This reference is offered by waitlist. Join the (simulated) list in a salon
                    appointment; no order is created here.
                  </span>
                </p>
              )}

              <div className="pdp__assist">
                <Link to="/appointments" className="text-link">
                  Book a private viewing <Icon name="arrow-right" size={13} />
                </Link>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => pushToast('Client care is a demonstration. Use the contact form to see feedback.')}
                >
                  Ask a specialist
                </button>
              </div>

              <div className="pdp__meta">
                <div>
                  <span className="micro">Case</span>
                  <span>{product.caseMaterial}</span>
                </div>
                <div>
                  <span className="micro">Diameter</span>
                  <span>{product.caseSize} mm</span>
                </div>
                <div>
                  <span className="micro">Power reserve</span>
                  <span>{product.powerReserve}</span>
                </div>
                <div>
                  <span className="micro">Water resistance</span>
                  <span>{product.waterResistance}</span>
                </div>
              </div>

              <div className="pdp__accordion">
                <Accordion items={specItems} multiple defaultOpen={['specification']} />
              </div>
            </div>
          </aside>
        </div>

        {/* Story */}
        <section className="pdp-story">
          <RevealSection className="pdp-story__copy" stagger>
            <p className="eyebrow">The piece</p>
            <h2>{product.story[0]?.heading ?? product.tagline}</h2>
            {product.description.map((para) => (
              <p className="prose" key={para.slice(0, 24)}>
                {para}
              </p>
            ))}
          </RevealSection>
          <RevealSection className="pdp-story__media">
            <Media
              imageKey={product.images.detail.key}
              alt={product.images.detail.alt}
              orientation="square"
              ratio="square"
              sizes="(min-width: 900px) 45vw, 92vw"
            />
            <p className="micro" style={{ marginTop: '0.75rem' }}>
              Macro study · {product.dial}
            </p>
          </RevealSection>
        </section>

        <section className="pdp-quote">
          <div className="container">
            <RevealSection stagger>
              <p className="eyebrow" style={{ color: 'rgba(242,236,226,.55)' }}>From the atelier</p>
              <blockquote>
                “{product.story[1]?.body ?? product.summary}”
              </blockquote>
              <p className="micro" style={{ color: 'rgba(242,236,226,.45)' }}>
                Fictional atelier note · {product.ref}
              </p>
            </RevealSection>
          </div>
        </section>

        {/* Recommendations */}
        <section className="section pdp-related">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">Also considered</p>
              <h2>Three references to compare</h2>
            </div>
            <div className="section-head__aside">
              <Link to="/watches" className="text-link">
                All timepieces <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </RevealSection>
          <div className="pdp-related__grid">
            {recommendations.map((p) => (
              <RevealSection key={p.id}>
                <ProductCard product={p} />
              </RevealSection>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
