'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

const CART_STORAGE_KEY = 'lebenskunst-cart'

export type CartItemType = 'shop-item' | 'bundle'

export interface CartItem {
  id: string
  type: CartItemType
  itemType?: string // seminar, workshop, video, audio, buch etc.
  name: string
  price: number
  quantity: number
  image?: string
  slug: string
  installmentEnabled?: boolean
  installmentCount?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  hasInstallmentItems: boolean
}

const CartContext = createContext<CartContextType | null>(null)

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage not available
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(loadCartFromStorage())
    setIsHydrated(true)
  }, [])

  // Persist to localStorage on change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(items)
    }
  }, [items, isHydrated])

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id)
      if (existing) {
        // Events, trainings and bundles can only be added once
        const singleTypes = ['seminar', 'workshop', 'vortrag', 'einzeltraining', 'kunst']
        if (newItem.type === 'bundle' || singleTypes.includes(newItem.itemType || '')) {
          return prev
        }
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id))
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    try { localStorage.removeItem(CART_STORAGE_KEY) } catch { /* noop */ }
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasInstallmentItems = items.some((item) => item.installmentEnabled)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, hasInstallmentItems }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
