import { useId, useState, type FormEvent } from 'react'
import { Icon } from '../primitives/Icon'
import { useUI } from '../../context/UIContext'

interface NewsletterFormProps {
  variant?: 'footer' | 'inline'
  compact?: boolean
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'subscribed'>('idle')
  const id = useId()
  const { pushToast } = useUI()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Please enter an email address.')
      return
    }
    if (!EMAIL.test(value)) {
      setError('That email address does not look complete.')
      return
    }
    setError(null)
    setStatus('subscribed')
    pushToast('Subscribed locally. No data was sent to a server.', 'success')
  }

  if (status === 'subscribed') {
    return (
      <div className="newsletter" role="status">
        <p className="form-status form-status--success" style={{ borderColor: 'rgba(242,236,226,.3)', background: 'rgba(242,236,226,.06)', color: 'rgba(242,236,226,.85)' }}>
          <Icon name="check" size={16} />
          <span>
            Thank you — your address has been saved in this browser only. This is a demonstration;
            no correspondence will be sent.
          </span>
        </p>
        <button type="button" className="text-link" style={{ color: 'rgba(242,236,226,.6)', width: 'fit-content' }} onClick={() => { setStatus('idle'); setEmail('') }}>
          Use another address
        </button>
      </div>
    )
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate>
      <label htmlFor={id} className="visually-hidden">
        Email address
      </label>
      <div className="newsletter__row">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : `${id}-note`}
        />
        <button type="submit">
          Subscribe <Icon name="arrow-right" size={14} />
        </button>
      </div>
      {error && (
        <p className="field__error" id={`${id}-error`} style={{ color: '#d9a5a2' }}>
          {error}
        </p>
      )}
      {!compact && (
        <p className="newsletter__note" id={`${id}-note`}>
          Correspondence on new chapters and atelier notes. Demonstration form — nothing is sent.
        </p>
      )}
    </form>
  )
}
