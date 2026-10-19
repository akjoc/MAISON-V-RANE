import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { NavPanel } from './NavPanel'
import { SearchOverlay } from './SearchOverlay'
import { BagDrawer } from './BagDrawer'
import { Toasts } from './Toasts'
import { MotionNotice } from './MotionNotice'
import { useSmoothScroll, scrollToTop } from '../../hooks/useLenis'
import { gsap, ScrollTrigger } from '../../lib/motion'

function useScrollManager() {
  const location = useLocation()
  useEffect(() => {
    const hash = location.hash
    if (!hash) {
      scrollToTop(true)
      return
    }
    // Allow the new page to mount, then move to the requested section.
    const t = window.setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 90
        scrollToTop(true)
        window.scrollTo({ top: y, behavior: 'auto' })
        ScrollTrigger.refresh()
      }
    }, 260)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.search, location.hash])
}

export function Layout() {
  useSmoothScroll()
  useScrollManager()
  const mainRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    const node = mainRef.current
    if (!node) return
    const tween = gsap.fromTo(
      node,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'transform' },
    )
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 320)
    return () => {
      tween.kill()
      window.clearTimeout(refresh)
    }
  }, [location.pathname])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
      <NavPanel />
      <SearchOverlay />
      <BagDrawer />
      <Toasts />
      <MotionNotice />
    </>
  )
}
