import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useStore } from '../../context/StoreContext'
import { useUI } from '../../context/UIContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { Icon } from '../primitives/Icon'
import { Media } from '../primitives/Media'
import { formatPrice } from '../../lib/format'
import { productById } from '../../data/products'

/** A quick-view bag drawer that mirrors the cart page state. */
export function BagDrawer() {
  const { bagOpen, closeBag } = useUI()
  const { cart, subtotal, removeLine, setQuantity } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, bagOpen, closeBag)

  if (!bagOpen) return null

  return createPortal(
    <>
      <div className="overlay" onClick={closeBag} aria-hidden="true" />
      <aside
        className="drawer"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="drawer__head">
          <span className="drawer__title">Your bag · {cart.length} {cart.length === 1 ? 'piece' : 'pieces'}</span>
          <button type="button" className="icon-btn" onClick={closeBag} aria-label="Close bag">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="drawer__body">
          {cart.length === 0 ? (
            <div className="empty-state" style={{ paddingTop: '2rem' }}>
              <p className="eyebrow">Your bag is empty</p>
              <p>
                Every piece is a demonstration. Explore the collection and add a reference to see how
                the interface responds.
              </p>
              <Link className="btn btn--outline" to="/watches" onClick={closeBag}>
                <span>Discover timepieces</span>
              </Link>
            </div>
          ) : (
            <ul style={{ display: 'grid', gap: '1.25rem' }}>
              {cart.map((line) => {
                const product = productById(line.productId)
                if (!product) return null
                const strap = product.straps.find((s) => s.id === line.strapId)
                return (
                  <li
                    key={line.key}
                    style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--hairline-soft)' }}
                  >
                    <Media imageKey={product.images.primary.key} alt={product.images.primary.alt} orientation="square" ratio="square" sizes="88px" />
                    <div style={{ display: 'grid', gap: '0.25rem', alignContent: 'start' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                        <Link to={`/watches/${product.slug}`} onClick={closeBag} style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', lineHeight: 1.2 }}>
                          {product.name}
                        </Link>
                        <span className="tabular" style={{ fontSize: '0.85rem' }}>{formatPrice(product.price + (strap?.surcharge ?? 0), product.currency)}</span>
                      </div>
                      <span className="small" style={{ fontSize: '0.75rem' }}>{strap?.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                        <div className="qty" style={{ height: 32 }}>
                          <button type="button" onClick={() => setQuantity(line.key, line.quantity - 1)} aria-label={`Decrease quantity of ${product.name}`} disabled={line.quantity <= 1}>
                            <Icon name="minus" size={12} />
                          </button>
                          <input readOnly aria-label={`Quantity of ${product.name}`} value={line.quantity} />
                          <button type="button" onClick={() => setQuantity(line.key, line.quantity + 1)} aria-label={`Increase quantity of ${product.name}`} disabled={line.quantity >= 5}>
                            <Icon name="plus" size={12} />
                          </button>
                        </div>
                        <button type="button" className="micro" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }} onClick={() => removeLine(line.key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer__foot">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span className="tabular">{formatPrice(subtotal)}</span>
            </div>
            <p className="field__hint" style={{ marginBottom: '1rem' }}>
              Demonstration only — no order will be placed.
            </p>
            <Link to="/checkout" className="btn btn--full" onClick={closeBag}>
              <span>Proceed to demonstration checkout</span>
            </Link>
            <div style={{ textAlign: 'center', marginTop: '0.9rem' }}>
              <Link to="/cart" className="text-link" onClick={closeBag}>
                View full bag
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>,
    document.body,
  )
}
