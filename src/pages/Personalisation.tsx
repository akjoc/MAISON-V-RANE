import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Icon } from '../components/primitives/Icon'
import { useUI } from '../context/UIContext'
import { readJSON, writeJSON } from '../lib/storage'

type EngravingStyle = 'serif' | 'monogram'

interface SavedConfig {
  reference: string
  strapId: string
  engraving: string
  style: EngravingStyle
  date: string
}

function EngravingPreview({
  engraving,
  style,
  name,
}: {
  engraving: string
  style: EngravingStyle
  name: string
}) {
  const text = engraving.trim().toUpperCase().slice(0, 18)
  return (
    <div className="engrave">
      <svg viewBox="0 0 360 360" role="img" aria-label={`Caseback engraving preview: ${text || 'no text yet'}, ${style} style`}>
        <defs>
          <radialGradient id="cb-steel" cx="38%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#efede6" />
            <stop offset="45%" stopColor="#cfccc3" />
            <stop offset="100%" stopColor="#a5a29a" />
          </radialGradient>
          <path id="cb-arc-top" d="M 58 180 A 122 122 0 0 1 302 180" />
          <path id="cb-arc-bottom" d="M 70 200 A 110 110 0 0 0 290 200" />
        </defs>
        <circle cx="180" cy="180" r="168" fill="url(#cb-steel)" stroke="#9a978e" strokeWidth="1" />
        <circle cx="180" cy="180" r="156" fill="none" stroke="#b6b3aa" strokeWidth="0.7" />
        <circle cx="180" cy="180" r="128" fill="none" stroke="#aeaba2" strokeWidth="0.6" />
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2
          const inner = i % 6 === 0 ? 148 : 152
          return (
            <line
              key={i}
              x1={180 + Math.cos(a) * inner}
              y1={180 + Math.sin(a) * inner}
              x2={180 + Math.cos(a) * 156}
              y2={180 + Math.sin(a) * 156}
              stroke="#8f8c83"
              strokeWidth={i % 6 === 0 ? 0.9 : 0.5}
            />
          )
        })}
        {/* concentric brushing */}
        {Array.from({ length: 22 }).map((_, i) => (
          <circle
            key={`c-${i}`}
            cx="180"
            cy="180"
            r={40 + i * 4.2}
            fill="none"
            stroke="#8f8c83"
            strokeWidth="0.25"
            opacity="0.35"
          />
        ))}
        <text fontSize="8.5" letterSpacing="3.2" fill="#6e6b63" fontFamily="Jost, sans-serif">
          <textPath href="#cb-arc-top" startOffset="50%" textAnchor="middle">
            MAISON VÉRANE · AÉROFORM
          </textPath>
        </text>
        <text fontSize="7" letterSpacing="2.4" fill="#6e6b63" fontFamily="Jost, sans-serif">
          <textPath href="#cb-arc-bottom" startOffset="50%" textAnchor="middle">
            {name.toUpperCase()} · FICTIONAL DEMONSTRATION
          </textPath>
        </text>
        {text ? (
          <>
            <text
              x="180"
              y="176"
              textAnchor="middle"
              fontSize={style === 'serif' ? 22 : 18}
              letterSpacing={style === 'serif' ? 4 : 6}
              fill="#4a4841"
              fontFamily={style === 'serif' ? 'Cormorant Garamond, serif' : 'Jost, sans-serif'}
            >
              {text}
            </text>
            {style === 'monogram' && (
              <path d="M120 196 h120" stroke="#8f8c83" strokeWidth="0.7" />
            )}
          </>
        ) : (
          <text
            x="180"
            y="176"
            textAnchor="middle"
            fontSize="10"
            letterSpacing="2"
            fill="#8f8c83"
            fontFamily="Jost, sans-serif"
          >
            YOUR ENGRAVING
          </text>
        )}
        <circle cx="180" cy="180" r="6" fill="none" stroke="#8f8c83" strokeWidth="0.7" />
      </svg>
      <p className="micro engrave__note">
        Stylised preview · actual engraving is cut by hand and will vary slightly
      </p>
    </div>
  )
}

