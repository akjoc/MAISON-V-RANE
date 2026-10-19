import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Icon } from '../components/primitives/Icon'
import { watchmakingChapters } from '../data/editorial'
import { scrollToTarget } from '../hooks/useLenis'

/* ——— Original cutaway diagram ——————————————————————————— */

const parts = [
  {
    id: 'crystal',
    label: 'Sapphire crystal',
    copy: 'Domed sapphire, double anti-reflective coating. 1.2 mm thick at the centre and polished on both faces.',
    x: 300,
    y: 96,
  },
  {
    id: 'dial',
    label: 'Dial & indices',
    copy: 'A 0.4 mm brass dial, brushed in a single pass. Indices are applied by hand and seated to 0.02 mm.',
    x: 300,
    y: 176,
  },
  {
    id: 'movement',
    label: 'Calibre MV·01',
    copy: 'Automatic movement with a 72-hour reserve, asymmetric barrel bridge and 168 components.',
    x: 300,
    y: 262,
  },
  {
    id: 'case',
    label: 'Cushion case',
    copy: 'Machined from 316L steel in nine operations, then finished in three: satin, fine satin and mirror chamfer.',
    x: 132,
    y: 230,
  },
  {
    id: 'crown',
    label: 'Fluted crown',
    copy: 'Screw-down crown, fluted at 0.4 mm pitch, set with a 3 mm oxblood cabochon.',
    x: 462,
    y: 230,
  },
]

