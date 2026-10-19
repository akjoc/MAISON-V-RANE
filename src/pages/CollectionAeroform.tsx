import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { ParallaxMedia } from '../components/primitives/ParallaxMedia'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { ProductCard } from '../components/primitives/ProductCard'
import { ScrollStudy, type StudyChapter } from '../components/three/ScrollStudy'
import { ScrollFilm } from '../components/primitives/ScrollFilm'
import { Icon } from '../components/primitives/Icon'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'

const chapters = [
  {
    id: 'cushion',
    index: '01',
    title: 'The cushion',
    copy: 'A circle pushed at four points. The case is machined from one block of 316L steel and left 40 mm across — architectural, but never square.',
    image: 'aeroform-graphite',
    alt: 'Aéroform case, three-quarter view',
    meta: '40 × 40 mm · 10.2 mm',
  },
  {
    id: 'chamfer',
    index: '02',
    title: 'The chamfer',
    copy: 'A single polished line runs around the case, cut by hand at 45 degrees. It is the only mirror surface on the watch, and it draws the silhouette in light.',
    image: 'macro-case',
    alt: 'Macro of the polished chamfer and crown',
    meta: '45° · hand-cut',
  },
  {
    id: 'crown',
    index: '03',
    title: 'The crown',
    copy: 'Fluted at a pitch of 0.4 mm so it can be turned with a thumbnail, then set with a 3 mm oxblood cabochon — the maison’s only colour, used sparingly.',
    image: 'aeroform-graphite-detail',
    alt: 'Detail of the crown and dial edge',
    meta: 'Cabochon · 3 mm',
  },
  {
    id: 'bracelet',
    index: '04',
    title: 'The bracelet',
    copy: 'H-shaped links taper from 22 mm to 16 mm, alternating a directional brush with a polished rib. It follows the wrist because it was drawn around one.',
    image: 'macro-bracelet',
    alt: 'Macro of the integrated H-link bracelet',
    meta: '22 → 16 mm taper',
  },
]

const directions = [
  {
    id: 'graphite',
    name: 'Graphite',
    copy: 'The founding reading. Horizontal brushing under a cool grey, with rhodium indices and a single thread of oxblood at the seconds hand.',
    image: 'aeroform-graphite',
    slug: 'aeroform-40-graphite',
  },
  {
    id: 'champagne',
    name: 'Champagne',
    copy: 'Warmth held inside a precise frame. A sunburst dial brushed for exactly forty seconds, against steel left deliberately matte.',
    image: 'aeroform-champagne',
    slug: 'aeroform-40-champagne',
  },
  {
    id: 'nocturne',
    name: 'Nocturne',
    copy: 'Six translucent coats of ink blue lacquer. At arm’s length it is almost black; in direct light it opens into colour.',
    image: 'aeroform-nocturne',
    slug: 'aeroform-38-nocturne',
  },
  {
    id: 'oxblood',
    name: 'Oxblood',
    copy: 'The cabochon colour, given the whole dial. Twelve coats over brushed brass, polished flat between each, reading as graphite until the light crosses it.',
    image: 'aeroform-oxblood',
    slug: 'aeroform-40-oxblood',
  },
]

const straps = [
  { name: 'Integrated H-link', material: 'Brushed steel', swatch: 'linear-gradient(135deg,#d9d8d2,#9c9a92 45%,#c9c7bf 70%,#8d8b84)', note: 'Sized to the wrist in the salon.' },
  { name: 'Graphite alligator', material: 'Alligator', swatch: '#3a3936', note: 'Square-scale, ivory stitching.' },
  { name: 'Oxblood calfskin', material: 'Calfskin', swatch: '#5e1a1f', note: 'Vegetable-tanned, matte finish.' },
  { name: 'Champagne calfskin', material: 'Calfskin', swatch: '#c3a878', note: 'Edge-painted in graphite.' },
  { name: 'Ink rubber', material: 'Rubber', swatch: '#24262b', note: 'Embossed with a road-tyre tread.' },
  { name: 'Ivory textile', material: 'Textile', swatch: '#ded5c4', note: 'Quick-release, graphite keeper.' },
]

