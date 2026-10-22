import { useEffect } from 'react'

interface SeoInput {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

const SITE = 'MAISON VÉRANE'
/** Fallback used only when there is no browser location (SSR, tests). */
const FALLBACK_ORIGIN = 'https://maisonverane.example'

/**
 * Absolute URL for a route or asset.
 *
 * The origin comes from the running page, so canonical and social URLs are
 * correct whether the site is served from localhost, a custom domain, or the
 * GitHub Pages project subpath ('/MAISON-V-RANE/').
 */
function absoluteUrl(path: string): string {
  const origin =
    typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
      ? window.location.origin
      : FALLBACK_ORIGIN
  const base = import.meta.env.BASE_URL // always ends with '/'
  const clean = path.replace(/^\/+/, '')
  return `${origin}${base}${clean}`
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Client-side metadata for the prototype. */
export function useSeo({ title, description, path, image, type = 'website', noindex }: SeoInput) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE}`
    const canonical = absoluteUrl(path)
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    if (image) {
      const absolute = image.startsWith('http') ? image : absoluteUrl(image)
      setMeta('meta[property="og:image"]', 'property', 'og:image', absolute)
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absolute)
    }
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex,nofollow' : 'index,follow',
    )
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
  }, [title, description, path, image, type, noindex])
}