function WatchCutaway() {
  const [active, setActive] = useState<string>('movement')
  const part = parts.find((p) => p.id === active) ?? parts[0]

  return (
    <div className="cutaway">
      <div className="cutaway__stage">
        <svg
          viewBox="0 0 600 400"
          role="img"
          aria-label="Technical cutaway diagram of the Aéroform watch, with labelled components"
          className="cutaway__svg"
        >
          <defs>
            <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dedbd2" />
              <stop offset="45%" stopColor="#b3b0a7" />
              <stop offset="100%" stopColor="#8f8c83" />
            </linearGradient>
            <linearGradient id="dial" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4b4943" />
              <stop offset="100%" stopColor="#2c2b27" />
            </linearGradient>
            <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d8c39a" />
              <stop offset="100%" stopColor="#a58a5d" />
            </linearGradient>
          </defs>

          {/* Ground line */}
          <line x1="60" y1="352" x2="540" y2="352" stroke="#c9c3b5" strokeWidth="1" />
          <line x1="60" y1="358" x2="540" y2="358" stroke="#d8d2c5" strokeWidth="0.5" />

          {/* Case section outlines */}
          <rect x="110" y="150" width="380" height="34" fill="url(#steel)" />
          <rect x="110" y="184" width="380" height="12" fill="#cfccc3" />
          <rect x="110" y="196" width="380" height="86" fill="url(#steel)" />
          <rect x="110" y="282" width="380" height="18" fill="#bab7ae" />
          <rect x="90" y="150" width="22" height="150" fill="url(#steel)" />
          <rect x="488" y="150" width="22" height="150" fill="url(#steel)" />

          {/* Crystal */}
          <path d="M140 150 Q300 108 460 150" fill="none" stroke="#9d9a92" strokeWidth="1.2" />
          <path d="M140 150 Q300 116 460 150" fill="rgba(224,236,236,0.35)" stroke="#b9c9c9" strokeWidth="0.9" />

          {/* Dial plate */}
          <rect x="136" y="164" width="328" height="10" fill="url(#dial)" />
          {[172, 205, 238, 271, 304, 337, 370, 403, 436].map((x) => (
            <line key={x} x1={x} y1="164" x2={x} y2="174" stroke="#e4dfd3" strokeWidth="0.8" />
          ))}

          {/* Movement */}
          <rect x="140" y="206" width="320" height="70" fill="#2b2a26" />
          <rect x="152" y="216" width="118" height="50" fill="url(#brass)" opacity="0.92" />
          <rect x="282" y="216" width="72" height="50" fill="#3a3833" stroke="#c3a878" strokeWidth="0.8" />
          <circle cx="318" cy="241" r="20" fill="none" stroke="#c3a878" strokeWidth="0.9" />
          <circle cx="318" cy="241" r="6" fill="#c3a878" opacity="0.7" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI * 2
            return (
              <line
                key={i}
                x1={318 + Math.cos(angle) * 8}
                y1={241 + Math.sin(angle) * 8}
                x2={318 + Math.cos(angle) * 18}
                y2={241 + Math.sin(angle) * 18}
                stroke="#d8c7a4"
                strokeWidth="1"
              />
            )
          })}
          {[366, 390, 414, 438].map((x) => (
            <circle key={x} cx={x} cy="226" r="3.2" fill="#7c2b30" />
          ))}
          <rect x="152" y="270" width="300" height="6" fill="#4a4842" />

          {/* Crown */}
          <rect x="510" y="216" width="16" height="34" fill="url(#steel)" />
          <rect x="526" y="220" width="14" height="26" rx="3" fill="#b9b6ad" />
          <circle cx="548" cy="233" r="6" fill="#5e1a1f" />

          {/* Lugs */}
          <path d="M200 300 L196 330 L236 330 L232 300 Z" fill="url(#steel)" />
          <path d="M400 300 L404 330 L364 330 L368 300 Z" fill="url(#steel)" />

          {/* Dimension line */}
          <line x1="110" y1="340" x2="490" y2="340" stroke="#a8a397" strokeWidth="0.7" strokeDasharray="3 3" />
          <line x1="110" y1="334" x2="110" y2="346" stroke="#a8a397" strokeWidth="0.7" />
          <line x1="490" y1="334" x2="490" y2="346" stroke="#a8a397" strokeWidth="0.7" />
          <text x="300" y="336" textAnchor="middle" fontSize="9" letterSpacing="1.4" fill="#8a857a">
            40.0 mm
          </text>

          {/* Callouts */}
          {parts.map((p, i) => (
            <g key={p.id}>
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x + (i % 2 === 0 ? -40 : 40)}
                y2={p.y - 34}
                stroke="#8a857a"
                strokeWidth="0.7"
              />
              <circle cx={p.x} cy={p.y} r="3.4" fill={active === p.id ? '#5e1a1f' : '#8a857a'} />
              <circle cx={p.x} cy={p.y} r="7" fill="none" stroke={active === p.id ? '#5e1a1f' : '#c9c3b5'} strokeWidth="0.8" />
            </g>
          ))}
        </svg>

        <div className="cutaway__hotspots" role="group" aria-label="Diagram components">
          {parts.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`cutaway__hotspot ${active === p.id ? 'is-active' : ''}`}
              style={{ left: `${(p.x / 600) * 100}%`, top: `${(p.y / 400) * 100}%` }}
              onClick={() => setActive(p.id)}
              aria-pressed={active === p.id}
              aria-label={`${p.label} component`}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      <div className="cutaway__panel" role="status" aria-live="polite">
        <p className="eyebrow eyebrow--plain">{part.id.toUpperCase()}</p>
        <h3>{part.label}</h3>
        <p>{part.copy}</p>
        <p className="micro">Original technical illustration · stylised section, not to scale</p>
      </div>
    </div>
  )
}

