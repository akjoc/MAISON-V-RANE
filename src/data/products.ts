import type { Product, StrapOption } from '../types'

/**
 * All products, references, prices and availability in this prototype are
 * fictional demonstration content. Nothing is for sale.
 */

const steel: StrapOption = {
  id: 'bracelet-steel',
  name: 'Integrated H-link bracelet',
  material: 'Steel',
  colour: 'Brushed steel',
  swatch: 'linear-gradient(135deg,#d9d8d2,#9c9a92 45%,#c9c7bf 70%,#8d8b84)',
  surcharge: 0,
  note: 'Brushed links with a polished centre rib. Sized to the wrist at the atelier.',
}

const graphiteAlligator: StrapOption = {
  id: 'strap-graphite-alligator',
  name: 'Graphite alligator',
  material: 'Alligator',
  colour: 'Graphite',
  swatch: '#3a3936',
  surcharge: 320,
  note: 'Square-scale alligator, hand-stitched ivory thread, steel pin buckle.',
}

const oxbloodCalf: StrapOption = {
  id: 'strap-oxblood-calf',
  name: 'Oxblood calfskin',
  material: 'Calfskin',
  colour: 'Oxblood',
  swatch: '#5e1a1f',
  surcharge: 180,
  note: 'Vegetable-tanned calf with a soft matte finish and tone-on-tone stitching.',
}

const champagneCalf: StrapOption = {
  id: 'strap-champagne-calf',
  name: 'Champagne calfskin',
  material: 'Calfskin',
  colour: 'Champagne',
  swatch: '#c3a878',
  surcharge: 180,
  note: 'Warm calf skin, edge-painted in graphite, with a steel ardillon buckle.',
}

const inkRubber: StrapOption = {
  id: 'strap-ink-rubber',
  name: 'Ink rubber',
  material: 'Rubber',
  colour: 'Ink',
  swatch: '#24262b',
  surcharge: 120,
  note: 'Vulcanised rubber with a fine embossed tread borrowed from historic road tyres.',
}

const ivoryTextile: StrapOption = {
  id: 'strap-ivory-textile',
  name: 'Ivory technical textile',
  material: 'Textile',
  colour: 'Ivory',
  swatch: '#ded5c4',
  surcharge: 140,
  note: 'Woven high-tenacity textile, quick-release spring bars, graphite keeper.',
}

const allStraps: StrapOption[] = [
  steel,
  graphiteAlligator,
  oxbloodCalf,
  champagneCalf,
  inkRubber,
  ivoryTextile,
]

