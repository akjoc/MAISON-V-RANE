import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { craftsmanshipChapters } from '../data/editorial'
import { ScrollFilm } from '../components/primitives/ScrollFilm'
import { usePinnedProgress } from '../lib/scrollMotion'
import { assetUrl } from '../lib/assets'
import { useReducedMotion } from '../hooks/useMediaQuery'

const sequence = [
  { key: 'macro-case', label: 'The chamfer', meta: '45° · hand-cut' },
  { key: 'material-steel', label: 'Three metals', meta: 'Satin · mirror · champagne' },
  { key: 'macro-bracelet', label: 'The bracelet', meta: 'Two directions of light' },
  { key: 'macro-dial', label: 'The dial', meta: 'One horizontal pass' },
]

function MaterialSequence() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion()

  // Scroll progress drives the sequence: each frame gets a slow push-in and the
  // active tab follows the section. Measured live, so nothing drifts.
  usePinnedProgress(
    sectionRef,
    (progress) => {
      const scaled = progress * sequence.length
      imageRefs.current.forEach((frame, i) => {
        const img = frame?.querySelector('img')
        if (!img) return
        const distance = Math.min(1, Math.max(0, scaled - i))
        img.style.transform = `scale(${(1.22 - distance * 0.18).toFixed(3)})`
      })
    },
    {
      enabled: !reduced,
      chapters: sequence.length,
      onChapter: (index) => setActive((current) => (current === index ? current : index)),
    },
  )

  const goTo = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const start = section.getBoundingClientRect().top + window.scrollY
    const span = section.offsetHeight - window.innerHeight
    window.scrollTo({ top: start + (span * (index + 0.1)) / sequence.length, behavior: 'smooth' })
  }

  return (
    <div className="sequence" ref={sectionRef}>
      <div className="container sequence__inner">
        <div className="sequence__copy">
          <p className="eyebrow eyebrow--plain" style={{ color: 'rgba(242,236,226,.55)' }}>
            Material study
          </p>
          <h2>Four surfaces, one sequence</h2>
          <p className="sequence__body">
            The same case seen at four distances. Scroll slowly: the image moves through macro
            detail, raw material and finished surface without ever becoming a diagram.
          </p>
          <div className="sequence__index" role="tablist" aria-label="Material sequence">
            {sequence.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`sequence__tab ${i === active ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
              >
                <span className="sequence__num">{String(i + 1).padStart(2, '0')}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <p className="micro" style={{ color: 'rgba(242,236,226,.45)' }}>
            {sequence[active].meta} — image sequence, not a 3D model
          </p>
        </div>
        <div className="sequence__stage">
          {sequence.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => {
                imageRefs.current[i] = el
              }}
              className={`sequence__frame ${active === i ? 'is-active' : ''}`}
              aria-hidden={active !== i}
            >
              <Media
                imageKey={s.key}
                alt={active === i ? `${s.label} — craftsmanship study` : ''}
                orientation="square"
                ratio="square"
                sizes="(min-width: 900px) 46vw, 92vw"
              />
            </div>
          ))}
          <div className="sequence__caption">
            <span className="micro">Vol. {String(active + 1).padStart(2, '0')}</span>
            <span className="serif">{sequence[active].label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Craftsmanship() {
  useSeo({
    title: 'Craftsmanship',
    description:
      'Inside the fictional MAISON VÉRANE atelier: hand finishing, case tolerances, bevelling, material studies and the slow work behind the Aéroform collection.',
    path: '/craftsmanship',
    image: '/assets/images/craft-atelier-1600.webp',
  })

  return (
    <div className="craft-page">
      {/* Hero */}
      <section className="craft-hero">
        <div className="craft-hero__media">
          <Media
            imageKey="craft-atelier"
            alt="A watchmaker at the bench, working on a movement under a warm lamp"
            orientation="wide"
            sizes="100vw"
            priority
          />
        </div>
        <div className="craft-hero__overlay" aria-hidden="true" />
        <div className="container craft-hero__content">
          <p className="eyebrow" style={{ color: 'rgba(242,236,226,.65)' }}>
            The atelier · Volume I
          </p>
          <RevealText as="h1" immediate delay={0.1}>
            <Line>Made slowly,</Line>
            <Line>
              by <em>hand.</em>
            </Line>
          </RevealText>
          <p className="craft-hero__sub">
            Nine people, four benches, and a rule that has not changed: nothing leaves the atelier
            until it is finished on every surface, including the ones you will never see.
          </p>
        </div>
        <p className="craft-hero__caption micro">Atelier study · finishing bench, morning light</p>
      </section>

      {/* Intro */}
      <section className="section section--lg craft-intro">
        <div className="container">
          <div className="craft-intro__grid">
            <RevealSection>
              <p className="eyebrow">
                <span className="eyebrow__num">00</span> The argument
              </p>
              <RevealText as="h2" className="craft-intro__title">
                <Line>Finishing is</Line>
                <Line>the part that</Line>
                <Line>cannot be hurried.</Line>
              </RevealText>
            </RevealSection>
            <RevealSection className="craft-intro__copy" stagger>
              <p className="lede">
                A machine can cut a case to tolerance. It cannot decide when the light along a
                chamfer is right. That decision belongs to a person, and it is made slowly.
              </p>
              <p className="prose">
                This is a fictional atelier, described honestly as such. The processes below are
                written from real watchmaking practice, but no real maison, workshop or craftsperson
                is represented here.
              </p>
              <div className="craft-intro__stats">
                {[
                  ['9', 'people at the bench'],
                  ['4', 'hours per bracelet'],
                  ['11', 'weeks per skeleton'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <span className="serif">{n}</span>
                    <span className="micro">{l}</span>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="section craft-chapters" id="materials">
        <div className="container">
          <RevealSection className="section-head">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__num">01</span> Four disciplines
              </p>
              <RevealText as="h2">
                <Line>The work,</Line>
                <Line>in order.</Line>
              </RevealText>
            </div>
            <div className="section-head__aside">
              <p className="prose" style={{ fontSize: '0.95rem' }}>
                Each reference passes through the same four sets of hands: case, dial, movement and
                finishing.
              </p>
            </div>
          </RevealSection>

          <div className="craft-chapters__list">
            {craftsmanshipChapters.map((chapter, i) => (
              <article
                key={chapter.id}
                id={chapter.id}
                className={`craft-chapter ${i % 2 === 1 ? 'is-reverse' : ''}`}
              >
                <RevealSection className="craft-chapter__media">
                  <Media
                    imageKey={chapter.imageKey}
                    alt={chapter.alt}
                    orientation="square"
                    ratio={i === 1 ? 'square' : 'portrait'}
                    sizes="(min-width: 900px) 42vw, 92vw"
                  />
                </RevealSection>
                <RevealSection className="craft-chapter__copy" stagger>
                  <div className="craft-chapter__top">
                    <span className="craft-chapter__index">{chapter.index}</span>
                    <span className="eyebrow eyebrow--plain">{chapter.eyebrow}</span>
                  </div>
                  <h3>{chapter.title}</h3>
                  <p className="prose">{chapter.body}</p>
                  <p className="micro craft-chapter__meta">{chapter.meta}</p>
                </RevealSection>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned sequence */}
      <div id="finishing">
        <MaterialSequence />
      </div>

      {/* Film — scrubbed by scroll */}
      <ScrollFilm
        posterKey="craft-atelier"
        posterAlt="A watchmaker at the bench under a warm lamp"
        src={assetUrl('assets/video/atelier-loop.mp4')}
        eyebrow="A short film"
        heading="The bench, at working pace."
        chapters={[
          { at: 0, title: 'Before the first cut', copy: 'The case is drawn at arm’s length, then checked again against the wrist.' },
          { at: 0.34, title: 'One direction', copy: 'Brushing follows a single axis, so highlights travel rather than break.' },
          { at: 0.67, title: 'The last chamfer', copy: 'The polished edge is the final operation, and the one most often repeated.' },
        ]}
        id="film"
      />

      {/* Closing */}
      <section className="section section--lg craft-cta">
        <div className="container craft-cta__inner">
          <RevealSection className="craft-cta__copy" stagger>
            <p className="eyebrow">See the work in person</p>
            <h2>
              The bench is
              <br />
              <em>open by appointment.</em>
            </h2>
            <p className="prose">
              Ateliers in Paris and Geneva receive clients by arrangement. In this prototype the
              booking is simulated, but the interest is real.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link to="/appointments" className="btn">
                <span>Arrange a visit</span>
              </Link>
              <Link to="/watchmaking" className="btn btn--outline">
                <span>Read the movements</span>
              </Link>
            </div>
          </RevealSection>
          <RevealSection className="craft-cta__aside">
            <Media
              imageKey="service-engraving"
              alt="An engraver cutting a monogram into a watch caseback"
              orientation="square"
              ratio="square"
              sizes="(min-width: 900px) 32vw, 92vw"
            />
            <p className="micro">Hand engraving · caseback study</p>
          </RevealSection>
        </div>
      </section>
    </div>
  )
}