export default function Watchmaking() {
  useSeo({
    title: 'Watchmaking',
    description:
      'An educational overview of the fictional Aéroform calibre: movement, case, dial, finishing and design innovation, with an original interactive cutaway diagram.',
    path: '/watchmaking',
    image: '/assets/images/macro-dial-1200.webp',
  })

  return (
    <div className="watchmaking-page">
      <section className="wm-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Watchmaking</span>
          </nav>
          <div className="wm-hero__grid">
            <RevealText as="h1" immediate>
              <Line>Anatomy</Line>
              <Line>of an</Line>
              <Line>
                instrument<em>.</em>
              </Line>
            </RevealText>
            <RevealSection className="wm-hero__aside" stagger>
              <p className="lede">
                Five chapters on how an Aéroform is made: the movement, the case, the dial, the
                finishing and the small engineering decisions that hold them together.
              </p>
              <p className="micro">Educational content · fictional calibre · all specifications mock</p>
              <a href="#cutaway" className="text-link">
                Jump to the cutaway <Icon name="arrow-down" size={14} />
              </a>
            </RevealSection>
          </div>
        </div>
        <div className="wm-hero__figure">
          <Media
            imageKey="movement-macro"
            alt="Macro study of the fictional MV·01 movement with champagne bridges and blued screws"
            orientation="square"
            ratio="cinema"
            sizes="100vw"
            priority
          />
        </div>
      </section>

      <section className="section wm-chapters" id="cutaway">
        <div className="container">
          <div className="wm-chapters__layout">
            <aside className="wm-index" aria-label="Chapters">
              <p className="micro">Chapters</p>
              <ol>
                {watchmakingChapters.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => scrollToTarget(`#${c.id}`, -100)}>
                      <span className="wm-index__numeral">{c.numeral}</span>
                      <span>{c.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="wm-index__note">
                <p className="micro">Also</p>
                <Link to="/craftsmanship" className="text-link">
                  The atelier <Icon name="arrow-right" size={12} />
                </Link>
              </div>
            </aside>

            <div className="wm-chapters__body">
              <RevealSection className="wm-cutaway-block">
                <p className="eyebrow">
                  <span className="eyebrow__num">00</span> Interactive
                </p>
                <h2>The watch, in section</h2>
                <p className="prose" style={{ marginBottom: '2rem' }}>
                  Select a component to read how it is made. This is an original, stylised technical
                  illustration — not an engineering drawing or a 3D model.
                </p>
                <WatchCutaway />
              </RevealSection>

              {watchmakingChapters.map((chapter, i) => (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  className={`wm-chapter ${i % 2 === 1 ? 'is-reverse' : ''}`}
                >
                  <RevealSection className="wm-chapter__media">
                    <Media
                      imageKey={chapter.imageKey}
                      alt={chapter.alt}
                      orientation="square"
                      ratio="square"
                      sizes="(min-width: 900px) 34vw, 92vw"
                    />
                    <p className="micro" style={{ marginTop: '0.6rem' }}>
                      Fig. {chapter.numeral} · {chapter.title}
                    </p>
                  </RevealSection>
                  <RevealSection className="wm-chapter__copy" stagger>
                    <div className="wm-chapter__head">
                      <span className="wm-chapter__numeral">{chapter.numeral}</span>
                      <span className="eyebrow eyebrow--plain">{chapter.title}</span>
                    </div>
                    <h3>{chapter.lead}</h3>
                    <p className="prose">{chapter.body}</p>
                    <dl className="wm-specs">
                      {chapter.specs.map(([label, value]) => (
                        <div key={label}>
                          <dt className="micro">{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </RevealSection>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section wm-cta">
        <div className="container wm-cta__inner">
          <RevealSection className="wm-cta__copy" stagger>
            <p className="eyebrow">Continue</p>
            <h2>
              A movement is only
              <br />
              <em>half the watch.</em>
            </h2>
            <p className="prose">
              The case, dial and bracelet are made by different hands in the same building. Read how
              they are finished, or arrange to see the bench.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link to="/craftsmanship" className="btn">
                <span>Read craftsmanship</span>
              </Link>
              <Link to="/appointments" className="btn btn--outline">
                <span>Arrange a visit</span>
              </Link>
            </div>
          </RevealSection>
          <RevealSection className="wm-cta__aside">
            <p className="micro">Further reading</p>
            <Link to="/faq" className="wm-cta__link">
              <span className="serif">Frequently asked</span>
              <Icon name="arrow-up-right" size={16} />
            </Link>
            <Link to="/services/care-repair" className="wm-cta__link">
              <span className="serif">Care &amp; repair</span>
              <Icon name="arrow-up-right" size={16} />
            </Link>
            <Link to="/watches" className="wm-cta__link">
              <span className="serif">The six references</span>
              <Icon name="arrow-up-right" size={16} />
            </Link>
          </RevealSection>
        </div>
      </section>
    </div>
  )
}
