import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { useStore } from '../context/StoreContext'
import { Icon } from '../components/primitives/Icon'
import { emailError } from '../lib/validation'
import { readJSON, removeKey } from '../lib/storage'
import { formatPrice } from '../lib/format'

interface Session {
  name: string
  email: string
  since: string
}

interface DemoOrder {
  ref: string
  total: number
  email: string
  date: string
  items: { name: string; qty: number }[]
}

const SESSION_KEY = 'mv.session'

export default function Account() {
  const { wishlist, cartCount } = useStore()
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as Session) : null
    } catch {
      return null
    }
  })
  const order = readJSON<DemoOrder | null>('mv.lastOrder', null)

  useSeo({
    title: 'Demo account',
    description: 'A transparent demonstration account interface. Authentication is simulated in the browser.',
    path: '/account',
    noindex: true,
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (mode === 'register' && !name.trim()) next.name = 'Please enter a name for the demo profile.'
    const em = emailError(email)
    if (em) next.email = em
    if (password.length < 8) next.password = 'Use at least 8 characters (any characters — this is a demo).'
    setErrors(next)
    if (Object.keys(next).length) return
    const nextSession: Session = {
      name: mode === 'register' ? name.trim() : email.split('@')[0].replace(/[._-]/g, ' '),
      email: email.trim(),
      since: new Date().toISOString(),
    }
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    } catch {
      /* ignore storage failures */
    }
    setSession(nextSession)
    setPassword('')
  }

  const signOut = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* no-op */
    }
    removeKey('mv.session')
    setSession(null)
    setEmail('')
    setName('')
  }

  return (
    <div className="account-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Account</span>
          </nav>
          <div className="account-intro">
            <h1>{session ? <>Your <em>account.</em></> : <>A private <em>register.</em></>}</h1>
            <div>
              <p className="lede">
                In a live maison, an account would keep your service history, saved pieces and
                correspondence in one place.
              </p>
              <div className="demo-note" style={{ marginTop: '0.75rem' }}>Demonstration authentication · no real credentials</div>
            </div>
          </div>
        </header>

        {session ? (
          <div className="account-panel">
            <aside className="account-profile">
              <p className="eyebrow eyebrow--plain">Client</p>
              <h2>{session.name || 'Demo client'}</h2>
              <p className="small">{session.email}</p>
              <span className="micro">Session started {new Date(session.since).toLocaleString()}</span>
              <div className="account-profile__badge">
                <Icon name="lock" size={14} />
                <span>Demo session · stored in this tab only</span>
              </div>
              <button type="button" className="btn btn--outline btn--small" onClick={signOut}>
                <span>Sign out</span>
              </button>
            </aside>

            <div className="account-main">
              <div className="account-stats">
                <Link to="/wishlist" className="account-stat">
                  <span className="serif">{wishlist.length}</span>
                  <span className="micro">Saved pieces</span>
                  <Icon name="arrow-up-right" size={15} />
                </Link>
                <Link to="/cart" className="account-stat">
                  <span className="serif">{cartCount}</span>
                  <span className="micro">Items in bag</span>
                  <Icon name="arrow-up-right" size={15} />
                </Link>
                <Link to="/appointments" className="account-stat">
                  <span className="serif">01</span>
                  <span className="micro">Upcoming (mock) appointment</span>
                  <Icon name="arrow-up-right" size={15} />
                </Link>
              </div>

              <section className="account-orders">
                <div className="account-orders__head">
                  <h2>Orders</h2>
                  <span className="micro">Demonstration only</span>
                </div>
                {order ? (
                  <div className="account-order">
                    <div>
                      <p className="micro">Reference</p>
                      <p>{order.ref}</p>
                    </div>
                    <div>
                      <p className="micro">Placed</p>
                      <p>{new Date(order.date).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div>
                      <p className="micro">Items</p>
                      <p>{order.items.map((i) => `${i.name} ×${i.qty}`).join(', ') || '—'}</p>
                    </div>
                    <div>
                      <p className="micro">Total</p>
                      <p className="tabular">{formatPrice(order.total)}</p>
                    </div>
                    <span className="pflag">Simulated</span>
                  </div>
                ) : (
                  <p className="small">
                    No simulated orders yet. Complete the demonstration checkout to see a record
                    appear here.
                  </p>
                )}
              </section>

              <section className="account-links">
                <Link to="/services/care-repair" className="account-link">
                  <span className="serif">Request care &amp; repair</span>
                  <Icon name="arrow-right" size={15} />
                </Link>
                <Link to="/services/personalisation" className="account-link">
                  <span className="serif">Personalise a piece</span>
                  <Icon name="arrow-right" size={15} />
                </Link>
                <Link to="/boutiques" className="account-link">
                  <span className="serif">Find a boutique</span>
                  <Icon name="arrow-right" size={15} />
                </Link>
              </section>
            </div>
          </div>
        ) : (
          <div className="account-auth">
            <div className="account-auth__intro">
              <p className="eyebrow">Forget the password entirely</p>
              <h2>This sign-in is a demonstration.</h2>
              <p className="prose">
                No credentials are verified, no account exists and nothing is sent anywhere. Any
                valid-looking email and an eight-character password will open the demo register.
                Passwords are never written to storage.
              </p>
              <ul className="account-auth__notes">
                <li><Icon name="check" size={14} /><span>Client-side validation only</span></li>
                <li><Icon name="check" size={14} /><span>Session lives in this browser tab</span></li>
                <li><Icon name="check" size={14} /><span>Wishlist and bag remain local</span></li>
              </ul>
              <Link to="/services/care-repair" className="text-link">
                Continue as a guest <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            <div className="account-form-wrap">
              <div className="account-tabs" role="tablist" aria-label="Account mode">
                <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'is-active' : ''} onClick={() => { setMode('signin'); setErrors({}) }}>
                  Sign in
                </button>
                <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'is-active' : ''} onClick={() => { setMode('register'); setErrors({}) }}>
                  Create demo profile
                </button>
              </div>

              <form onSubmit={submit} noValidate>
                <div className="form-grid">
                  {mode === 'register' && (
                    <div className="field span-2">
                      <label className="field__label" htmlFor="ac-name">Name for the demo profile</label>
                      <input id="ac-name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} />
                      {errors.name && <p className="field__error">{errors.name}</p>}
                    </div>
                  )}
                  <div className="field span-2">
                    <label className="field__label" htmlFor="ac-email">Email</label>
                    <input id="ac-email" type="email" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} />
                    {errors.email && <p className="field__error">{errors.email}</p>}
                  </div>
                  <div className="field span-2">
                    <label className="field__label" htmlFor="ac-pass">Password</label>
                    <input id="ac-pass" type="password" className="input" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby="ac-pass-hint" />
                    <p className="field__hint" id="ac-pass-hint">Not stored or transmitted. Any eight characters will do.</p>
                    {errors.password && <p className="field__error">{errors.password}</p>}
                  </div>
                </div>
                <button type="submit" className="btn btn--full" style={{ marginTop: '1.25rem' }}>
                  <span>{mode === 'signin' ? 'Enter the demo register' : 'Create demo profile'}</span>
                </button>
                <p className="field__hint" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  This is not a real account and grants no client benefits.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
