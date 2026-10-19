import { useCallback, useRef, useState } from 'react'
import type { Product } from '../../types'
import { Media } from './Media'
import { Icon } from './Icon'
import { ProductViewer } from '../three/ProductViewer'

interface GalleryImage {
  key: string
  alt: string
  label: string
  /** Portrait sources (the lifestyle frame) keep their own width ladder. */
  orientation?: 'square' | 'portrait' | 'wide'
}

export function galleryImages(product: Product): GalleryImage[] {
  const base: GalleryImage[] = [
    { key: product.images.primary.key, alt: product.images.primary.alt, label: 'Front' },
    { key: product.images.detail.key, alt: product.images.detail.alt, label: 'Dial' },
    { key: product.images.profile.key, alt: product.images.profile.alt, label: 'Profile' },
    { key: `${product.images.primary.key}-detail`, alt: `Close detail of the ${product.name}`, label: 'Detail' },
    { key: `${product.images.primary.key}-bracelet`, alt: `Bracelet detail of the ${product.name}`, label: 'Bracelet' },
  ]
  if (product.images.lifestyle) {
    base.push({
      key: product.images.lifestyle.key,
      alt: product.images.lifestyle.alt,
      label: 'Worn',
      orientation: 'portrait',
    })
  }
  return base
}

interface ProductGalleryProps {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = galleryImages(product)
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<'photo' | 'study'>('photo')
  const touchStart = useRef<number | null>(null)
  const [zoom, setZoom] = useState(false)

  const go = useCallback(
    (next: number) => setIndex((next + images.length) % images.length),
    [images.length],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  const active = images[index]

  return (
    <div className="gallery">
      <div className="gallery__stage-col">
        <div className="gallery__mode" role="tablist" aria-label="Viewing mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'photo'}
            className={`gallery__mode-btn ${mode === 'photo' ? 'is-active' : ''}`}
            onClick={() => setMode('photo')}
          >
            Photography
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'study'}
            className={`gallery__mode-btn ${mode === 'study' ? 'is-active' : ''}`}
            onClick={() => setMode('study')}
          >
            Interactive study
          </button>
        </div>

        {mode === 'photo' ? (
          <div
            className="gallery__stage"
            tabIndex={0}
            role="group"
            aria-label={`${product.name} gallery, image ${index + 1} of ${images.length}`}
            onKeyDown={onKeyDown}
            onTouchStart={(e) => {
              touchStart.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchStart.current === null) return
              const delta = e.changedTouches[0].clientX - touchStart.current
              if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1))
              touchStart.current = null
            }}
          >
            <Media
              key={active.key}
              imageKey={active.key}
              alt={active.alt}
              orientation={active.orientation ?? 'square'}
              ratio="square"
              sizes="(min-width: 1200px) 50vw, (min-width: 768px) 60vw, 100vw"
              priority={index === 0}
              className={`gallery__image ${zoom ? 'is-zoomed' : ''}`}
            />
            <div className="gallery__stage-tools">
              <button
                type="button"
                className="gallery__tool"
                aria-pressed={zoom}
                aria-label={zoom ? 'Zoom out of photograph' : 'Zoom into photograph'}
                onClick={() => setZoom((z) => !z)}
                style={{ display: product.images.primary.key ? 'inline-flex' : 'none' }}
              >
                <Icon name="search" size={16} />
              </button>
              <span className="gallery__count tabular">
                {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
            </div>
            <div className="gallery__arrows">
              <button type="button" aria-label="Previous image" onClick={() => go(index - 1)}>
                <Icon name="arrow-left" size={18} />
              </button>
              <button type="button" aria-label="Next image" onClick={() => go(index + 1)}>
                <Icon name="arrow-right" size={18} />
              </button>
            </div>
          </div>
        ) : (
          <ProductViewer
            fallbackImageKey={product.images.primary.key}
            fallbackAlt={product.images.primary.alt}
          />
        )}
      </div>

      {mode === 'photo' && (
        <div className="gallery__rail" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${img.label} view`}
              className={`gallery__thumb ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <Media
                imageKey={img.key}
                alt=""
                orientation={img.orientation ?? 'square'}
                ratio="square"
                sizes="96px"
                decorative
              />
              <span className="gallery__thumb-label">{img.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
