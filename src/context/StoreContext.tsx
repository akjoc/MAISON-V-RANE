import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { productById, products } from '../data/products'
import { readJSON, writeJSON } from '../lib/storage'
import type { BasketLine, CartLine, Product } from '../types'

const WISHLIST_KEY = 'mv.wishlist.v1'
const CART_KEY = 'mv.cart.v1'

interface CartState {
  lines: BasketLine[]
}

type CartAction =
  | { type: 'add'; line: BasketLine }
  | { type: 'remove'; key: string }
  | { type: 'quantity'; key: string; quantity: number }
  | { type: 'clear' }

const lineKey = (l: BasketLine) => `${l.productId}::${l.strapId}`

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line)
      const existing = state.lines.find((l) => lineKey(l) === key)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            lineKey(l) === key
              ? { ...l, quantity: Math.min(5, l.quantity + action.line.quantity) }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, { ...action.line, quantity: Math.min(5, action.line.quantity) }] }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => lineKey(l) !== action.key) }
    case 'quantity':
      return {
        lines: state.lines.map((l) =>
          lineKey(l) === action.key
            ? { ...l, quantity: Math.max(1, Math.min(5, action.quantity)) }
            : l,
        ),
      }
    case 'clear':
      return { lines: [] }
    default:
      return state
  }
}

export interface StoreValue {
  cart: CartLine[]
  cartCount: number
  subtotal: number
  addToBag: (product: Product, strapId: string, quantity?: number) => void
  removeLine: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
  clearBag: () => void
  wishlist: string[]
  isSaved: (id: string) => boolean
  toggleWishlist: (id: string) => boolean
  removeSaved: (id: string) => void
  /** Transient message shown after adding to bag / saving. */
  feedback: string | null
  clearFeedback: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({
    lines: readJSON<BasketLine[]>(CART_KEY, []),
  }))
  const [wishlist, setWishlist] = useState<string[]>(() => readJSON<string[]>(WISHLIST_KEY, []))
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    writeJSON(CART_KEY, state.lines)
  }, [state.lines])

  useEffect(() => {
    writeJSON(WISHLIST_KEY, wishlist)
  }, [wishlist])

  useEffect(() => {
    if (!feedback) return
    const t = window.setTimeout(() => setFeedback(null), 4200)
    return () => window.clearTimeout(t)
  }, [feedback])

  const cart = useMemo<CartLine[]>(
    () =>
      state.lines.map((l) => ({
        ...l,
        key: lineKey(l),
      })),
    [state.lines],
  )

  const subtotal = useMemo(() => {
    return cart.reduce((total, line) => {
      const product = productById(line.productId)
      if (!product) return total
      const strap = product.straps.find((s) => s.id === line.strapId)
      return total + (product.price + (strap?.surcharge ?? 0)) * line.quantity
    }, 0)
  }, [cart])

  const cartCount = useMemo(
    () => cart.reduce((n, line) => n + line.quantity, 0),
    [cart],
  )

  const addToBag = useCallback((product: Product, strapId: string, quantity = 1) => {
    dispatch({ type: 'add', line: { productId: product.id, strapId, quantity } })
    setFeedback(`${product.name} added to your bag — demonstration only.`)
  }, [])

  const removeLine = useCallback((key: string) => {
    dispatch({ type: 'remove', key })
    setFeedback('Piece removed from your bag.')
  }, [])

  const setQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: 'quantity', key, quantity })
  }, [])

  const clearBag = useCallback(() => dispatch({ type: 'clear' }), [])

  const toggleWishlist = useCallback(
    (id: string) => {
      const product = productById(id)
      const saved = wishlist.includes(id)
      setWishlist((prev) => (saved ? prev.filter((x) => x !== id) : [...prev, id]))
      setFeedback(
        saved
          ? `${product?.name ?? 'Piece'} removed from your wishlist.`
          : `${product?.name ?? 'Piece'} saved to your wishlist.`,
      )
      return !saved
    },
    [wishlist],
  )

  const removeSaved = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((x) => x !== id))
    setFeedback('Removed from your wishlist.')
  }, [])

  const value: StoreValue = {
    cart,
    cartCount,
    subtotal,
    addToBag,
    removeLine,
    setQuantity,
    clearBag,
    wishlist,
    isSaved: (id: string) => wishlist.includes(id),
    toggleWishlist,
    removeSaved,
    feedback,
    clearFeedback: () => setFeedback(null),
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

/** Convenience selector used by search and cross-sell panels. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.ref,
      p.dial,
      p.material,
      p.tagline,
      p.summary,
      p.availabilityLabel,
    ]
      .join(' ')
      .toLowerCase()
    return q.split(/\s+/).every((token) => haystack.includes(token))
  })
}
