import type { NavItem } from '../types'

export const primaryNav: NavItem[] = [
  {
    label: 'Collections',
    to: '/collections/aeroform',
    groups: [
      {
        title: 'The collection',
        links: [
          { label: 'Aéroform', to: '/collections/aeroform', description: 'Instruments for the open road' },
          { label: 'All timepieces', to: '/watches', description: 'Six references' },
          { label: 'Design codes', to: '/collections/aeroform#codes', description: 'Case, dial, bracelet' },
          { label: 'Interchangeable straps', to: '/collections/aeroform#straps', description: 'Six ways to wear' },
        ],
      },
      {
        title: 'Material directions',
        links: [
          { label: 'Graphite', to: '/watches?dial=Graphite' },
          { label: 'Champagne', to: '/watches?dial=Champagne' },
          { label: 'Ink blue', to: '/watches?dial=Ink+blue' },
          { label: 'Oxblood', to: '/watches?dial=Oxblood' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Chapter 01',
      title: 'Aéroform',
      copy: 'A cushion case drawn for the wrist, a dial cut like an instrument face.',
      to: '/collections/aeroform',
      cta: 'Enter the collection',
      imageKey: 'editorial-collection',
      alt: 'Aéroform on a travertine plinth in warm sunlight',
    },
  },
  {
    label: 'Timepieces',
    to: '/watches',
    groups: [
      {
        title: 'By model',
        links: [
          { label: 'Aéroform 40 Graphite', to: '/watches/aeroform-40-graphite' },
          { label: 'Aéroform 40 Champagne', to: '/watches/aeroform-40-champagne' },
          { label: 'Aéroform 38 Nocturne', to: '/watches/aeroform-38-nocturne' },
          { label: 'Aéroform GT Chronograph', to: '/watches/aeroform-gt-chronograph' },
        ],
      },
      {
        title: 'Editions',
        links: [
          { label: 'Skeleton Édition', to: '/watches/aeroform-skeleton-edition' },
          { label: 'Oxblood', to: '/watches/aeroform-40-oxblood' },
          { label: 'View all timepieces', to: '/watches' },
          { label: 'Compare materials', to: '/craftsmanship#materials' },
        ],
      },
    ],
    feature: {
      eyebrow: 'New',
      title: 'GT Chronograph',
      copy: 'Two counters, a tachymeter cut by hand, and oxblood where it matters.',
      to: '/watches/aeroform-gt-chronograph',
      cta: 'Discover the GT',
      imageKey: 'aeroform-gt',
      alt: 'Aéroform GT Chronograph',
    },
  },
  {
    label: 'Maison',
    groups: [
      {
        title: 'The house',
        links: [
          { label: 'About the maison', to: '/about' },
          { label: 'Craftsmanship', to: '/craftsmanship' },
          { label: 'Watchmaking', to: '/watchmaking' },
          { label: 'Boutiques', to: '/boutiques' },
        ],
      },
      {
        title: 'Correspondence',
        links: [
          { label: 'Book an appointment', to: '/appointments' },
          { label: 'Client care', to: '/client-care' },
          { label: 'Contact', to: '/contact' },
        ],
      },
    ],
    feature: {
      eyebrow: 'The atelier',
      title: 'Finished by hand',
      copy: 'Inside the workshop where every bevel, bridge and bracelet is completed.',
      to: '/craftsmanship',
      cta: 'Read the story',
      imageKey: 'craft-atelier',
      alt: 'A watchmaker at the bench in the MAISON VÉRANE atelier',
    },
  },
  {
    label: 'Services',
    groups: [
      {
        title: 'Personal',
        links: [
          { label: 'Personalisation', to: '/services/personalisation' },
          { label: 'Care & repair', to: '/services/care-repair' },
          { label: 'Book an appointment', to: '/appointments' },
        ],
      },
      {
        title: 'Assistance',
        links: [
          { label: 'Client care', to: '/client-care' },
          { label: 'Shipping & returns', to: '/shipping-returns' },
          { label: 'Frequently asked', to: '/faq' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Made singular',
      title: 'A dial of your own',
      copy: 'Engraving, strap pairing and caseback personalisation, prepared by the atelier.',
      to: '/services/personalisation',
      cta: 'Begin a configuration',
      imageKey: 'service-engraving',
      alt: 'An engraver working on a watch caseback',
    },
  },
]

export const footerNav = [
  {
    title: 'Client care',
    links: [
      { label: 'Care & repair', to: '/services/care-repair' },
      { label: 'Shipping & returns', to: '/shipping-returns' },
      { label: 'Client care', to: '/client-care' },
      { label: 'Frequently asked questions', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Maison',
    links: [
      { label: 'About MAISON VÉRANE', to: '/about' },
      { label: 'Craftsmanship', to: '/craftsmanship' },
      { label: 'Watchmaking', to: '/watchmaking' },
      { label: 'Boutiques', to: '/boutiques' },
      { label: 'Appointments', to: '/appointments' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Aéroform collection', to: '/collections/aeroform' },
      { label: 'All timepieces', to: '/watches' },
      { label: 'Personalisation', to: '/services/personalisation' },
      { label: 'Search', to: '/search' },
      { label: 'Demo account', to: '/account' },
      { label: 'Atelier Studio (Admin)', to: '/admin' },
    ],
  },
]

export const regions = [
  { code: 'uk', label: 'United Kingdom', currency: 'GBP' },
  { code: 'fr', label: 'France', currency: 'EUR' },
  { code: 'de', label: 'Deutschland', currency: 'EUR' },
  { code: 'jp', label: '日本', currency: 'JPY' },
  { code: 'us', label: 'United States', currency: 'USD' },
]