const studyChapters: StudyChapter[] = chapters.map((c) => ({
  id: c.id,
  index: c.index,
  title: c.title,
  copy: c.copy,
  meta: c.meta,
  imageKey: c.image,
  alt: c.alt,
}))

const filmChapters = [
  {
    at: 0,
    title: 'A single pass',
    copy: 'Light travels the brushed flank of the case in one continuous movement — the finish that takes the longest to learn.',
  },
  {
    at: 0.34,
    title: 'The dial in shadow',
    copy: 'The graphite dial shifts from almost black to warm grey as the angle changes, without ever becoming reflective.',
  },
  {
    at: 0.67,
    title: 'Held in the hand',
    copy: 'A 40 mm cushion case is small enough to disappear under a cuff. The study is as much about absence as presence.',
  },
]

export default function CollectionAeroform() {
  const [activeStrap, setActiveStrap] = useState(0)

  useSeo({
    title: 'Aéroform — the collection',
    description:
      'Aéroform by MAISON VÉRANE: four style directions, one cushion architecture. Explore the case, dial, bracelet and interchangeable straps of the fictional flagship collection.',
    path: '/collections/aeroform',
    image: '/assets/images/editorial-collection-1600.webp',
  })

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="coll-hero">
        <div className="container">
          <div className="coll-hero__head">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Maison</Link>
              <span className="sep">/</span>
              <span>Collections</span>
              <span className="sep">/</span>
              <span aria-current="page">Aéroform</span>
            </nav>
            <div className="coll-hero__meta">
              <span className="micro">Chapter 01</span>
              <span className="micro">Six references</span>
              <span className="micro">2024 —</span>
            </div>
          </div>

          <div className="coll-hero__title-row">
            <RevealText as="h1" immediate className="coll-hero__title">
              <Line>Aéro</Line>
              <Line>
                form<em>.</em>
              </Line>
            </RevealText>
            <RevealSection className="coll-hero__intro" stagger>
              <p className="eyebrow">The collection</p>
              <p className="lede" style={{ color: 'var(--ink-muted)' }}>
                An instrument is a watch that has been given a purpose. Aéroform takes the discipline
                of the road — legibility, proportion, a single decisive line — and reduces it to
                something quiet enough to wear every day.
              </p>
              <p className="micro">Designed in the atelier · assembled by hand · fictional demonstration</p>
            </RevealSection>
          </div>
        </div>

        <ParallaxMedia
          imageKey="editorial-collection"
          alt="Aéroform on a travertine plinth, warm light across a plaster wall"
          orientation="wide"
          ratio="cinema"
          strength={8}
          sizes="100vw"
          priority
          index="Pl. 01"
          caption="Collection study — graphite on travertine"
          className="coll-hero__figure"
        />
      </section>

      {/* ——— Philosophy ——— */}
      <section className="section section--lg coll-philosophy">
        <div className="container">
          <div className="coll-philosophy__grid">
            <RevealSection>
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> Design philosophy
              </p>
              <RevealText as="h2" className="coll-philosophy__title">
                <Line>Nothing added</Line>
                <Line>that cannot be</Line>
                <Line>justified.</Line>
              </RevealText>
            </RevealSection>
            <RevealSection className="coll-philosophy__copy" stagger>
              <p className="lede">
                Aéroform was drawn from a single premise: the watch should behave like the best
                instrument in the room, and announce nothing.
              </p>
              <p className="prose">
                Three rules governed every decision. Proportion before decoration. One finish per
                surface. A single colour, repeated only where the eye needs it. The result is a
                collection that reads as one object in six temperatures.
              </p>
              <ul className="coll-principles">
                <li>
                  <span className="micro">i</span>
                  <span>Proportion before decoration</span>
                </li>
                <li>
                  <span className="micro">ii</span>
                  <span>One finish per surface</span>
                </li>
                <li>
                  <span className="micro">iii</span>
                  <span>A single colour, used sparingly</span>
                </li>
              </ul>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ——— Four directions ——— */}
      <section className="section coll-directions" id="directions">
        <div className="container">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">02</span> Style directions
              </p>
              <RevealText as="h2">
                <Line>Four readings</Line>
                <Line>of the same idea.</Line>
              </RevealText>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.95rem' }}>
                A colour is never applied for novelty. Each direction answers a different hour of
                the day, and each keeps the same case, indices and bracelet.
              </p>
            </div>
          </RevealSection>
          <div className="coll-directions__grid">
            {directions.map((d, i) => (
              <RevealSection key={d.id} className={`coll-direction ${i % 2 === 1 ? 'is-offset' : ''}`}>
                <Link to={`/watches/${d.slug}`} className="coll-direction__link">
                  <span className="coll-direction__media">
                    <Media
                      imageKey={d.image}
                      alt={`${d.name} direction of the Aéroform collection`}
                      orientation="square"
                      ratio="square"
                      sizes="(min-width: 900px) 45vw, 92vw"
                      zoomOnHover
                    />
                  </span>
                  <span className="coll-direction__body">
                    <span className="micro">Direction 0{i + 1}</span>
                    <span className="coll-direction__name">{d.name}</span>
                    <span className="coll-direction__copy">{d.copy}</span>
                    <span className="text-link">
                      See the reference <Icon name="arrow-right" size={13} />
                    </span>
                  </span>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Featured references ——— */}
      <section className="section coll-featured">
        <div className="container">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">03</span> Featured references
              </p>
              <RevealText as="h2">
                <Line>Six references.</Line>
                <Line>One architecture.</Line>
              </RevealText>
            </div>
            <div className="section-head__aside">
              <Link to="/watches" className="text-link">
                View the complete collection <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </RevealSection>
          <div className="coll-featured__grid">
            {products.slice(0, 3).map((p) => (
              <RevealSection key={p.id}>
                <ProductCard product={p} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Scroll-driven 3D study ——— */}
      <ScrollStudy chapters={studyChapters} id="study" />

      {/* ——— Scroll-scrubbed film ——— */}
      <ScrollFilm
        posterKey="hero-wide"
        posterAlt="Light moving across an Aéroform case on warm stone"
        eyebrow="Film · Volume I"
        heading="Light, moved by the scroll."
        chapters={filmChapters}
        id="film"
      />

      {/* ——— Dial & bracelet ——— */}
      <section className="section section--lg coll-detail">
        <div className="container">
          <div className="coll-detail__row">
            <RevealSection className="coll-detail__media">
              <Media
                imageKey="macro-dial"
                alt="Macro of the brushed dial, applied indices and snailed subdial"
                orientation="square"
                ratio="portrait"
                sizes="(min-width: 900px) 45vw, 92vw"
              />
            </RevealSection>
            <RevealSection className="coll-detail__copy" stagger>
              <p className="eyebrow">
                <span className="eyebrow__num">05</span> Dial craftsmanship
              </p>
              <h2>The dial is cut, not printed</h2>
              <p className="prose">
                A single horizontal pass of the brush gives the graphite its direction. The applied
                indices are seated by hand under a binocular microscope, each one within two
                hundredths of a millimetre of its position.
              </p>
              <ul className="coll-spec-list">
                <li>
                  <span className="micro">Base</span>
                  <span>Brass, 0.4 mm</span>
                </li>
                <li>
                  <span className="micro">Finish</span>
                  <span>Horizontal brush / sunburst</span>
                </li>
                <li>
                  <span className="micro">Indices</span>
                  <span>Applied, faceted, rhodium or gold tone</span>
                </li>
                <li>
                  <span className="micro">Hands</span>
                  <span>Dauphine, oxblood seconds tip</span>
                </li>
              </ul>
              <Link to="/watchmaking#dial" className="text-link">
                The dial chapter <Icon name="arrow-right" size={14} />
              </Link>
            </RevealSection>
          </div>

          <div className="coll-detail__row coll-detail__row--reverse" id="bracelet">
            <RevealSection className="coll-detail__media">
              <Media
                imageKey="macro-bracelet"
                alt="Macro of the integrated H-link bracelet with polished centre ribs"
                orientation="square"
                ratio="portrait"
                sizes="(min-width: 900px) 45vw, 92vw"
              />
            </RevealSection>
            <RevealSection className="coll-detail__copy" stagger>
              <p className="eyebrow">
                <span className="eyebrow__num">06</span> Bracelet construction
              </p>
              <h2>Drawn around a wrist, not a table</h2>
              <p className="prose">
                The bracelet tapers from 22 mm at the lugs to 16 mm at the clasp, each link finished
                in two directions so the light changes as the arm moves. Four hours of brush and
                polish go into every bracelet before it meets its case.
              </p>
              <ul className="coll-spec-list">
                <li>
                  <span className="micro">Construction</span>
                  <span>Integrated, 5-link rows</span>
                </li>
                <li>
                  <span className="micro">Finish</span>
                  <span>Satin links · polished centre rib</span>
                </li>
                <li>
                  <span className="micro">Clasp</span>
                  <span>Folding, milled, signed</span>
                </li>
                <li>
                  <span className="micro">Sizing</span>
                  <span>Half links, adjusted in salon</span>
                </li>
              </ul>
              <Link to="/craftsmanship#finishing" className="text-link">
                Finishing, in the atelier <Icon name="arrow-right" size={14} />
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ——— Straps ——— */}
      <section className="section coll-straps" id="straps">
        <div className="container">
          <div className="coll-straps__grid">
            <RevealSection className="coll-straps__copy" stagger>
              <p className="eyebrow">
                <span className="eyebrow__num">07</span> Interchangeable straps
              </p>
              <h2>Six ways to wear one case</h2>
              <p className="prose">
                A guarded release lever allows a strap to be changed without tools and without
                compromising water resistance. Choose a material to read its character.
              </p>
              <div className="coll-straps__selector" role="radiogroup" aria-label="Strap material">
                {straps.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    role="radio"
                    aria-checked={activeStrap === i}
                    className={`coll-strap ${activeStrap === i ? 'is-active' : ''}`}
                    onClick={() => setActiveStrap(i)}
                  >
                    <span className="coll-strap__swatch" style={{ background: s.swatch }} aria-hidden="true" />
                    <span className="coll-strap__label">
                      <span>{s.name}</span>
                      <span className="micro">{s.material}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="coll-straps__note" role="status">
                <p className="serif">{straps[activeStrap].name}</p>
                <p className="small">{straps[activeStrap].note}</p>
                <p className="micro">Included in the archive · fitted in salon</p>
              </div>
            </RevealSection>
            <RevealSection className="coll-straps__media">
              <Media
                imageKey="hero-vertical"
                alt="Aéroform worn at the wheel of a grand-touring car"
                orientation="portrait"
                ratio="portrait"
                sizes="(min-width: 900px) 42vw, 92vw"
              />
              <p className="micro" style={{ marginTop: '0.75rem' }}>
                Campaign study · the collection on the wrist
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ——— Closing ——— */}
      <section className="section section--lg coll-cta">
        <div className="container coll-cta__inner">
          <RevealSection className="coll-cta__copy" stagger>
            <p className="eyebrow eyebrow--plain">A private viewing</p>
            <h2>
              Come and see
              <br />
              <em>the case in person.</em>
            </h2>
            <p className="prose">
              The proportions are the argument, and they do not survive a screen. Book an hour in a
              salon — no obligation, and no hurry.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link to="/appointments" className="btn">
                <span>Book an appointment</span>
              </Link>
              <Link to="/watches" className="btn btn--outline">
                <span>All references</span>
              </Link>
            </div>
          </RevealSection>
          <RevealSection className="coll-cta__aside" stagger>
            <p className="micro">The collection, in brief</p>
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/watches/${p.slug}`} className="coll-cta__link">
                <span className="serif">{p.name}</span>
                <span className="micro tabular">{formatPrice(p.price, p.currency)}</span>
              </Link>
            ))}
            <p className="field__hint">Prices are demonstration placeholders.</p>
          </RevealSection>
        </div>
      </section>
    </>
  )
}
