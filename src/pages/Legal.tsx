import { Link, useParams } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { NotFound } from './NotFound'

const SECTIONS: Record<string, { title: string; intro: string; blocks: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy notice',
    intro:
      'This is a design prototype. No personal data submitted through the forms on this site is transmitted, stored on a server, sold or shared. The notices below describe a fictional maison policy for context only.',
    blocks: [
      { heading: 'What this prototype stores', body: 'Wishlist items, bag contents, your region preference, recent searches, a saved configuration and a simulated session are stored in your browser’s local or session storage. You can clear them at any time through the demonstration controls or your browser settings.' },
      { heading: 'What it does not collect', body: 'No email addresses, appointment requests, repair requests or checkout details are sent anywhere. No payment information is requested or stored. No analytics or advertising scripts are loaded.' },
      { heading: 'A live maison policy', body: 'For reference only: a real maison would process contact details to respond to enquiries and orders, retain service records for warranty purposes, and offer access, correction and deletion rights. Consult a qualified adviser before relying on any policy text.' },
    ],
  },
  terms: {
    title: 'Terms of use',
    intro: 'This website is an original fictional design demonstration created for portfolio and evaluation purposes. MAISON VÉRANE is not a real company.',
    blocks: [
      { heading: 'No commercial offer', body: 'All products, references, prices, specifications, availability, boutiques, services and lead times are invented. Nothing on this site constitutes an offer for sale.' },
      { heading: 'Intellectual property', body: 'The design, copy, generated imagery and code of this prototype are original. Any resemblance to existing watch brands is unintended and no third-party campaign photography, branding or artwork has been reproduced.' },
      { heading: 'Limitation', body: 'The prototype is provided as-is for demonstration. No warranty is given as to accuracy or fitness for purpose.' },
    ],
  },
  cookies: {
    title: 'Cookies & storage',
    intro: 'No advertising or analytics cookies are used. The prototype uses browser storage only to make interactions persist between page loads.',
    blocks: [
      { heading: 'Local storage', body: 'Keys prefixed mv. hold your wishlist, bag, region, recent searches, saved configuration and the last simulated order. They remain until cleared.' },
      { heading: 'Session storage', body: 'The demonstration account session is held in session storage and ends when the browser tab is closed.' },
      { heading: 'Clearing data', body: 'Clearing site data in your browser removes all of the above. You can also empty the bag or remove wishlist items using the controls provided.' },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    intro: 'The prototype aims to meet WCAG 2.2 AA in its core journeys. Some decorative motion and speculative 3D content are deliberately optional.',
    blocks: [
      { heading: 'Semantic structure', body: 'Pages use one main landmark, a single H1 and a logical heading order. Navigation, search, filters and dialogs are keyboard operable with visible focus indicators.' },
      { heading: 'Motion & media', body: 'prefers-reduced-motion disables smooth scrolling and decorative animation, and stops the hero film. Video has controls, a poster fallback and no audio requirement. The 3D viewer is opt-in with an image alternative.' },
      { heading: 'Known limitations', body: 'This is a prototype: some third-party content and generated imagery may fall short of full conformance. Feedback is welcome via the contact page (demonstration form).' },
    ],
  },
}

export default function Legal() {
  const { section = '' } = useParams()
  const data = SECTIONS[section]

  useSeo({
    title: data ? data.title : 'Legal',
    description: data?.intro ?? 'Legal information for this fictional prototype.',
    path: `/legal/${section}`,
    noindex: true,
  })

  if (!data) return <NotFound />

  return (
    <div className="legal-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">{data.title}</span>
          </nav>
          <h1 style={{ marginTop: '1.5rem', fontSize: 'var(--step-4)' }}>{data.title}</h1>
          <p className="lede" style={{ marginTop: '1.25rem' }}>{data.intro}</p>
        </header>
        <div className="legal-body">
          {data.blocks.map((block) => (
            <section key={block.heading}>
              <h2>{block.heading}</h2>
              <p>{block.body}</p>
            </section>
          ))}
          <p className="field__hint">Last updated: demonstration build, 2026. This text is illustrative and not legal advice.</p>
          <div className="legal-nav">
            {Object.entries(SECTIONS).filter(([key]) => key !== section).map(([key, value]) => (
              <Link key={key} to={`/legal/${key}`} className="text-link">{value.title}</Link>
            ))}
            <Link to="/contact" className="text-link">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
