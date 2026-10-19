import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { useStore } from '../context/StoreContext'
import { productById, products } from '../data/products'
import { ProductCard } from '../components/primitives/ProductCard'
import { Icon } from '../components/primitives/Icon'
import { RevealSection } from '../components/primitives/RevealSection'
import { formatPrice } from '../lib/format'
import { imageSrc } from '../lib/assets'

export default function Wishlist() {
  const { wishlist, removeSaved, addToBag } = useStore()
  const saved = wishlist.map((id) => productById(id)).filter(Boolean) as typeof products

  useSeo({
    title: 'Wishlist',
    description: 'Pieces saved to your wishlist in this browser. Demonstration only.',
    path: '/wishlist',
    noindex: true,
  })

  return (
    <div className="wishlist-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Wishlist</span>
          </nav>
          <div className="wishlist-intro">
            <h1>
              Your <em>wishlist.</em>
            </h1>
            <div>
              <p className="lede">
                Pieces you have set aside. Saved locally in this browser — no account, no server and
                no notification to the maison.
              </p>
              <p className="micro" style={{ marginTop: '0.75rem' }}>
                {saved.length} {saved.length === 1 ? 'piece saved' : 'pieces saved'}
              </p>
            </div>
          </div>
        </header>

        {saved.length === 0 ? (
          <div className="empty-state">
            <p className="eyebrow">Nothing saved yet</p>
            <h2>A wishlist begins with one reference.</h2>
            <p>
              Explore the collection and use the heart on any piece to set it aside. Your selection
              will remain here on this device.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/watches" className="btn"><span>Discover the collection</span></Link>
              <Link to="/collections/aeroform" className="btn btn--outline"><span>About Aéroform</span></Link>
            </div>
          </div>
        ) : (
          <>
            <div className="wishlist-table">
              {saved.map((p) => (
                <article key={p.id} className="wishlist-row">
                  <div className="wishlist-row__media">
                    <img
                      src={imageSrc(p.images.primary.key, 480)}
                      alt={p.images.primary.alt}
                      width={480}
                      height={480}
                      loading="lazy"
                    />
                  </div>
                  <div className="wishlist-row__detail">
                    <p className="micro">{p.ref} · {p.caseSize} mm</p>
                    <h2><Link to={`/watches/${p.slug}`}>{p.name}</Link></h2>
                    <p className="small">{p.dial} · {p.strap}</p>
                    <span className="status-dot" data-availability={p.availability}>{p.availabilityLabel}</span>
                  </div>
                  <div className="wishlist-row__price tabular">{formatPrice(p.price, p.currency)}</div>
                  <div className="wishlist-row__actions">
                    <button
                      type="button"
                      className="btn btn--small"
                      onClick={() => addToBag(p, p.straps[0].id)}
                    >
                      <span>Add to bag</span>
                    </button>
                    <Link to={`/watches/${p.slug}`} className="btn btn--outline btn--small">
                      <span>View</span>
                    </Link>
                    <button type="button" className="wishlist-row__remove" onClick={() => removeSaved(p.id)} aria-label={`Remove ${p.name} from wishlist`}>
                      <Icon name="close" size={15} /> <span className="micro">Remove</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="wishlist-foot">
              <p className="field__hint">
                Demonstration only. Adding to bag or checkout does not create an order.
              </p>
              <Link to="/appointments" className="text-link">
                Discuss these pieces with a specialist <Icon name="arrow-right" size={13} />
              </Link>
            </div>
          </>
        )}

        {saved.length > 0 && (
          <section className="section wishlist-related">
            <RevealSection className="section-head">
              <div>
                <p className="eyebrow">You may also consider</p>
                <h2>Adjacent references</h2>
              </div>
              <div className="section-head__aside">
                <Link to="/watches" className="text-link">All timepieces <Icon name="arrow-right" size={13} /></Link>
              </div>
            </RevealSection>
            <div className="wishlist-related__grid">
              {products.filter((p) => !wishlist.includes(p.id)).slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
