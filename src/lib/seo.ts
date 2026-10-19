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
const BASE = 'https://maisonverane.example'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Client-side metadata for the prototype. Replace BASE with the live domain. */
export function useSeo({ title, description, path, image, type = 'website', noindex }: SeoInput) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE}`
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${BASE}${path}`)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    if (image) {
      const absolute = image.startsWith('http') ? image : `${BASE}${image}`
      setMeta('meta[property="og:image"]', 'property', 'og:image', absolute)
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absolute)
    }
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex,nofollow' : 'index,follow',
    )
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${BASE}${path}`
  }, [title, description, path, image, type, noindex])
}
