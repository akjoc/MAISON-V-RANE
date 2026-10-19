import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { products } from '../data/products'
import { ProductCard } from '../components/primitives/ProductCard'
import { FilterDrawer } from '../components/primitives/FilterDrawer'
import { FilterPanel, type Facet } from '../components/primitives/FilterPanel'
import { SortMenu, type SortOption } from '../components/primitives/SortMenu'
import { Icon } from '../components/primitives/Icon'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import type { Product } from '../types'

const DIAL_FAMILY: Record<string, string> = {
  'af-40-gr': 'Graphite',
  'af-40-ch': 'Champagne',
  'af-38-nc': 'Ink blue',
  'af-42-gt': 'Silver-white',
  'af-40-sk': 'Openworked',
  'af-40-ox': 'Oxblood',
}

const FACET_ORDER = ['dial', 'material', 'size', 'movement', 'strap', 'availability'] as const
const FACET_TITLES: Record<(typeof FACET_ORDER)[number], string> = {
  dial: 'Dial',
  material: 'Materials in the piece',
  size: 'Case size',
  movement: 'Movement',
  strap: 'Strap',
  availability: 'Availability',
}

const SORTS: SortOption[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price · low to high' },
  { id: 'price-desc', label: 'Price · high to low' },
  { id: 'size-asc', label: 'Case size · small to large' },
]

const AVAILABILITY_LABEL: Record<string, string> = {
  'in-boutique': 'In boutique',
  'made-to-order': 'Made to order',
  waitlist: 'Waitlist',
}

function facetValue(product: Product, facet: string): string {
  switch (facet) {
    case 'dial':
      return DIAL_FAMILY[product.id] ?? product.dial
    case 'material':
      return product.materialTags[0]
    case 'size':
      return `${product.caseSize} mm`
    case 'movement':
      return product.movement
    case 'strap':
      return product.strapType
    case 'availability':
      return product.availability
    default:
      return ''
  }
}

function buildFacets(active: Record<string, string[]>, ignore?: string): Facet[] {
  const facets: Facet[] = []
  for (const id of FACET_ORDER) {
    const otherFilters = Object.entries(active).filter(([key]) => key !== id && key !== ignore)
    const pool = products.filter((p) =>
      otherFilters.every(([key, values]) => values.length === 0 || values.includes(facetValue(p, key))),
    )
    let optionValues: string[]
    if (id === 'material') {
      optionValues = Array.from(new Set(products.flatMap((p) => p.materialTags)))
    } else {
      optionValues = Array.from(new Set(products.map((p) => facetValue(p, id))))
    }
    const options = optionValues
      .map((value) => ({
        value,
        label: id === 'availability' ? (AVAILABILITY_LABEL[value] ?? value) : value,
        count: pool.filter((p) =>
          id === 'material'
            ? p.materialTags.includes(value)
            : facetValue(p, id) === value,
        ).length,
      }))
      .sort((a, b) => {
        if (id === 'size') return parseInt(a.value, 10) - parseInt(b.value, 10)
        return a.label.localeCompare(b.label)
      })
    facets.push({ id, title: FACET_TITLES[id], options })
  }
  return facets
}

const PAGE_SIZE = 4

