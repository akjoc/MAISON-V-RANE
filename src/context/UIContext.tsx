import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

export interface Toast {
  id: number
  message: string
  tone: 'default' | 'success' | 'error'
}

interface UIValue {
  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  navOpen: boolean
  openNav: () => void
  closeNav: () => void
  bagOpen: boolean
  openBag: () => void
  closeBag: () => void
  toasts: Toast[]
  pushToast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

const UIContext = createContext<UIValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const location = useLocation()

  const pushToast = useCallback((message: string, tone: Toast['tone'] = 'default') => {
    counter.current += 1
    const id = counter.current
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Close transient surfaces on navigation.
  useEffect(() => {
    setSearchOpen(false)
    setNavOpen(false)
    setBagOpen(false)
  }, [location.pathname, location.search])

  const value = useMemo<UIValue>(
    () => ({
      searchOpen,
      openSearch: () => {
        setNavOpen(false)
        setSearchOpen(true)
      },
      closeSearch: () => setSearchOpen(false),
      navOpen,
      openNav: () => {
        setSearchOpen(false)
        setNavOpen(true)
      },
      closeNav: () => setNavOpen(false),
      bagOpen,
      openBag: () => setBagOpen(true),
      closeBag: () => setBagOpen(false),
      toasts,
      pushToast,
      dismissToast,
    }),
    [searchOpen, navOpen, bagOpen, toasts, pushToast, dismissToast],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
