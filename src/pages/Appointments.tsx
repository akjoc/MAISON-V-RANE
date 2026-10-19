import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { Media } from '../components/primitives/Media'
import { RevealSection } from '../components/primitives/RevealSection'
import { RevealText, Line } from '../components/primitives/RevealText'
import { Icon } from '../components/primitives/Icon'
import { appointmentTypes, boutiques } from '../data/boutiques'
import { demoReference, emailError, phoneError, todayISO } from '../lib/validation'
import { useUI } from '../context/UIContext'

const TIMES = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30']

interface AppointmentState {
  boutiqueId: string
  type: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes: string
  consent: boolean
}

const initial: AppointmentState = {
  boutiqueId: boutiques[0].id,
  type: appointmentTypes[0].id,
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
  consent: false,
}

export default function Appointments() {
  const { pushToast } = useUI()
  const [form, setForm] = useState<AppointmentState>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmation, setConfirmation] = useState<{ ref: string; summary: AppointmentState } | null>(null)

  useSeo({
    title: 'Book an appointment',
    description:
      'Arrange a fictional salon, atelier or video appointment with a MAISON VÉRANE specialist. This booking is a clearly labelled demonstration.',
    path: '/appointments',
    image: '/assets/images/boutique-interior-1600.webp',
  })

  const boutique = boutiques.find((b) => b.id === form.boutiqueId) ?? boutiques[0]
  const type = appointmentTypes.find((t) => t.id === form.type) ?? appointmentTypes[0]
  const minDate = useMemo(() => todayISO(), [])

  const update = <K extends keyof AppointmentState>(key: K, value: AppointmentState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.date) next.date = 'Please choose a date.'
    else if (form.date < minDate) next.date = 'Please choose a date from today onwards.'
    if (!form.time) next.time = 'Please select a time.'
    if (!form.name.trim()) next.name = 'Please enter your name.'
    const em = emailError(form.email)
    if (em) next.email = em
    const ph = phoneError(form.phone, true)
    if (ph) next.phone = ph
    if (!form.consent) next.consent = 'Please confirm you understand the booking is simulated.'
    setErrors(next)
    if (Object.keys(next).length) {
      pushToast('Please check the highlighted fields.', 'error')
      return
    }
    setConfirmation({ ref: demoReference('APPT'), summary: { ...form } })
    window.setTimeout(() => {
      document.getElementById('appointment-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 60)
  }

  const prettyDate = (iso: string) => {
    if (!iso) return ''
    const d = new Date(`${iso}T12:00:00`)
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="appointments-page">
      <div className="container">
        <header className="page-intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Maison</Link>
            <span className="sep">/</span>
            <span aria-current="page">Appointments</span>
          </nav>
          <div className="appt-intro">
            <RevealText as="h1" immediate>
              <Line>An hour,</Line>
              <Line>
                unhurried<em>.</em>
              </Line>
            </RevealText>
            <div className="appt-intro__copy">
              <p className="lede">
                Choose a salon, a service and a time that suits. A specialist will set out the
                references you would like to see and answer questions without obligation.
              </p>
              <div className="demo-note" style={{ marginTop: '0.5rem' }}>
                Simulated booking · nothing is sent to a real boutique
              </div>
            </div>
          </div>
        </header>

        <div className="appt-layout">
          <RevealSection className="appt-aside" stagger>
            <div className="appt-aside__media">
              <Media
                imageKey="boutique-interior"
                alt="A quiet salon interior with warm light, a table and two chairs"
                orientation="wide"
                ratio="editorial"
                sizes="(min-width: 1024px) 40vw, 92vw"
              />
            </div>
            <div className="appt-aside__details">
              <p className="eyebrow eyebrow--plain">Selected salon</p>
              <h2>{boutique.name}</h2>
              <p className="small">{boutique.addressLine}</p>
              <dl className="appt-aside__list">
                <div>
                  <dt className="micro">Hours</dt>
                  <dd>{boutique.hours}</dd>
                </div>
                <div>
                  <dt className="micro">Services</dt>
                  <dd>{boutique.services.join(' · ')}</dd>
                </div>
                <div>
                  <dt className="micro">Selected service</dt>
                  <dd>{type.label} · {type.duration}</dd>
                </div>
              </dl>
              <p className="field__hint">{boutique.note}</p>
              <p className="field__hint">All boutiques in this prototype are fictional.</p>
            </div>
          </RevealSection>

          <div className="appt-form-wrap">
            {confirmation ? (
              <div className="form-confirm" id="appointment-result" role="status">
                <span className="form-confirm__icon"><Icon name="check" size={22} /></span>
                <p className="eyebrow">Simulated appointment confirmed</p>
                <h2>We will see you, {confirmation.summary.name.split(' ')[0]}.</h2>
                <p>
                  A demonstration appointment has been recorded in this browser only. No email has
                  been sent and no calendar entry exists.
                </p>
                <dl className="confirm-list">
                  <div>
                    <dt className="micro">Reference</dt>
                    <dd>{confirmation.ref}</dd>
                  </div>
                  <div>
                    <dt className="micro">Boutique</dt>
                    <dd>{boutiques.find((b) => b.id === confirmation.summary.boutiqueId)?.name}</dd>
                  </div>
                  <div>
                    <dt className="micro">Date</dt>
                    <dd>{prettyDate(confirmation.summary.date)}</dd>
                  </div>
                  <div>
                    <dt className="micro">Time</dt>
                    <dd>{confirmation.summary.time} · {type.duration}</dd>
                  </div>
                  <div>
                    <dt className="micro">Service</dt>
                    <dd>{type.label}</dd>
                  </div>
                  <div>
                    <dt className="micro">Contact</dt>
                    <dd>{confirmation.summary.email}</dd>
                  </div>
                </dl>
                <div className="form-confirm__note">
                  <Icon name="sparkle" size={15} />
                  <span>
                    This is a demonstration. In a real maison, a confirmation email and a calendar
                    invitation would follow within one working day.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => {
                      setConfirmation(null)
                      setForm(initial)
                    }}
                  >
                    <span>Book another appointment</span>
                  </button>
                  <Link to="/watches" className="btn btn--outline">
                    <span>Browse timepieces</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="appt-form__head">
                  <p className="eyebrow eyebrow--plain">Request an appointment</p>
                  <p className="micro">All fields marked * are required</p>
                </div>

                <div className="form-grid">
                  <div className="field span-2">
                    <label className="field__label" htmlFor="ap-boutique">Boutique or atelier</label>
                    <select
                      id="ap-boutique"
                      className="select"
                      value={form.boutiqueId}
                      onChange={(e) => update('boutiqueId', e.target.value)}
                    >
                      {boutiques.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} · {b.type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field span-2">
                    <label className="field__label" htmlFor="ap-type">Service</label>
                    <select
                      id="ap-type"
                      className="select"
                      value={form.type}
                      onChange={(e) => update('type', e.target.value)}
                    >
                      {appointmentTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.label} · {t.duration}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="ap-date">Date <span className="req">*</span></label>
                    <input
                      id="ap-date"
                      type="date"
                      className="input"
                      min={minDate}
                      value={form.date}
                      onChange={(e) => update('date', e.target.value)}
                      aria-invalid={Boolean(errors.date)}
                      aria-describedby={errors.date ? 'ap-date-error' : undefined}
                    />
                    {errors.date && <p className="field__error" id="ap-date-error">{errors.date}</p>}
                  </div>

                  <div className="field">
                    <span className="field__label" id="ap-time-label">Time <span className="req">*</span></span>
                    <div className="time-slots" role="radiogroup" aria-labelledby="ap-time-label">
                      {TIMES.map((time) => (
                        <button
                          key={time}
                          type="button"
                          role="radio"
                          aria-checked={form.time === time}
                          className={`time-slot ${form.time === time ? 'is-active' : ''}`}
                          onClick={() => update('time', time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {errors.time && <p className="field__error">{errors.time}</p>}
                  </div>

                  <div className="field span-2">
                    <label className="field__label" htmlFor="ap-name">Full name <span className="req">*</span></label>
                    <input
                      id="ap-name"
                      className="input"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'ap-name-error' : undefined}
                      autoComplete="name"
                    />
                    {errors.name && <p className="field__error" id="ap-name-error">{errors.name}</p>}
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="ap-email">Email <span className="req">*</span></label>
                    <input
                      id="ap-email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'ap-email-error' : undefined}
                      autoComplete="email"
                    />
                    {errors.email && <p className="field__error" id="ap-email-error">{errors.email}</p>}
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="ap-phone">Telephone <span className="micro">(optional)</span></label>
                    <input
                      id="ap-phone"
                      type="tel"
                      className="input"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'ap-phone-error' : undefined}
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="field__error" id="ap-phone-error">{errors.phone}</p>}
                  </div>

                  <div className="field span-2">
                    <label className="field__label" htmlFor="ap-notes">Notes <span className="micro">(optional)</span></label>
                    <textarea
                      id="ap-notes"
                      className="textarea"
                      placeholder="References you would like to see, sizing, or anything we should prepare…"
                      value={form.notes}
                      onChange={(e) => update('notes', e.target.value)}
                    />
                  </div>

                  <div className="span-2">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update('consent', e.target.checked)}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'ap-consent-error' : undefined}
                      />
                      <span>
                        I understand this appointment is simulated for a design prototype, that no
                        data is transmitted, and that the boutique is fictional.
                      </span>
                    </label>
                    {errors.consent && <p className="field__error" id="ap-consent-error" style={{ marginTop: 6 }}>{errors.consent}</p>}
                  </div>
                </div>

                <div className="appt-form__foot">
                  <button type="submit" className="btn">
                    <span>Confirm simulated appointment</span>
                  </button>
                  <p className="field__hint">
                    No account required. Nothing will be sent.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        <section className="section appt-notes">
          <div className="appt-notes__grid">
            <RevealSection>
              <p className="eyebrow">What to expect</p>
              <h2>A quiet room and a flat surface</h2>
              <p className="prose">
                Appointments last between thirty and sixty minutes. You will be offered water or
                coffee, a loupe, and as many references as you care to try. There is no obligation
                to purchase and no commission-based pressure.
              </p>
            </RevealSection>
            <RevealSection>
              <p className="eyebrow">Virtual</p>
              <h2>If you would rather not travel</h2>
              <p className="prose">
                Video consultations follow the same structure, with close-up views of the dial,
                caseback and bracelet. Select any salon and note “video” in the notes field.
              </p>
            </RevealSection>
            <RevealSection>
              <p className="eyebrow">Accessibility</p>
              <h2>Tell us what would help</h2>
              <p className="prose">
                Step-free access, a sign-language interpreter, additional time or a quiet room can
                be arranged. Note anything we should prepare in the notes field.
              </p>
            </RevealSection>
          </div>
        </section>
      </div>
    </div>
  )
}
