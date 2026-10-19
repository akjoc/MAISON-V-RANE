import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { useStore } from '../context/StoreContext'
import { productById, products } from '../data/products'
import { Media } from '../components/primitives/Media'
import { Icon } from '../components/primitives/Icon'
import { formatPrice } from '../lib/format'
import { ProductCard } from '../components/primitives/ProductCard'

export default function Cart() {
  const { cart, subtotal, removeLine, setQuantity, clearBag } = useStore()

  useSeo({
    title: 'Shopping bag',
    description: 'A demonstration shopping bag. No order will be placed and no payment is taken.',
    path: '/cart',
    noindex: true,
  })

  const suggestions = products.filter((p) => !cart.some((l) => l.productId === p.id)).slice(0, 3)

  return (
    <div className="cart-page">
      <div className="container">
        <header className="page-intro cart-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Shopping bag</span>
          </nav>
          <div className="cart-intro__row">
            <h1>Your <em>bag.</em></h1>
            <div>
              <p className="lede">
                A demonstration bag. Every piece, price and delivery term in this prototype is
                fictional, and no purchase can be completed.
              </p>
              <div className="demo-note" style={{ marginTop: '0.75rem' }}>No payment · no order</div>
            </div>
          </div>
        </header>

        {cart.length === 0 ? (
          <div className="empty-state">
            <p className="eyebrow">Your bag is empty</p>
            <h2>Nothing selected, yet.</h2>
            <p>
              The collection holds six references, each with a choice of six straps. Begin with the
              flagship or browse everything at once.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/watches" className="btn"><span>Discover timepieces</span></Link>
              <Link to="/wishlist" className="btn btn--outline"><span>View wishlist</span></Link>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-lines" aria-label="Items in your bag">
              <div className="cart-lines__head">
                <span className="micro">{cart.length} {cart.length === 1 ? 'piece' : 'pieces'}</span>
                <button type="button" className="micro" onClick={clearBag} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  Empty bag
                </button>
              </div>
              {cart.map((line) => {
                const product = productById(line.productId)
                if (!product) return null
                const strap = product.straps.find((s) => s.id === line.strapId) ?? product.straps[0]
                const unit = product.price + strap.surcharge
                return (
                  <article className="cart-line" key={line.key}>
                    <div className="cart-line__media">
                      <Media imageKey={product.images.primary.key} alt={product.images.primary.alt} orientation="square" ratio="square" sizes="(min-width: 900px) 140px, 96px" />
                    </div>
                    <div className="cart-line__detail">
                      <p className="micro">{product.ref} · {product.caseSize} mm</p>
                      <h2><Link to={`/watches/${product.slug}`}>{product.name}</Link></h2>
                      <p className="small">{strap.name} · {strap.material}</p>
                      <span className="status-dot" data-availability={product.availability}>{product.availabilityLabel}</span>
                      <p className="field__hint" style={{ marginTop: '0.4rem' }}>Demonstration item — not reserved.</p>
                    </div>
                    <div className="cart-line__qty">
                      <div className="qty">
                        <button type="button" onClick={() => setQuantity(line.key, line.quantity - 1)} aria-label={`Decrease quantity of ${product.name}`} disabled={line.quantity <= 1}>
                          <Icon name="minus" size={12} />
                        </button>
                        <input readOnly value={line.quantity} aria-label={`Quantity of ${product.name}`} />
                        <button type="button" onClick={() => setQuantity(line.key, line.quantity + 1)} aria-label={`Increase quantity of ${product.name}`} disabled={line.quantity >= 5}>
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <p className="micro">Max 5 per reference</p>
                    </div>
                    <div className="cart-line__price">
                      <span className="tabular">{formatPrice(unit * line.quantity, product.currency)}</span>
                      <span className="micro">{line.quantity > 1 ? `${formatPrice(unit, product.currency)} each` : ''}</span>
                    </div>
                    <button type="button" className="cart-line__remove" onClick={() => removeLine(line.key)} aria-label={`Remove ${product.name} from bag`}>
                      <Icon name="close" size={15} />
                    </button>
                  </article>
                )
              })}
              <div className="cart-lines__foot">
                <Link to="/watches" className="text-link">
                  <Icon name="arrow-left" size={13} /> Continue shopping
                </Link>
                <Link to="/appointments" className="text-link">
                  Book a viewing <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </section>

            <aside className="cart-summary" aria-label="Order summary">
              <h2 className="cart-summary__title">Summary</h2>
              <div className="cart-summary__rows">
                <div>
                  <span>Subtotal</span>
                  <span className="tabular">{formatPrice(subtotal)}</span>
                </div>
                <div>
                  <span>Delivery</span>
                  <span className="micro">Complimentary (mock)</span>
                </div>
                <div>
                  <span>Tax</span>
                  <span className="micro">Included (mock)</span>
                </div>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <span className="tabular">{formatPrice(subtotal)}</span>
              </div>
              <p className="field__hint">
                Demonstration only. No order will be placed, no payment taken and no watch shipped.
              </p>
              <Link to="/checkout" className="btn btn--full" style={{ marginTop: '1rem' }}>
                <span>Proceed to demonstration checkout</span>
              </Link>
              <div className="cart-summary__assist">
                <Icon name="lock" size={14} />
                <p>No card details are collected anywhere in this prototype.</p>
              </div>
              <ul className="cart-summary__notes">
                <li>Insured delivery and signature on receipt (mock)</li>
                <li>30-day returns on unworn pieces (mock)</li>
                <li>Five-year international warranty (mock)</li>
                <li>Complimentary bracelet sizing in salon</li>
              </ul>
            </aside>
          </div>
        )}

        {cart.length > 0 && suggestions.length > 0 && (
          <section className="section cart-related">
            <div className="section-head">
              <div>
                <p className="eyebrow">Consider alongside</p>
                <h2>Other references</h2>
              </div>
            </div>
            <div className="cart-related__grid">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
