import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Icon } from '../components/primitives/Icon'

export function NotFound() {
  useSeo({
    title: 'Page not found',
    description: 'The page you were looking for could not be found in this prototype.',
    path: '/404',
    noindex: true,
  })

  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <p className="eyebrow">Error 404</p>
        <h1>
          This passage
          <br />
          leads nowhere.
        </h1>
        <p className="lede">
          The page you were looking for has been moved, retired, or never existed in this
          fictional maison. Return to the collection and begin again.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link to="/" className="btn">
            <span>Return to the maison</span>
          </Link>
          <Link to="/watches" className="btn btn--outline">
            <span>
              View timepieces <Icon name="arrow-right" size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