export const products: Product[] = [
  {
    id: 'af-40-gr',
    slug: 'aeroform-40-graphite',
    ref: 'AF·40·GR',
    name: 'Aéroform 40 Graphite',
    family: 'Aéroform',
    collection: 'aeroform',
    tagline: 'The reference instrument',
    summary:
      'A 40 mm cushion case with a horizontally brushed graphite dial, drawn from the instrumentation of mid-century grand tourers.',
    description: [
      'The Aéroform 40 Graphite is the founding model of the collection. Its case is machined from a single block of stainless steel, then brushed in one continuous direction so the grain runs from lug to lug, uninterrupted.',
      'The dial is cut from brass, hand-brushed in a single horizontal pass and galvanically coloured to a deep graphite. Two snailed subdials sit slightly below the surface, holding running seconds and a 24-hour indicator.',
    ],
    price: 6450,
    currency: 'GBP',
    availability: 'in-boutique',
    availabilityLabel: 'Available in boutique',
    dial: 'Horizontally brushed graphite',
    dialHex: '#3c3a36',
    material: 'Brushed stainless steel',
    materialTags: ['Stainless steel', 'Rhodium'],
    caseSize: 40,
    movement: 'Automatic',
    caseMaterial: 'Stainless steel 316L',
    strap: 'Integrated H-link bracelet',
    strapType: 'Steel',
    glass: 'Domed sapphire, double anti-reflective coating',
    waterResistance: '10 bar (100 m)',
    powerReserve: '72 hours',
    frequency: '28,800 vph (4 Hz)',
    jewels: 27,
    images: {
      primary: {
        key: 'aeroform-graphite',
        alt: 'Aéroform 40 Graphite with brushed steel cushion case and graphite dial, three-quarter view',
      },
      detail: {
        key: 'aeroform-graphite-dial',
        alt: 'Macro detail of the graphite brushed dial and applied silver indices',
      },
      profile: {
        key: 'aeroform-graphite-case',
        alt: 'Profile of the Aéroform case, chamfer and fluted crown with oxblood cabochon',
      },
      lifestyle: {
        key: 'hero-vertical',
        alt: 'The Aéroform 40 Graphite worn on the wrist at the wheel of a grand-touring car',
      },
    },
    straps: allStraps,
    featured: true,
    accent: '#3c3a36',
    specs: [
      { label: 'Reference', value: 'AF·40·GR' },
      { label: 'Case', value: '40 × 40 mm cushion, 10.2 mm thick' },
      { label: 'Case material', value: 'Stainless steel 316L, satin-brushed and polished' },
      { label: 'Bezel', value: 'Engraved minute track, mirror-polished chamfer' },
      { label: 'Dial', value: 'Brushed brass, applied rhodium-plated indices' },
      { label: 'Hands', value: 'Dauphine, faceted, oxblood seconds tip' },
      { label: 'Movement', value: 'Calibre MV·01, automatic, 27 jewels' },
      { label: 'Power reserve', value: '72 hours' },
      { label: 'Frequency', value: '28,800 vph (4 Hz)' },
      { label: 'Water resistance', value: '10 bar (100 m)' },
      { label: 'Crystal', value: 'Domed sapphire, double anti-reflective coating' },
      { label: 'Bracelet', value: 'Integrated H-link, brushed with polished centre rib' },
    ],
    story: [
      {
        heading: 'A case drawn with a single line',
        body: 'The cushion silhouette is not a softened square but a circle pushed at four points — a geometry that lets the case follow the wrist while keeping the dial reading like an instrument.',
      },
      {
        heading: 'One pass of the brush',
        body: 'Every steel surface is finished in a single direction. A second pass would break the light, and the case would lose the quiet, continuous sheen that defines the collection.',
      },
    ],
  },
  {
    id: 'af-40-ch',
    slug: 'aeroform-40-champagne',
    ref: 'AF·40·CH',
    name: 'Aéroform 40 Champagne',
    family: 'Aéroform',
    collection: 'aeroform',
    tagline: 'Warm light, cool steel',
    summary:
      'A champagne sunburst dial set into brushed steel, with an oxblood cabochon crown. The collection at its most generous.',
    description: [
      'Champagne is the warmest reading of the Aéroform case. A sunburst-brushed dial catches light in a slow radial sweep, against a case left deliberately cool and matte.',
      'The contrast is the point: warmth held inside a precise, engineered frame. It is a watch that works as readily under evening light as it does in daylight.',
    ],
    price: 6450,
    currency: 'GBP',
    availability: 'in-boutique',
    availabilityLabel: 'Available in boutique',
    dial: 'Champagne sunburst',
    dialHex: '#c3a878',
    material: 'Brushed stainless steel',
    materialTags: ['Stainless steel', 'Champagne alloy'],
    caseSize: 40,
    movement: 'Automatic',
    caseMaterial: 'Stainless steel 316L',
    strap: 'Champagne calfskin',
    strapType: 'Calfskin',
    glass: 'Domed sapphire, double anti-reflective coating',
    waterResistance: '10 bar (100 m)',
    powerReserve: '72 hours',
    frequency: '28,800 vph (4 Hz)',
    jewels: 27,
    images: {
      primary: {
        key: 'aeroform-champagne',
        alt: 'Aéroform 40 Champagne with champagne sunburst dial and brushed steel case',
      },
      detail: {
        key: 'aeroform-champagne-dial',
        alt: 'Macro detail of the champagne sunburst dial',
      },
      profile: {
        key: 'aeroform-champagne-case',
        alt: 'Profile detail of the champagne model case and crown',
      },
    },
    straps: allStraps,
    featured: true,
    accent: '#c3a878',
    specs: [
      { label: 'Reference', value: 'AF·40·CH' },
      { label: 'Case', value: '40 × 40 mm cushion, 10.2 mm thick' },
      { label: 'Case material', value: 'Stainless steel 316L, satin-brushed' },
      { label: 'Dial', value: 'Champagne sunburst brass, applied gold-tone indices' },
      { label: 'Hands', value: 'Dauphine, faceted, champagne-tone' },
      { label: 'Movement', value: 'Calibre MV·01, automatic, 27 jewels' },
      { label: 'Power reserve', value: '72 hours' },
      { label: 'Water resistance', value: '10 bar (100 m)' },
      { label: 'Crystal', value: 'Domed sapphire, double anti-reflective coating' },
      { label: 'Bracelet', value: 'Integrated H-link, or calfskin with steel pin buckle' },
    ],
    story: [
      {
        heading: 'A dial that behaves like light',
        body: 'The sunburst is cut from the centre outward at a controlled speed. Too slow and the rays read as lines; too fast and the dial turns to flat metal. The Aéroform dial is brushed for 40 seconds, no more.',
      },
    ],
  },
  {
    id: 'af-38-nc',
    slug: 'aeroform-38-nocturne',
    ref: 'AF·38·NC',
    name: 'Aéroform 38 Nocturne',
    family: 'Aéroform',
    collection: 'aeroform',
    tagline: 'Ink for the evening',
    summary:
      'A 38 mm case with a deep ink-blue dial, softened indices and a slimmer bracelet. Designed to disappear under a cuff.',
    description: [
      'Nocturne reduces the collection to its quietest expression. The case is taken to 38 mm — still architectural, but closer to the wrist — and the dial is lacquered in six translucent layers of ink blue.',
      'Indices are rhodium-plated and slightly narrower, so the dial reads darker at a distance. It is a watch for the end of the day.',
    ],
    price: 5900,
    currency: 'GBP',
    availability: 'made-to-order',
    availabilityLabel: 'Made to order · 6 weeks',
    dial: 'Ink blue lacquer',
    dialHex: '#1e2734',
    material: 'Brushed stainless steel',
    materialTags: ['Stainless steel', 'Lacquer'],
    caseSize: 38,
    movement: 'Automatic',
    caseMaterial: 'Stainless steel 316L',
    strap: 'Ink rubber',
    strapType: 'Rubber',
    glass: 'Flat sapphire, anti-reflective coating',
    waterResistance: '10 bar (100 m)',
    powerReserve: '72 hours',
    frequency: '28,800 vph (4 Hz)',
    jewels: 27,
    images: {
      primary: {
        key: 'aeroform-nocturne',
        alt: 'Aéroform 38 Nocturne with deep ink-blue lacquer dial and steel bracelet',
      },
      detail: {
        key: 'aeroform-nocturne-dial',
        alt: 'Macro detail of the ink blue lacquer dial',
      },
      profile: {
        key: 'aeroform-nocturne-case',
        alt: 'Profile detail of the 38 mm Nocturne case',
      },
    },
    straps: allStraps,
    accent: '#1e2734',
    specs: [
      { label: 'Reference', value: 'AF·38·NC' },
      { label: 'Case', value: '38 × 38 mm cushion, 9.8 mm thick' },
      { label: 'Case material', value: 'Stainless steel 316L, satin-brushed' },
      { label: 'Dial', value: 'Ink blue lacquer, six layers, high gloss' },
      { label: 'Hands', value: 'Slim dauphine, rhodium-plated' },
      { label: 'Movement', value: 'Calibre MV·01, automatic, 27 jewels' },
      { label: 'Power reserve', value: '72 hours' },
      { label: 'Water resistance', value: '10 bar (100 m)' },
      { label: 'Crystal', value: 'Flat sapphire, anti-reflective coating' },
      { label: 'Bracelet', value: 'Slimmer H-link bracelet or rubber strap' },
    ],
    story: [
      {
        heading: 'Six layers, one colour',
        body: 'Lacquer is applied in translucent coats, each cured before the next. The final dial holds depth rather than reflection: at arm’s length it is almost black, and in direct light it opens into blue.',
      },
    ],
  },
  {
    id: 'af-42-gt',
    slug: 'aeroform-gt-chronograph',
    ref: 'AF·42·GT',
    name: 'Aéroform GT Chronograph',
    family: 'Aéroform',
    collection: 'aeroform',
    tagline: 'Two counters, no theatre',
    summary:
      'A 42 mm chronograph with a silver-white dial, oxblood hands and a tachymeter bezel engraved in a single pass.',
    description: [
      'The GT is the most explicit nod to the collection’s automotive origins: two wide-set counters, a tachymeter scale engraved into the bezel, and a column-wheel chronograph you can feel engage.',
      'The dial stays pale and legible so the oxblood chronograph hands read instantly — a functional contrast rather than a decorative one.',
    ],
    price: 8750,
    currency: 'GBP',
    availability: 'in-boutique',
    availabilityLabel: 'Available in boutique',
    dial: 'Silver-white opaline',
    dialHex: '#e6e1d6',
    material: 'Brushed stainless steel',
    materialTags: ['Stainless steel', 'Rhodium'],
    caseSize: 42,
    movement: 'Automatic chronograph',
    caseMaterial: 'Stainless steel 316L',
    strap: 'Oxblood calfskin',
    strapType: 'Calfskin',
    glass: 'Box sapphire, double anti-reflective coating',
    waterResistance: '10 bar (100 m)',
    powerReserve: '68 hours',
    frequency: '28,800 vph (4 Hz)',
    jewels: 34,
    images: {
      primary: {
        key: 'aeroform-gt',
        alt: 'Aéroform GT Chronograph with silver opaline dial and oxblood chronograph hands',
      },
      detail: {
        key: 'aeroform-gt-dial',
        alt: 'Macro detail of the chronograph counters and tachymeter bezel',
      },
      profile: {
        key: 'aeroform-gt-case',
        alt: 'Profile detail of the chronograph case and pushers',
      },
    },
    straps: allStraps,
    featured: true,
    accent: '#5e1a1f',
    specs: [
      { label: 'Reference', value: 'AF·42·GT' },
      { label: 'Case', value: '42 × 42 mm cushion, 13.1 mm thick' },
      { label: 'Case material', value: 'Stainless steel 316L, satin-brushed' },
      { label: 'Bezel', value: 'Engraved tachymeter scale' },
      { label: 'Dial', value: 'Silver-white opaline, two counters' },
      { label: 'Movement', value: 'Calibre MV·02, automatic column-wheel chronograph, 34 jewels' },
      { label: 'Power reserve', value: '68 hours' },
      { label: 'Water resistance', value: '10 bar (100 m)' },
      { label: 'Crystal', value: 'Box sapphire, double anti-reflective coating' },
      { label: 'Bracelet', value: 'Integrated H-link or calfskin with folding buckle' },
    ],
    story: [
      {
        heading: 'A scale you can use, not admire',
        body: 'The tachymeter is cut after the case is finished, on a rotary engraver, so the numerals follow the curve of the bezel exactly. The oxblood hands are the only colour in an otherwise silver composition.',
      },
    ],
  },
  {
    id: 'af-40-sk',
    slug: 'aeroform-skeleton-edition',
    ref: 'AF·40·SK',
    name: 'Aéroform Skeleton Édition',
    family: 'Aéroform',
    collection: 'aeroform',
    tagline: 'The movement, exposed',
    summary:
      'A limited openworked edition: bevelled bridges in champagne-toned brass, an off-centre balance, and a dial reduced to its essentials.',
    description: [
      'Skeleton Édition removes the dial almost entirely. What remains is the architecture of Calibre MV·03: bridges drawn in a single continuous S-curve, hand-bevelled and brushed in opposing directions.',
      'Each example takes eleven weeks in the atelier. The edition is limited to one hundred and twenty pieces, numbered on the caseback.',
    ],
    price: 12900,
    currency: 'GBP',
    availability: 'waitlist',
    availabilityLabel: 'Waitlist · limited edition',
    edition: 'Edition of 120',
    dial: 'Openworked, champagne bridges',
    dialHex: '#a58a5d',
    material: 'Brushed stainless steel',
    materialTags: ['Stainless steel', 'Champagne alloy'],
    caseSize: 40,
    movement: 'Hand-wound',
    caseMaterial: 'Stainless steel 316L',
    strap: 'Graphite alligator',
    strapType: 'Alligator',
    glass: 'Domed sapphire, double anti-reflective coating',
    waterResistance: '5 bar (50 m)',
    powerReserve: '80 hours',
    frequency: '21,600 vph (3 Hz)',
    jewels: 29,
    images: {
      primary: {
        key: 'aeroform-skeleton',
        alt: 'Aéroform Skeleton Édition with openworked movement and champagne bridges',
      },
      detail: {
        key: 'aeroform-skeleton-dial',
        alt: 'Macro detail of the hand-bevelled openworked bridges',
      },
      profile: {
        key: 'aeroform-skeleton-case',
        alt: 'Profile detail of the skeleton edition case',
      },
    },
    straps: allStraps,
    accent: '#a58a5d',
    specs: [
      { label: 'Reference', value: 'AF·40·SK' },
      { label: 'Case', value: '40 × 40 mm cushion, 9.4 mm thick' },
      { label: 'Case material', value: 'Stainless steel 316L, satin-brushed' },
      { label: 'Dial', value: 'Openworked, no dial plate' },
      { label: 'Movement', value: 'Calibre MV·03, hand-wound, 29 jewels, hand-bevelled' },
      { label: 'Power reserve', value: '80 hours' },
      { label: 'Edition', value: '120 pieces, individually numbered' },
      { label: 'Water resistance', value: '5 bar (50 m)' },
      { label: 'Crystal', value: 'Domed sapphire, double anti-reflective coating' },
      { label: 'Bracelet', value: 'Alligator strap, steel pin buckle' },
    ],
    story: [
      {
        heading: 'Eleven weeks of bevels',
        body: 'Every bridge is bevelled by hand at a 45-degree angle, then polished on a boxwood wheel. The contrast between the mirror bevel and the brushed surface is the whole visual argument of the watch.',
      },
    ],
  },
  {
    id: 'af-40-ox',
    slug: 'aeroform-40-oxblood',
    ref: 'AF·40·OX',
    name: 'Aéroform 40 Oxblood',
    family: 'Aéroform',
    collection: 'aeroform',
    tagline: 'The colour of the cabochon',
    summary:
      'A limited lacquer dial in the maison’s oxblood, matched to the crown cabochon and finished with a graphite minute track.',
    description: [
      'Oxblood is the maison’s signature accent, used sparingly across the collection. This edition gives it the whole dial: twelve coats of translucent lacquer over a brushed base, polished flat between each.',
      'The result is a deep, slightly irregular red that shifts toward black at the edges. It is paired with a graphite alligator strap; steel and oxblood, nothing else.',
    ],
    price: 7200,
    currency: 'GBP',
    availability: 'waitlist',
    availabilityLabel: 'Waitlist · annual production',
    edition: 'Annual production',
    dial: 'Oxblood lacquer',
    dialHex: '#5e1a1f',
    material: 'Brushed stainless steel',
    materialTags: ['Stainless steel', 'Lacquer'],
    caseSize: 40,
    movement: 'Automatic',
    caseMaterial: 'Stainless steel 316L',
    strap: 'Graphite alligator',
    strapType: 'Alligator',
    glass: 'Domed sapphire, double anti-reflective coating',
    waterResistance: '10 bar (100 m)',
    powerReserve: '72 hours',
    frequency: '28,800 vph (4 Hz)',
    jewels: 27,
    images: {
      primary: {
        key: 'aeroform-oxblood',
        alt: 'Aéroform 40 Oxblood with deep oxblood lacquer dial and graphite alligator strap',
      },
      detail: {
        key: 'aeroform-oxblood-dial',
        alt: 'Macro detail of the oxblood lacquer dial',
      },
      profile: {
        key: 'aeroform-oxblood-case',
        alt: 'Profile detail of the oxblood edition case',
      },
    },
    straps: allStraps,
    accent: '#5e1a1f',
    specs: [
      { label: 'Reference', value: 'AF·40·OX' },
      { label: 'Case', value: '40 × 40 mm cushion, 10.2 mm thick' },
      { label: 'Case material', value: 'Stainless steel 316L, satin-brushed' },
      { label: 'Dial', value: 'Oxblood lacquer, twelve coats, polished' },
      { label: 'Movement', value: 'Calibre MV·01, automatic, 27 jewels' },
      { label: 'Power reserve', value: '72 hours' },
      { label: 'Water resistance', value: '10 bar (100 m)' },
      { label: 'Crystal', value: 'Domed sapphire, double anti-reflective coating' },
      { label: 'Bracelet', value: 'Alligator strap, steel pin buckle' },
    ],
    story: [
      {
        heading: 'A red that reads as black',
        body: 'Oxblood lacquer is built in twelve coats over a brushed brass base, then polished flat. From a distance it is almost graphite; only when the light crosses it does the red appear.',
      },
    ],
  },
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
export const productById = (id: string) => products.find((p) => p.id === id)

export const materialOptions = [
  'Stainless steel',
  'Champagne gold',
  'Two-tone steel and gold',
] as const

export const dialOptions = [
  'Graphite',
  'Champagne',
  'Ink blue',
  'Silver-white',
  'Oxblood',
  'Openworked',
] as const

export const availabilityOptions = [
  { id: 'in-boutique', label: 'Available in boutique' },
  { id: 'made-to-order', label: 'Made to order' },
  { id: 'waitlist', label: 'Waitlist' },
] as const

export const allStrapsExport = allStraps