export default function Personalisation() {
  const { pushToast } = useUI()
  const [productId, setProductId] = useState(products[0].id)
  const [strapId, setStrapId] = useState(products[0].straps[0].id)
  const [engraving, setEngraving] = useState('')
  const [style, setStyle] = useState<EngravingStyle>('serif')
  const [saved, setSaved] = useState<SavedConfig | null>(() => readJSON<SavedConfig | null>('mv.config', null))

  useSeo({
    title: 'Personalisation',
    description:
      'Configure a fictional Aéroform: choose a reference and strap, preview a hand-engraved caseback and save the configuration in your browser.',
    path: '/services/personalisation',
    image: '/assets/images/service-engraving-1200.webp',
  })

  const product = products.find((p) => p.id === productId) ?? products[0]
  const strap = product.straps.find((s) => s.id === strapId) ?? product.straps[0]

  const total = useMemo(() => {
    const engravingFee = engraving.trim() ? 240 : 0
    return product.price + strap.surcharge + engravingFee
  }, [product, strap, engraving])

  const save = () => {
    const config: SavedConfig = {
      reference: product.name,
      strapId,
      engraving: engraving.trim().toUpperCase(),
      style,
      date: new Date().toISOString(),
    }
    writeJSON('mv.config', config)
    setSaved(config)
    pushToast('Configuration saved in this browser. Nothing was sent to the maison.', 'success')
  }

  return (
    <div className="personal-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <Link to="/services">Services</Link>
            <span className="sep">/</span>
            <span aria-current="page">Personalisation</span>
          </nav>
          <div className="personal-intro">
            <RevealText as="h1" immediate>
              <Line>Made</Line>
              <Line>
                singular<em>.</em>
              </Line>
            </RevealText>
            <div className="personal-intro__copy">
              <p className="lede">
                A strap, a direction of the dial, a few words on the caseback. Personalisation is not
                decoration — it is the part of the watch that belongs only to you.
              </p>
              <p className="micro">Working local-state configurator · no data leaves this browser</p>
            </div>
          </div>
        </header>

        <div className="configurator" id="configurator">
          <div className="configurator__stage">
            <div className="configurator__preview">
              <EngravingPreview engraving={engraving} style={style} name={product.name} />
            </div>
            <div className="configurator__product">
              <Media
                imageKey={product.images.primary.key}
                alt={product.images.primary.alt}
                orientation="square"
                ratio="square"
                sizes="(min-width: 900px) 22vw, 42vw"
              />
              <div>
                <p className="micro">{product.ref}</p>
                <p className="serif" style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{product.name}</p>
                <p className="small">{strap.name}</p>
              </div>
            </div>
          </div>

          <div className="configurator__panel">
            <div className="configurator__head">
              <p className="eyebrow eyebrow--plain">Configuration</p>
              <p className="micro">Step 1 of 1 · saved locally</p>
            </div>

            <fieldset className="cfg-field">
              <legend className="cfg-legend">Reference</legend>
              <div className="cfg-options">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`cfg-option ${p.id === product.id ? 'is-active' : ''}`}
                    aria-pressed={p.id === product.id}
                    onClick={() => {
                      setProductId(p.id)
                      setStrapId(p.straps[0].id)
                    }}
                  >
                    <span className="cfg-option__swatch" style={{ background: p.dialHex }} aria-hidden="true" />
                    <span>{p.name.replace('Aéroform ', '')}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="cfg-field">
              <legend className="cfg-legend">Strap</legend>
              <div className="cfg-options">
                {product.straps.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`cfg-option ${s.id === strap.id ? 'is-active' : ''}`}
                    aria-pressed={s.id === strap.id}
                    onClick={() => setStrapId(s.id)}
                  >
                    <span className="cfg-option__swatch" style={{ background: s.swatch }} aria-hidden="true" />
                    <span>{s.name}</span>
                    <span className="cfg-option__price">
                      {s.surcharge > 0 ? `+${formatPrice(s.surcharge, product.currency)}` : 'incl.'}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="cfg-field">
              <label className="cfg-legend" htmlFor="engraving">
                Caseback engraving <span className="micro">Optional · up to 18 characters</span>
              </label>
              <input
                id="engraving"
                className="input"
                value={engraving}
                maxLength={18}
                placeholder="e.g. FOR A. 1987"
                onChange={(e) => setEngraving(e.target.value.replace(/[^\w\s.&'’-]/g, ''))}
                aria-describedby="engraving-hint"
              />
              <p className="field__hint" id="engraving-hint">
                {engraving.length}/18 characters · letters, numerals and simple punctuation only.
                Engraving is +{formatPrice(240, product.currency)} when requested.
              </p>
            </div>

            <fieldset className="cfg-field">
              <legend className="cfg-legend">Engraving style</legend>
              <div className="cfg-options">
                <button
                  type="button"
                  className={`cfg-option ${style === 'serif' ? 'is-active' : ''}`}
                  aria-pressed={style === 'serif'}
                  onClick={() => setStyle('serif')}
                >
                  <span className="serif" style={{ fontSize: '1.05rem' }}>Serif</span>
                </button>
                <button
                  type="button"
                  className={`cfg-option ${style === 'monogram' ? 'is-active' : ''}`}
                  aria-pressed={style === 'monogram'}
                  onClick={() => setStyle('monogram')}
                >
                  <span style={{ letterSpacing: '0.14em', fontSize: '0.8rem' }}>MONOGRAM</span>
                </button>
              </div>
            </fieldset>

            <div className="cfg-total">
              <div>
                <span className="micro">Configured value</span>
                <p className="serif tabular" style={{ fontSize: '1.8rem' }}>
                  {formatPrice(total, product.currency)}
                </p>
              </div>
              <span className="demo-note">Demonstration</span>
            </div>

            <div className="cfg-actions">
              <button type="button" className="btn" onClick={save}>
                <span>Save configuration</span>
              </button>
              <Link to="/appointments" className="btn btn--outline">
                <span>Discuss by appointment</span>
              </Link>
            </div>

            {saved && (
              <div className="form-status form-status--success" role="status">
                <Icon name="check" size={16} />
                <span>
                  Saved locally at {new Date(saved.date).toLocaleTimeString()} — {saved.reference},{' '}
                  {saved.style === 'serif' ? 'serif' : 'monogram'} engraving
                  {saved.engraving ? ` “${saved.engraving}”` : ''}. This is a demonstration: nothing
                  was ordered or transmitted.
                </span>
              </div>
            )}
            <p className="field__hint">
              No payment is taken and no commission is created. To discuss a real personalisation,
              arrange an appointment with a specialist.
            </p>
          </div>
        </div>

        <section className="section personal-notes">
          <div className="personal-notes__grid">
            {[
              {
                title: 'Engraving',
                copy: 'Cut by hand with a burin on the solid steel caseback, then filled or left bright. Most inscriptions take three weeks.',
                meta: 'Hand-cut · 3 weeks',
              },
              {
                title: 'Straps',
                copy: 'Six references in the archive, all fitted with the tool-free release. Sizing and fitting are complimentary in salon.',
                meta: 'Six archive references',
              },
              {
                title: 'Dials',
                copy: 'Directional dials can be requested in the oxblood or champagne finish. Each commission is reviewed by the atelier before it is accepted.',
                meta: 'Atelier review · 11 weeks',
              },
            ].map((item) => (
              <RevealSection key={item.title} className="personal-note">
                <p className="micro">{item.meta}</p>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
              </RevealSection>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
