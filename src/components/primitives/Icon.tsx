import type { ReactNode, SVGProps } from 'react'

type IconName =
  | 'search'
  | 'bag'
  | 'heart'
  | 'heart-filled'
  | 'close'
  | 'plus'
  | 'minus'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'arrow-down'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'check'
  | 'grid'
  | 'list'
  | 'filter'
  | 'map-pin'
  | 'play'
  | 'pause'
  | 'sound-on'
  | 'sound-off'
  | 'rotate'
  | 'lock'
  | 'instagram'
  | 'mail'
  | 'phone'
  | 'sparkle'

const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 21 21" />
    </>
  ),
  bag: (
    <>
      <path d="M5 7.5h14l-1 13.5H6L5 7.5Z" />
      <path d="M8.75 7.5V6a3.25 3.25 0 0 1 6.5 0v1.5" />
    </>
  ),
  heart: <path d="M12 20s-7.2-4.5-7.2-9.4A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.2 2.9C19.2 15.5 12 20 12 20Z" />,
  'heart-filled': (
    <path
      d="M12 20s-7.2-4.5-7.2-9.4A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.2 2.9C19.2 15.5 12 20 12 20Z"
      fill="currentColor"
    />
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  'arrow-right': (
    <>
      <path d="M3.5 12h17" />
      <path d="m14.5 6 6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M20.5 12h-17" />
      <path d="m9.5 6-6 6 6 6" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M6.5 17.5 17.5 6.5" />
      <path d="M8 6.5h9.5V16" />
    </>
  ),
  'arrow-down': (
    <>
      <path d="M12 3.5v17" />
      <path d="m6 14.5 6 6 6-6" />
    </>
  ),
  'chevron-down': <path d="m5 9 7 7 7-7" />,
  'chevron-left': <path d="m15 5-7 7 7 7" />,
  'chevron-right': <path d="m9 5 7 7-7 7" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" />
    </>
  ),
  list: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  filter: (
    <>
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s6.5-6.1 6.5-11a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  play: <path d="M8.5 5.5 18 12l-9.5 6.5v-13Z" />,
  pause: (
    <>
      <path d="M9 5.5v13" />
      <path d="M15 5.5v13" />
    </>
  ),
  'sound-on': (
    <>
      <path d="M4.5 9.5h3L12 5.5v13L7.5 14.5h-3v-5Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  'sound-off': (
    <>
      <path d="M4.5 9.5h3L12 5.5v13L7.5 14.5h-3v-5Z" />
      <path d="m16 9.5 5 5" />
      <path d="m21 9.5-5 5" />
    </>
  ),
  rotate: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.9" cy="7.1" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" />
      <path d="m3.6 6.4 8.4 6.4 8.4-6.4" />
    </>
  ),
  phone: <path d="M7 3.5h3l1.4 4-2 1.5a11 11 0 0 0 5.6 5.6l1.5-2 4 1.4v3A2.5 2.5 0 0 1 18 19.5C10.6 19.1 4.9 13.4 4.5 6A2.5 2.5 0 0 1 7 3.5Z" />,
  sparkle: (
    <>
      <path d="M12 3.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5 4.2-.7 5.8-2.3 6.5-6.5Z" />
      <path d="M18.5 15.5c.3 1.7.9 2.3 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.2 2.2-.8 2.5-2.5Z" />
    </>
  ),
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
  strokeWidth?: number
}

export function Icon({ name, size = 20, strokeWidth = 1.1, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}

/** The maison's monogram: two chevrons forming a V within a fine rule. */
export function Monogram({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
    >
      <path d="M9.5 10.5 20 29l10.5-18.5" />
      <path d="M14 10.5 20 22l6-11.5" opacity="0.55" />
      <path d="M5 33.5h30" opacity="0.4" />
      <path d="M20 33.5v2.5" opacity="0.4" />
    </svg>
  )
}

export function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <span className={`wordmark${large ? ' wordmark--large' : ''}`}>
      <span className="wordmark__top">Maison</span>
      <span className="wordmark__main">Vérane</span>
      <span className="wordmark__rule" aria-hidden="true" />
    </span>
  )
}
