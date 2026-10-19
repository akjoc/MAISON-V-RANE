import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { VideoHero } from '../components/primitives/VideoHero'
import { RevealText, Line } from '../components/primitives/RevealText'
import { RevealSection } from '../components/primitives/RevealSection'
import { ParallaxMedia } from '../components/primitives/ParallaxMedia'
import { ScrollFilm } from '../components/primitives/ScrollFilm'
import { Marquee } from '../components/primitives/Marquee'
import { ProductCard } from '../components/primitives/ProductCard'
import { Icon } from '../components/primitives/Icon'
import { Media } from '../components/primitives/Media'
import { products } from '../data/products'
import { homeServices } from '../data/editorial'
import { useSeo } from '../lib/seo'
import { gsap, prefersReducedMotion } from '../lib/motion'

const featured = products.filter((p) => p.featured).slice(0, 3)

export function Home() {
  useSeo({
    title: 'Mechanical instruments for the open road',
    description:
      'Discover Aéroform by MAISON VÉRANE — an original, fictional luxury watch collection of cushion-cased mechanical instruments in brushed steel, champagne and oxblood.',
    path: '/',
    image: '/assets/images/hero-wide-1600.webp',
  })

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.home-hero__eyebrow, .home-hero__sub, .home-hero__actions',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1.1, delay: 0.45, stagger: 0.12, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.home-hero__meta',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.4, delay: 1.2 },
      )
      // The hero settles away as the first section arrives.
      gsap.to('.vhero__content', {
        yPercent: -14,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.vhero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
        },
      })
      gsap.to('.vhero__poster, .vhero__video', {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.vhero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <VideoHero posterKey="hero-wide" posterAlt="Aéroform 40 Graphite resting on warm stone in raking light">
        <div className="vhero__content">
          <div className="container container--wide">
            <div className="vhero__grid">
              <div>
                <p className="eyebrow home-hero__eyebrow vhero__eyebrow">Aéroform · Chapter 01</p>
                <RevealText as="h1" immediate delay={0.15} stagger={0.12}>
                  <Line>Time, shaped</Line>
                  <Line>
                    by the <em>road.</em>
                  </Line>
                </RevealText>
                <p className="vhero__sub home-hero__sub">
                  A cushion case cut for the wrist. A dial brushed like an instrument face. Aéroform
                  is a mechanical watch drawn from the discipline of movement.
                </p>
                <div className="vhero__actions home-hero__actions">
                  <Link to="/collections/aeroform" className="btn btn--light">
                    <span>
                      Explore the collection <Icon name="arrow-right" size={15} />
                    </span>
                  </Link>
                  <Link to="/appointments" className="btn btn--ghost-light">
                    <span>Book an appointment</span>
                  </Link>
                </div>
              </div>
              <div className="vhero__aside home-hero__meta">
                <p className="micro" style={{ color: 'rgba(242,236,226,.55)' }}>
                  Calibre MV·01 · 72-hour reserve
                </p>
                <p className="micro" style={{ color: 'rgba(242,236,226,.55)' }}>
                  Steel · champagne · oxblood
                </p>
              </div>
            </div>
          </div>
        </div>
        <span className="vhero__status">
          <span className="pulse" aria-hidden="true" /> Original film study · Aéroform
        </span>
      </VideoHero>

      {/* ——— Editorial introduction ——— */}
      <section className="section section--lg home-intro" id="collection">
        <div className="container">
          <div className="home-intro__grid">
            <RevealSection className="home-intro__left">
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> The maison
              </p>
              <RevealText as="h2" className="home-intro__title">
                <Line>A quiet instrument</Line>
                <Line>for a loud century.</Line>
              </RevealText>
            </RevealSection>
            <RevealSection className="home-intro__right" stagger>
              <p className="lede">
                We make few things, and we make them slowly. Aéroform began with a single question:
                what would a watch look like if it were drawn by someone who understood both
                engines and wrists?
              </p>
              <p className="prose">
                The answer is not a racing watch. It is a measured one — a cushion case with a
                continuous brushed surface, a dial reduced to legibility, and a bracelet that
                follows the arm rather than resisting it. Every reference in the collection is
                built on the same architecture, finished by the same hands.
              </p>
              <Link to="/about" className="text-link">
                About the maison <Icon name="arrow-right" size={14} />
              </Link>
            </RevealSection>
          </div>

          <ParallaxMedia
            imageKey="editorial-collection"
            alt="Aéroform watch on a travertine plinth, light falling across a plaster wall"
            orientation="wide"
            ratio="cinema"
            className="home-intro__figure"
            index="Pl. 01"
            caption="Atelier study — Aéroform 40 Graphite on travertine"
            sizes="100vw"
            priority
          />
        </div>
      </section>

      {/* ——— Featured references ——— */}
      <section className="section home-featured">
        <div className="container">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">02</span> Selected references
              </p>
              <RevealText as="h2" className="home-featured__title">
                <Line>Three ways</Line>
                <Line>of reading time.</Line>
              </RevealText>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.95rem' }}>
                The same case architecture, three different temperatures. Each reference is shown
                with its default strap; the archive offers five more.
              </p>
              <Link to="/watches" className="text-link">
                All six timepieces <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </RevealSection>

          <div className="home-featured__grid">
            <RevealSection className="home-featured__lead">
              <ProductCard product={featured[0]} priority />
            </RevealSection>
            <div className="home-featured__side">
              {featured.slice(1).map((product) => (
                <RevealSection key={product.id}>
                  <ProductCard product={product} />
                </RevealSection>
              ))}
            </div>
            <RevealSection className="home-featured__note">
              <p className="micro">From the collection</p>
              <p className="serif" style={{ fontSize: '1.15rem', lineHeight: 1.4 }}>
                Each bracelet is sized, brushed and assembled by hand before it meets a case.
              </p>
              <Link to="/craftsmanship" className="text-link">
                Inside the atelier <Icon name="arrow-right" size={13} />
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          'Aéroform 40',
          'Cushion case, 10.2 mm',
          'Calibre MV·01',
          '72-hour reserve',
          'Brushed steel',
          'Champagne',
          'Oxblood',
        ]}
      />

      {/* ——— Alternating storytelling ——— */}
      <section className="section section--lg home-story">
        <div className="container">
          <article className="home-story__row">
            <RevealSection className="home-story__media">
              <Media
                imageKey="macro-case"
                alt="Profile of the Aéroform cushion case and fluted crown"
                orientation="square"
                ratio="portrait"
                sizes="(min-width: 900px) 40vw, 100vw"
              />
            </RevealSection>
            <RevealSection className="home-story__text" stagger>
              <p className="eyebrow">
                <span className="eyebrow__num">03</span> Case architecture
              </p>
              <h2 className="home-story__title">Four curves, one continuous line</h2>
              <p className="prose">
                The cushion is not a softened square. It is a circle pushed at four points — a
                geometry that lets the case sit close to the wrist while the dial keeps the
                legibility of an instrument. The chamfer is cut by hand, then polished, so light
                travels around the case in a single unbroken path.
              </p>
              <dl className="stat-row">
                <div>
                  <dt className="micro">Tolerance</dt>
                  <dd className="serif">4 µm</dd>
                </div>
                <div>
                  <dt className="micro">Thickness</dt>
                  <dd className="serif">10.2 mm</dd>
                </div>
                <div>
                  <dt className="micro">Water</dt>
                  <dd className="serif">100 m</dd>
                </div>
              </dl>
              <Link to="/craftsmanship" className="text-link">
                The case, in detail <Icon name="arrow-right" size={14} />
              </Link>
            </RevealSection>
          </article>

          <article className="home-story__row home-story__row--reverse">
            <RevealSection className="home-story__media">
              <Media
                imageKey="macro-dial"
                alt="Macro of the graphite brushed dial, applied indices and snailed subdial"
                orientation="square"
                ratio="portrait"
                sizes="(min-width: 900px) 40vw, 100vw"
              />
            </RevealSection>
            <RevealSection className="home-story__text" stagger>
              <p className="eyebrow">
                <span className="eyebrow__num">04</span> Dial craft
              </p>
              <h2 className="home-story__title">A dial that behaves like light</h2>
              <p className="prose">
                Brass is brushed in one horizontal pass, then galvanised. The indices are applied
                by hand under a binocular microscope; the subdials are snailed in tight concentric
                circles that catch light only when the wrist turns. Nothing on the dial is printed
                that could instead be made.
              </p>
              <Link to="/watchmaking" className="text-link">
                Read the dial chapter <Icon name="arrow-right" size={14} />
              </Link>
            </RevealSection>
          </article>
        </div>
      </section>

      {/* ——— Craftsmanship ——— */}
      <section className="home-craft">
        <div className="home-craft__media">
          <Media
            imageKey="craft-atelier"
            alt="A watchmaker at the bench, loupe in eye, working on a movement under warm light"
            orientation="wide"
            sizes="100vw"
            priority={false}
          />
        </div>
        <div className="container home-craft__inner">
          <RevealSection className="home-craft__copy" stagger>
            <p className="eyebrow eyebrow--plain" style={{ color: 'rgba(242,236,226,.6)' }}>
              The atelier
            </p>
            <h2>The last ten per cent is the whole watch</h2>
            <p>
              Finishing cannot be automated and cannot be hurried. A single bracelet takes four
              hours of alternating brush and polish before it is allowed to meet a case. It is the
              part of watchmaking that is felt rather than read.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Link to="/craftsmanship" className="btn btn--light">
                <span>
                  Enter the atelier <Icon name="arrow-right" size={15} />
                </span>
              </Link>
              <Link to="/collections/aeroform#study" className="btn btn--ghost-light">
                <span>
                  Turn the case in 3D <Icon name="rotate" size={15} />
                </span>
              </Link>
            </div>
          </RevealSection>
          <div className="home-craft__stats">
            {[
              ['4 µm', 'case tolerance'],
              ['45°', 'hand-cut bevel'],
              ['11 wks', 'skeleton assembly'],
            ].map(([value, label]) => (
              <RevealSection key={label} className="home-craft__stat">
                <span className="serif">{value}</span>
                <span className="micro" style={{ color: 'rgba(242,236,226,.55)' }}>{label}</span>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Scroll-scrubbed film ——— */}
      <ScrollFilm
        posterKey="editorial-collection"
        posterAlt="Aéroform on a travertine plinth as light moves across the plaster wall"
        src="/assets/video/editorial-loop.mp4"
        eyebrow="Film · Volume II"
        heading="A room, a plinth, and a single shaft of light."
        chapters={[
          { at: 0, title: 'Morning', copy: 'Light reaches the case from the left and draws the chamfer in one continuous line.' },
          { at: 0.34, title: 'Noon', copy: 'The dial turns almost black as the angle steepens; the indices hold the only highlight.' },
          { at: 0.67, title: 'Late afternoon', copy: 'Warm light crosses the travertine and the steel becomes champagne for a few minutes.' },
        ]}
        id="film"
      />

      {/* ——— Campaign ——— */}
      <section className="home-campaign" aria-labelledby="campaign-title">
        <div className="home-campaign__media">
          <Media
            imageKey="campaign-staircase"
            alt="A woman in a sand wool coat at the foot of a travertine staircase, Aéroform at her wrist"
            orientation="wide"
            sizes="100vw"
          />
        </div>
        <div className="home-campaign__overlay">
          <div className="container">
            <RevealSection className="home-campaign__copy" stagger>
              <p className="eyebrow" style={{ color: 'rgba(242,236,226,.7)' }}>
                Campaign · Volume II
              </p>
              <h2 id="campaign-title">
                Between departure
                <br /> and arrival.
              </h2>
              <Link to="/collections/aeroform" className="btn btn--light">
                <span>Discover Aéroform</span>
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ——— Materials ——— */}
      <section className="section section--lg home-materials">
        <div className="container">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">05</span> Materials
              </p>
              <RevealText as="h2">
                <Line>Three metals,</Line>
                <Line>held in reserve.</Line>
              </RevealText>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.95rem' }}>
                Steel for the everyday instrument. Champagne alloy for the skeleton bridges.
                Oxblood lacquer, twelve coats deep, for the dials that ask for it.
              </p>
              <Link to="/craftsmanship#materials" className="text-link">
                Material studies <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </RevealSection>

          <div className="home-materials__grid">
            {[
              { key: 'material-steel', alt: 'Three hand-finished metal plates in raking light', label: 'Satin steel', meta: 'Directional brush · one pass', index: 'i' },
              { key: 'macro-bracelet', alt: 'Macro of brushed H-link bracelet with polished centre ribs', label: 'H-link bracelet', meta: 'Brushed links · polished ribs', index: 'ii' },
              { key: 'macro-case', alt: 'Profile of a polished steel chamfer and oxblood cabochon crown', label: 'Oxblood cabochon', meta: 'Synthetic corundum · 3 mm', index: 'iii' },
            ].map((item) => (
              <RevealSection key={item.key} className="home-materials__item">
                <Media
                  imageKey={item.key}
                  alt={item.alt}
                  orientation="square"
                  ratio="square"
                  sizes="(min-width: 900px) 30vw, 100vw"
                  zoomOnHover
                />
                <div className="home-materials__caption">
                  <span className="micro">{item.index}</span>
                  <span className="serif">{item.label}</span>
                  <span className="micro">{item.meta}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Services ——— */}
      <section className="section home-services">
        <div className="container">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">06</span> Client services
              </p>
              <RevealText as="h2">
                <Line>After the purchase,</Line>
                <Line>the relationship.</Line>
              </RevealText>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.95rem' }}>
                A watch is a long conversation. These are the ways we continue it — in the salon, at
                the bench, or by correspondence.
              </p>
            </div>
          </RevealSection>
          <div className="home-services__grid">
            {homeServices.map((service) => (
              <RevealSection key={service.index} className="home-services__item">
                <span className="home-services__index">{service.index}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <Link to={service.to} className="text-link">
                  {service.cta} <Icon name="arrow-right" size={13} />
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Boutique invitation ——— */}
      <section className="section section--lg home-invite">
        <div className="container home-invite__inner">
          <RevealSection className="home-invite__copy" stagger>
            <p className="eyebrow">By appointment</p>
            <h2>
              Sit down with
              <br />
              <em>the collection.</em>
            </h2>
            <p className="prose">
              An hour with a specialist, a flat surface, and as many references as you would like to
              try. No obligation, and no hurry.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
              <Link to="/appointments" className="btn">
                <span>Book an appointment</span>
              </Link>
              <Link to="/boutiques" className="btn btn--outline">
                <span>Find a boutique</span>
              </Link>
            </div>
          </RevealSection>
          <RevealSection className="home-invite__aside" stagger>
            <p className="micro">Selected salons</p>
            <ul className="home-invite__list">
              {[
                ['London', 'Marylebone Salon'],
                ['Paris', 'Atelier des Passages'],
                ['Tokyo', 'Ginza Maison'],
                ['Jaipur', 'Haveli Maison'],
              ].map(([city, name]) => (
                <li key={city}>
                  <span className="serif">{city}</span>
                  <span className="micro">{name}</span>
                </li>
              ))}
            </ul>
            <p className="field__hint">All locations are fictional in this prototype.</p>
          </RevealSection>
        </div>
      </section>
    </>
  )
}
