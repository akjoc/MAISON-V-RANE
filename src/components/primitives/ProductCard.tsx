import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { Media } from './Media'
import { Icon } from './Icon'
import { formatPrice } from '../../lib/format'
import { useStore } from '../../context/StoreContext'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
  priority?: boolean
  showQuickAdd?: boolean
}

export function ProductCard({ product, variant = 'grid', priority = false, showQuickAdd = true }: ProductCardProps) {
  const { isSaved, toggleWishlist, addToBag } = useStore()
  const saved = isSaved(product.id)
  const flag =
    product.availability === 'waitlist'
      ? 'Waitlist'
      : product.edition?.includes('120')
        ? 'Limited'
        : product.availability === 'made-to-order'
          ? 'Made to order'
          : null

  return (
    <article className={`pcard ${variant === 'list' ? 'pcard--list' : ''}`}>
      <div className="pcard__media">
        <div className="pcard__flags">
          {flag && <span className="pflag">{flag}</span>}
          {product.featured && variant === 'grid' && <span className="pflag pflag--oxblood">Collection</span>}
        </div>
        <button
          type="button"
          className={`pcard__save ${saved ? 'is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => toggleWishlist(product.id)}
        >
          <Icon name={saved ? 'heart-filled' : 'heart'} size={17} />
        </button>
        <Media
          imageKey={product.images.primary.key}
          alt={product.images.primary.alt}
          orientation="square"
          sizes={variant === 'list' ? '(min-width: 900px) 34vw, 100vw' : '(min-width: 1200px) 24vw, (min-width: 700px) 45vw, 92vw'}
          priority={priority}
          zoomOnHover
        />
        {showQuickAdd && variant === 'grid' && (
          <div className="pcard__quick">
            <button
              type="button"
              className="btn btn--light btn--full"
              onClick={() => addToBag(product, product.straps[0].id)}
            >
              <span>Add to bag · {formatPrice(product.price, product.currency)}</span>
            </button>
          </div>
        )}
      </div>
      <div className="pcard__body">
        <div className="pcard__meta">
          <span>{product.ref}</span>
          <span>{product.caseSize} mm</span>
        </div>
        <h3 className="pcard__name">
          <Link to={`/watches/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="pcard__tagline">{product.tagline}</p>
        <div className="pcard__foot">
          <span className="pcard__price">{formatPrice(product.price, product.currency)}</span>
          <span className="pcard__avail" data-availability={product.availability}>
            {product.availabilityLabel.split('·')[0].trim()}
          </span>
        </div>
      </div>
    </article>
  )
}
