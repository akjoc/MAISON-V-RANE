import { Link } from 'react-router-dom'
import { RevealSection } from '../primitives/RevealSection'
import { useStore } from '../../context/StoreContext'
import { useUI } from '../../context/UIContext'
import { productById } from '../../data/products'
import '../../styles/cartier-sections.css'
import { assetUrl } from '../../lib/assets'

interface WatchItem {
  id: string
  name: string
  spec: string
  price: string
  image: string
  productId: string
  strapId: string
  slug: string
}

const goldModels: WatchItem[] = [
  {
    id: 'gold-large',
    name: 'Aéroform 40 Gold Édition',
    spec: 'Large model, automatic movement, 40 mm, yellow gold',
    price: '£8,450',
    image: assetUrl('images/aeroform-champagne-1200.webp'),
    productId: 'af-40-ch',
    strapId: 'bracelet-steel',
    slug: 'aeroform-40-champagne',
  },
  {
    id: 'gold-medium',
    name: 'Aéroform 38 Gold Édition',
    spec: 'Medium model, automatic movement, 38 mm, yellow gold',
    price: '£7,850',
    image: assetUrl('images/aeroform-champagne-1200.webp'),
    productId: 'af-40-ch',
    strapId: 'bracelet-steel',
    slug: 'aeroform-40-champagne',
  },
]

const twoToneModels: WatchItem[] = [
  {
    id: 'twotone-large',
    name: 'Aéroform 40 Two-Tone',
    spec: 'Large model, steel and yellow gold, opaline dial',
    price: '£7,200',
    image: assetUrl('images/aeroform-champagne-1200.webp'),
    productId: 'af-40-ch',
    strapId: 'bracelet-steel',
    slug: 'aeroform-40-champagne',
  },
  {
    id: 'twotone-medium',
    name: 'Aéroform 38 Two-Tone',
    spec: 'Medium model, steel and yellow gold, opaline dial',
    price: '£6,700',
    image: assetUrl('images/aeroform-champagne-1200.webp'),
    productId: 'af-40-ch',
    strapId: 'bracelet-steel',
    slug: 'aeroform-40-champagne',
  },
]

const steelModels: WatchItem[] = [
  {
    id: 'steel-graphite',
    name: 'Aéroform 40 Graphite',
    spec: 'Large model, steel, horizontally brushed dial',
    price: '£6,450',
    image: assetUrl('images/aeroform-graphite-1200.webp'),
    productId: 'af-40-gr',
    strapId: 'bracelet-steel',
    slug: 'aeroform-40-graphite',
  },
  {
    id: 'steel-blue',
    name: 'Aéroform 38 Nocturne',
    spec: 'Medium model, steel, ink blue lacquered dial',
    price: '£5,850',
    image: assetUrl('images/aeroform-nocturne-1200.webp'),
    productId: 'af-38-nc',
    strapId: 'strap-ink-rubber',
    slug: 'aeroform-38-nocturne',
  },
  {
    id: 'steel-oxblood',
    name: 'Aéroform 40 Oxblood',
    spec: 'Large model, steel, deep oxblood sunburst dial',
    price: '£6,630',
    image: assetUrl('images/aeroform-oxblood-1200.webp'),
    productId: 'af-40-ox',
    strapId: 'strap-oxblood-calf',
    slug: 'aeroform-40-oxblood',
  },
]

export function RoadsterCollectionGrid() {
  const { addToBag } = useStore()
  const { openBag, pushToast } = useUI()

  const handleQuickAdd = (e: React.MouseEvent, item: WatchItem) => {
    e.preventDefault()
    e.stopPropagation()
    const product = productById(item.productId)
    if (product) {
      addToBag(product, item.strapId, 1)
      openBag()
      pushToast(`${item.name} added to your bag.`)
    }
  }

  return (
    <section className="rd-collection" id="collection-grid">
      <div className="container">
        <div className="rd-collection__head">
          <div className="rd-collection__title-area">
            <span className="rd-collection__eyebrow">The Collection</span>
            <h2 className="rd-collection__title">Select Your Aéroform</h2>
            <p className="rd-collection__sub">
              Available in yellow gold, two-tone steel and gold, and stainless steel with interchangeable straps.
            </p>
          </div>
          <Link to="/watches" className="btn btn--outline">
            <span>Explore all timepieces →</span>
          </Link>
        </div>

        {/* Row 1: Gold Edition (Large & Medium) */}
        <div className="rd-row-2">
          {goldModels.map((watch) => (
            <RevealSection key={watch.id} stagger>
              <Link to={`/watches/${watch.slug}`} className="rd-watch-card">
                <div className="rd-watch-card__stage">
                  <img src={watch.image} alt={watch.name} className="rd-watch-card__img" loading="lazy" />
                </div>
                <h3 className="rd-watch-card__name">{watch.name}</h3>
                <p className="rd-watch-card__spec">{watch.spec}</p>
                <span className="rd-watch-card__price">{watch.price}</span>
                <button
                  type="button"
                  className="rd-watch-card__btn"
                  onClick={(e) => handleQuickAdd(e, watch)}
                >
                  Add to bag ↗
                </button>
              </Link>
            </RevealSection>
          ))}
        </div>

        {/* Row 2: Two-Tone Edition (Large & Medium) */}
        <div className="rd-row-2">
          {twoToneModels.map((watch) => (
            <RevealSection key={watch.id} stagger>
              <Link to={`/watches/${watch.slug}`} className="rd-watch-card">
                <div className="rd-watch-card__stage">
                  <img src={watch.image} alt={watch.name} className="rd-watch-card__img" loading="lazy" />
                </div>
                <h3 className="rd-watch-card__name">{watch.name}</h3>
                <p className="rd-watch-card__spec">{watch.spec}</p>
                <span className="rd-watch-card__price">{watch.price}</span>
                <button
                  type="button"
                  className="rd-watch-card__btn"
                  onClick={(e) => handleQuickAdd(e, watch)}
                >
                  Add to bag ↗
                </button>
              </Link>
            </RevealSection>
          ))}
        </div>

        {/* Row 3: Steel Models (Graphite, Nocturne, Oxblood) */}
        <div className="rd-row-3">
          {steelModels.map((watch) => (
            <RevealSection key={watch.id} stagger>
              <Link to={`/watches/${watch.slug}`} className="rd-watch-card">
                <div className="rd-watch-card__stage">
                  <img src={watch.image} alt={watch.name} className="rd-watch-card__img" loading="lazy" />
                </div>
                <h3 className="rd-watch-card__name">{watch.name}</h3>
                <p className="rd-watch-card__spec">{watch.spec}</p>
                <span className="rd-watch-card__price">{watch.price}</span>
                <button
                  type="button"
                  className="rd-watch-card__btn"
                  onClick={(e) => handleQuickAdd(e, watch)}
                >
                  Add to bag ↗
                </button>
              </Link>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
