export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
export const PHONE_RE = /^[+()\d][\d\s().-]{6,}$/

export function required(value: string): string | null {
  return value.trim().length === 0 ? 'This field is required.' : null
}

export function emailError(value: string): string | null {
  if (!value.trim()) return 'Please enter an email address.'
  if (!EMAIL_RE.test(value.trim())) return 'Please enter a valid email address.'
  return null
}

export function phoneError(value: string, optional = true): string | null {
  if (!value.trim()) return optional ? null : 'Please enter a phone number.'
  if (!PHONE_RE.test(value.trim())) return 'Please enter a valid phone number.'
  return null
}

export function demoReference(prefix: string): string {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${new Date().getFullYear()}-${n}`
}

export function todayISO(): string {
  const d = new Date()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