export default function Watches() {
  const [params, setParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)

  useSeo({
    title: 'All timepieces',
    description:
      'Browse all six Aéroform references. Filter by dial, material, case size, movement, strap and availability. A fictional demonstration catalogue.',
    path: '/watches',
    image: '/assets/images/aeroform-graphite-1200.webp',
  })

  const selected = useMemo<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    for (const id of FACET_ORDER) {
      const raw = params.get(id)
      if (raw) initial[id] = raw.split(',').filter(Boolean)
    }
    return initial
  }, [params])

  const sort = params.get('sort') ?? 'featured'
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const activeCount = Object.values(selected).reduce((n, values) => n + values.length, 0)

  const update = (next: Record<string, string[]>, nextSort = sort, nextView = view) => {
    const p = new URLSearchParams()
    for (const [key, values] of Object.entries(next)) {
      if (values.length > 0) p.set(key, values.join(','))
    }
    if (nextSort !== 'featured') p.set('sort', nextSort)
    if (nextView !== 'grid') p.set('view', nextView)
    setParams(p, { replace: true })
    setVisible(PAGE_SIZE)
  }

  const toggleFilter = (facetId: string, value: string) => {
    const current = selected[facetId] ?? []
    const nextValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    update({ ...selected, [facetId]: nextValues })
  }

  const clearFacet = (facetId: string) => {
    const next = { ...selected }
    delete next[facetId]
    update(next)
  }

  const clearAll = () => {
    update({})
  }

  const filtered = useMemo(() => {
    const result = products.filter((p) =>
      Object.entries(selected).every(([id, values]) => {
        if (values.length === 0) return true
        if (id === 'material') return values.some((v) => p.materialTags.includes(v))
        return values.includes(facetValue(p, id))
      }),
    )
    const sorted = [...result]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'size-asc':
        sorted.sort((a, b) => a.caseSize - b.caseSize)
        break
      default:
        break
    }
    return sorted
  }, [selected, sort])

  const facets = useMemo(() => buildFacets(selected), [selected])

  useEffect(() => {
    if (visible > filtered.length) setVisible(PAGE_SIZE)
  }, [filtered.length, visible])

  const shown = filtered.slice(0, visible)
  const chips = Object.entries(selected).flatMap(([facetId, values]) =>
    values.map((value) => ({
      facetId,
      value,
      label:
        facetId === 'availability'
          ? (AVAILABILITY_LABEL[value] ?? value)
          : `${FACET_TITLES[facetId as keyof typeof FACET_TITLES]}: ${value}`,
    })),
  )

  return (
    <div className="watches-page">
      <div className="container">
        <header className="page-intro">
          <div className="page-intro__top">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Maison</Link>
              <span className="sep">/</span>
              <span>Aéroform</span>
              <span className="sep">/</span>
              <span aria-current="page">Timepieces</span>
            </nav>
            <span className="demo-note">Demonstration catalogue</span>
          </div>
          <div className="watches-intro__grid">
            <RevealText as="h1" immediate>
              <Line>The</Line>
              <Line>timepieces.</Line>
            </RevealText>
            <div className="watches-intro__copy">
              <p className="lede">
                Six references, one case architecture. Each is finished by hand in the atelier and
                can be paired with any strap from the archive.
              </p>
              <div className="watches-intro__meta">
                <span className="micro">{products.length} references</span>
                <span className="micro">Calibre MV·01 / MV·02 / MV·03</span>
                <span className="micro">All prices demonstration</span>
              </div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="catalogue-bar">
          <div className="catalogue-bar__left">
            <button type="button" className="catalogue-bar__filter" onClick={() => setDrawerOpen(true)}>
              <Icon name="filter" size={15} />
              <span>Filter{activeCount > 0 ? ` (${activeCount})` : ''}</span>
            </button>
            <p className="catalogue-bar__count" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'reference' : 'references'}
              {activeCount > 0 ? ' matching' : ' available'}
            </p>
          </div>
          <div className="catalogue-bar__right">
            <SortMenu
              options={SORTS}
              value={sort}
              onChange={(id) => update(selected, id, view)}
            />
            <div className="toggle-group" role="group" aria-label="View as">
              <button
                type="button"
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                onClick={() => update(selected, sort, 'grid')}
              >
                <Icon name="grid" size={15} />
              </button>
              <button
                type="button"
                aria-pressed={view === 'list'}
                aria-label="List view"
                onClick={() => update(selected, sort, 'list')}
              >
                <Icon name="list" size={15} />
              </button>
            </div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            <div className="chips">
              {chips.map((chip) => (
                <span className="chip chip--active" key={`${chip.facetId}-${chip.value}`}>
                  {chip.label}
                  <button
                    type="button"
                    aria-label={`Remove filter ${chip.label}`}
                    onClick={() => toggleFilter(chip.facetId, chip.value)}
                    className="x"
                  >
                    <Icon name="close" size={12} />
                  </button>
                </span>
              ))}
            </div>
            <button type="button" className="text-link" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="empty-state" role="status">
            <p className="eyebrow">No references</p>
            <h2>Nothing matches this combination.</h2>
            <p>
              The collection holds six references. Try removing a filter, or view the complete
              collection to begin again.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={clearAll}>
                <span>Clear filters</span>
              </button>
              <Link to="/appointments" className="btn btn--outline">
                <span>Ask a specialist</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className={`catalogue ${view === 'list' ? 'catalogue--list' : ''}`}>
              {shown.map((product, i) => (
                <RevealSection key={product.id} className="catalogue__item">
                  <ProductCard
                    product={product}
                    variant={view}
                    priority={i < 2}
                    showQuickAdd={view === 'grid'}
                  />
                </RevealSection>
              ))}
            </div>

            <div className="load-more">
              <p className="load-more__count">
                Showing {shown.length} of {filtered.length}
              </p>
              {visible < filtered.length ? (
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                >
                  <span>Load more references</span>
                </button>
              ) : (
                <p className="micro">All matching references shown</p>
              )}
              <div className="load-more__bar" aria-hidden="true">
                <span style={{ width: `${(shown.length / filtered.length) * 100}%` }} />
              </div>
            </div>
          </>
        )}

        {/* Collection note */}
        <section className="watches-note">
          <RevealSection className="watches-note__inner" stagger>
            <p className="eyebrow">Not certain which reference?</p>
            <h2>A specialist can bring the collection to you.</h2>
            <p className="prose">
              Book a salon appointment or a video consultation. We will set out several references
              and discuss proportion, strap and movement without any obligation.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/appointments" className="btn">
                <span>Book an appointment</span>
              </Link>
              <Link to="/contact" className="btn btn--outline">
                <span>Write to the maison</span>
              </Link>
            </div>
          </RevealSection>
        </section>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onClear={clearAll}
        activeCount={activeCount}
        resultCount={filtered.length}
      >
        <FilterPanel
          facets={facets}
          selected={selected}
          onToggle={toggleFilter}
          onClearFacet={clearFacet}
        />
      </FilterDrawer>
    </div>
  )
}
