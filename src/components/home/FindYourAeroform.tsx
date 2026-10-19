import { lazy, Suspense, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { useStore } from '../../context/StoreContext'
import { productById } from '../../data/products'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { hasWebGL, type ViewerMaterial } from '../three/viewerSupport'
import '../../styles/find-your-aeroform.css'

const FindYourAeroformCanvas = lazy(() => import('./FindYourAeroformCanvas'))

interface MaterialConfig {
  id: string
  label: string
  swatchClass: string
  caseColor: string
  dialColor: string
  strapColor: string
  metalness: number
  roughness: number
  basePrice: number
  slug: string
  image: string
}

const MATERIALS: MaterialConfig[] = [
  {
    id: 'gold',
    label: 'Gold',
    swatchClass: 'fya-swatch--gold',
    caseColor: '#d4af37',
    dialColor: '#f1dfaf',
    strapColor: '#d4af37',
    metalness: 0.92,
    roughness: 0.28,
    basePrice: 8450,
    slug: 'aeroform-40-champagne',
    image: '/assets/images/aeroform-champagne-1200.webp',
  },
  {
    id: 'twotone',
    label: 'Two-Tone',
    swatchClass: 'fya-swatch--twotone',
    caseColor: '#c8ae77',
    dialColor: '#edeae1',
    strapColor: '#b9b6af',
    metalness: 0.94,
    roughness: 0.3,
    basePrice: 7200,
    slug: 'aeroform-40-champagne',
    image: '/assets/images/aeroform-champagne-1200.webp',
  },
  {
    id: 'steel',
    label: 'Steel',
    swatchClass: 'fya-swatch--steel',
    caseColor: '#b9b7ae',
    dialColor: '#3c3a36',
    strapColor: '#a8a69d',
    metalness: 0.95,
    roughness: 0.32,
    basePrice: 6450,
    slug: 'aeroform-40-graphite',
    image: '/assets/images/aeroform-graphite-1200.webp',
  },
  {
    id: 'blue',
    label: 'ADLC Blue',
    swatchClass: 'fya-swatch--blue',
    caseColor: '#252b36',
    dialColor: '#17273d',
    strapColor: '#1d232e',
    metalness: 0.84,
    roughness: 0.44,
    basePrice: 6850,
    slug: 'aeroform-38-nocturne',
    image: '/assets/images/aeroform-nocturne-1200.webp',
  },
  {
    id: 'oxblood',
    label: 'Oxblood',
    swatchClass: 'fya-swatch--oxblood',
    caseColor: '#b9b7ae',
    dialColor: '#5e1a1f',
    strapColor: '#421417',
    metalness: 0.88,
    roughness: 0.36,
    basePrice: 6630,
    slug: 'aeroform-40-oxblood',
    image: '/assets/images/aeroform-oxblood-1200.webp',
  },
]

interface StrapConfig {
  id: string
  label: string
  swatchClass: string
  strapId: string
  surcharge: number
  overrideColor?: string
}

const STRAPS: StrapConfig[] = [
  {
    id: 'bracelet',
    label: 'Gold / Matching Metal',
    swatchClass: 'fya-swatch--strap-bracelet',
    strapId: 'bracelet-steel',
    surcharge: 0,
  },
  {
    id: 'leather',
    label: 'Leather',
    swatchClass: 'fya-swatch--strap-leather',
    strapId: 'strap-oxblood-calf',
    surcharge: 180,
    overrideColor: '#35241b',
  },
  {
    id: 'rubber',
    label: 'Rubber',
    swatchClass: 'fya-swatch--strap-rubber',
    strapId: 'strap-ink-rubber',
    surcharge: 120,
    overrideColor: '#1a1c20',
  },
]

export function FindYourAeroform() {
  const [selectedSize, setSelectedSize] = useState<'large' | 'medium'>('large')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialConfig>(MATERIALS[0])
  const [selectedStrap, setSelectedStrap] = useState<StrapConfig>(STRAPS[0])
  const [webglSupported] = useState(() => (typeof window !== 'undefined' ? hasWebGL() : false))

  const { addToBag } = useStore()
  const { openBag, pushToast } = useUI()
  const reduced = useReducedMotion()

  // Calculate pricing
  const totalPrice = useMemo(() => {
    const sizeMultiplier = selectedSize === 'large' ? 1 : 0.92
    return Math.round(selectedMaterial.basePrice * sizeMultiplier + selectedStrap.surcharge)
  }, [selectedSize, selectedMaterial, selectedStrap])

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(totalPrice)
  }, [totalPrice])

  // Derive active 3D material
  const active3DMaterial: ViewerMaterial = useMemo(() => {
    return {
      id: selectedMaterial.id,
      label: selectedMaterial.label,
      caseColor: selectedMaterial.caseColor,
      dialColor: selectedMaterial.dialColor,
      strapColor: selectedStrap.overrideColor || selectedMaterial.strapColor,
      metalness: selectedMaterial.metalness,
      roughness: selectedMaterial.roughness,
    }
  }, [selectedMaterial, selectedStrap])

  const sizeScale = selectedSize === 'large' ? 1.05 : 0.94

  const handlePurchase = () => {
    // Map to relevant project product ID
    let productId = 'af-40-ch'
    if (selectedMaterial.id === 'steel') productId = 'af-40-gr'
    else if (selectedMaterial.id === 'blue') productId = 'af-38-nc'
    else if (selectedMaterial.id === 'oxblood') productId = 'af-40-ox'

    const targetProduct = productById(productId)
    if (targetProduct) {
      addToBag(targetProduct, selectedStrap.strapId, 1)
      openBag()
      pushToast(
        `Aéroform ${selectedSize === 'large' ? '40' : '38'} ${selectedMaterial.label} (${selectedStrap.label}) added to your bag.`,
      )
    }
  }

  return (
    <section className="fya-section" id="find-your-aeroform">
      <div className="container">
        {/* Header matching Cartier's top title and Shop button */}
        <div className="fya-header">
          <h2 className="fya-header__title">Find your Aéroform</h2>
          <Link to="/watches" className="fya-header__shop-btn">
            Shop
          </Link>
        </div>

        {/* 2-Column interactive grid */}
        <div className="fya-grid">
          {/* Left Column: 3D Visualizer with horizon line */}
          <div className="fya-stage">
            <div className="fya-stage__horizon" />

            {webglSupported ? (
              <div className="fya-stage__canvas-wrap">
                <Suspense
                  fallback={
                    <div className="fya-stage__fallback">
                      <img src={selectedMaterial.image} alt={selectedMaterial.label} />
                      <div className="fya-stage__loading-pill">Loading</div>
                    </div>
                  }
                >
                  <FindYourAeroformCanvas
                    material={active3DMaterial}
                    sizeScale={sizeScale}
                    autoRotate={true}
                    reducedMotion={reduced}
                  />
                </Suspense>
              </div>
            ) : (
              <div className="fya-stage__fallback">
                <img src={selectedMaterial.image} alt={selectedMaterial.label} />
              </div>
            )}

            <div className="fya-stage__badge">Drag to rotate 360° · Real-time 3D</div>
          </div>

          {/* Right Column: Configurator Selectors */}
          <div className="fya-config">
            {/* 1. Size selection */}
            <div className="fya-group">
              <p className="fya-group__label">Size:</p>
              <div className="fya-sizes">
                <button
                  type="button"
                  className={`fya-size-btn ${selectedSize === 'large' ? 'is-active' : ''}`}
                  onClick={() => setSelectedSize('large')}
                >
                  Large
                </button>
                <button
                  type="button"
                  className={`fya-size-btn ${selectedSize === 'medium' ? 'is-active' : ''}`}
                  onClick={() => setSelectedSize('medium')}
                >
                  Medium
                </button>
              </div>
            </div>

            {/* 2. Material selection */}
            <div className="fya-group">
              <p className="fya-group__label">
                Material: <strong>{selectedMaterial.label}</strong>
              </p>
              <div className="fya-swatches" role="radiogroup" aria-label="Watch material">
                {MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedMaterial.id === m.id}
                    className={`fya-swatch ${selectedMaterial.id === m.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedMaterial(m)}
                    title={m.label}
                  >
                    <span className={`fya-swatch__inner ${m.swatchClass}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Bracelet selection */}
            <div className="fya-group">
              <p className="fya-group__label">
                Bracelet: <strong>{selectedStrap.label}</strong>
              </p>
              <div className="fya-swatches" role="radiogroup" aria-label="Watch bracelet">
                {STRAPS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedStrap.id === s.id}
                    className={`fya-swatch ${selectedStrap.id === s.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedStrap(s)}
                    title={s.label}
                  >
                    <span className={`fya-swatch__inner ${s.swatchClass}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Action button & Cartier Reassurance note */}
            <div className="fya-action">
              <button type="button" className="fya-purchase-btn" onClick={handlePurchase}>
                {formattedPrice} — Purchase
              </button>
              <p className="fya-reassurance">
                The {selectedMaterial.label.toLowerCase()} bracelet and interchangeable leather strap
                are both included with your purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
