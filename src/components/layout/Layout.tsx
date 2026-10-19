import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { NavPanel } from './NavPanel'
import { SearchOverlay } from './SearchOverlay'
import { BagDrawer } from './BagDrawer'
import { Toasts } from './Toasts'
import { MotionNotice } from './MotionNotice'
import { useSmoothScroll, scrollToTop } from '../../hooks/useLenis'

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
      }
    }, 260)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.search, location.hash])
}

export function Layout() {
  useSmoothScroll()
  useScrollManager()
  const location = useLocation()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" key={location.pathname} className="page-enter">
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
