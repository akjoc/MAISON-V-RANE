import { RevealSection } from '../primitives/RevealSection'
import '../../styles/cartier-sections.css'

interface CodeItem {
  num: string
  title: string
  desc: string
  image: string
  alt: string
  tall?: boolean
}

const columnLeft: CodeItem[] = [
  {
    num: '01 · Silhouette',
    title: 'The Aerodynamic Contour',
    desc: 'Machined from a single block of stainless steel 316L, brushed in one continuous pass from lug to lug so light flows in an unbroken stream.',
    image: '/assets/images/hero-vertical-1024.webp',
    alt: 'Full view of the Aéroform watch silhouette',
    tall: true,
  },
  {
    num: '03 · Ergonomics',
    title: 'Anatomic Wrist Profile',
    desc: 'The cushion geometry curves at four calculated points, allowing the watch to drape flush against the carpal curve without bulk.',
    image: '/assets/images/aeroform-graphite-case-1200.webp',
    alt: 'Profile view showing ergonomic curved case',
  },
]

const columnRight: CodeItem[] = [
  {
    num: '02 · Crown & Chamfer',
    title: 'The Fluted Crown & Bezel',
    desc: 'A knurled winding crown tipped with a hand-polished oxblood cabochon, framed by a high-polish 45° chamfered minute bezel.',
    image: '/assets/images/macro-case-1200.webp',
    alt: 'Macro view of the fluted crown and polished chamfer',
  },
  {
    num: '04 · Quick-Release',
    title: 'Interchangeable Bracelet System',
    desc: 'Integrated H-link links with concealed push-pieces, enabling a swift transition between hand-stitched leather and solid steel.',
    image: '/assets/images/macro-bracelet-1200.webp',
    alt: 'Macro view of the integrated bracelet connection and caseback',
    tall: true,
  },
]

export function RoadsterDesignCodes() {
  return (
    <section className="rd-codes" id="design-codes">
      <div className="container">
        <RevealSection className="rd-codes__head">
          <span className="rd-codes__eyebrow">The Roadster Codes</span>
          <h2 className="rd-codes__title">Sculpted in the Service of Form</h2>
          <p className="rd-codes__desc">
            Borrowing the streamlined fuselage and aerodynamic curves of mid-century grand tourers,
            Aéroform unites mechanical discipline with sculptural elegance.
          </p>
        </RevealSection>

        <div className="rd-codes__grid">
          {/* Left Column */}
          <div className="rd-codes__col">
            {columnLeft.map((item) => (
              <RevealSection key={item.num} className="rd-card" stagger>
                <div className={`rd-card__media ${item.tall ? 'rd-card__media--tall' : ''}`}>
                  <img src={item.image} alt={item.alt} className="rd-card__img" loading="lazy" />
                </div>
                <div className="rd-card__body">
                  <span className="rd-card__num">{item.num}</span>
                  <h3 className="rd-card__heading">{item.title}</h3>
                  <p className="rd-card__text">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Right Column (Offset like Cartier) */}
          <div className="rd-codes__col rd-codes__col--offset">
            {columnRight.map((item) => (
              <RevealSection key={item.num} className="rd-card" stagger>
                <div className={`rd-card__media ${item.tall ? 'rd-card__media--tall' : ''}`}>
                  <img src={item.image} alt={item.alt} className="rd-card__img" loading="lazy" />
                </div>
                <div className="rd-card__body">
                  <span className="rd-card__num">{item.num}</span>
                  <h3 className="rd-card__heading">{item.title}</h3>
                  <p className="rd-card__text">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
