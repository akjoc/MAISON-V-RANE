/** Shared domain types for the MAISON VÉRANE prototype. */

export type Availability = 'in-boutique' | 'made-to-order' | 'waitlist' | 'archived'

export type MovementType = 'Automatic' | 'Hand-wound' | 'Automatic chronograph'

export interface StrapOption {
  id: string
  name: string
  material: 'Steel' | 'Alligator' | 'Calfskin' | 'Rubber' | 'Textile'
  colour: string
  swatch: string
  surcharge: number
  note: string
}

export interface SpecRow {
  label: string
  value: string
}

export interface ProductImage {
  /** Base filename in /assets/images without size suffix or extension. */
  key: string
  alt: string
  /** Fractional focal point used for art-directed crops. */
  focal?: [number, number]
}

export interface Product {
  id: string
  slug: string
  ref: string
  name: string
  family: string
  collection: 'aeroform'
  tagline: string
  summary: string
  description: string[]
  price: number
  currency: 'GBP' | 'EUR' | 'USD'
  availability: Availability
  availabilityLabel: string
  edition?: string
  dial: string
  dialHex: string
  material: string
  materialTags: string[]
  caseSize: number
  movement: MovementType
  caseMaterial: string
  strap: string
  strapType: StrapOption['material']
  glass: string
  waterResistance: string
  powerReserve: string
  frequency: string
  jewels: number
  images: {
    primary: ProductImage
    detail: ProductImage
    profile: ProductImage
    lifestyle?: ProductImage
  }
  straps: StrapOption[]
  specs: SpecRow[]
  story: { heading: string; body: string }[]
  featured?: boolean
  accent: string
}

export interface Boutique {
  id: string
  city: string
  region: string
  country: string
  name: string
  type: 'Maison' | 'Salon' | 'Atelier'
  addressLine: string
  note: string
  hours: string
  services: string[]
  coordinates: { x: number; y: number }
}

export interface NavLink {
  label: string
  to: string
  description?: string
}

export interface NavGroup {
  title: string
  links: NavLink[]
}

export interface NavItem {
  label: string
  to?: string
  groups?: NavGroup[]
  feature?: {
    eyebrow: string
    title: string
    copy: string
    to: string
    cta: string
    imageKey: string
    alt: string
  }
}

export interface EditorialChapter {
  id: string
  index: string
  eyebrow: string
  title: string
  body: string
  imageKey: string
  alt: string
  meta?: string
}

export interface BasketLine {
  productId: string
  strapId: string
  quantity: number
}

export interface CartLine extends BasketLine {
  key: string
}
