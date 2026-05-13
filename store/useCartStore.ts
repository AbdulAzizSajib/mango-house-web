import { create } from 'zustand'
import type { OrderResponse } from '@/lib/api'

const COURIER_PRICE = 80
const HOME_PRICE = 95

export interface CartItem {
  variety: string
  name: string
  quantity: number
  price: number
}

interface CartStore {
  cart: Map<string, CartItem>
  deliveryType: 'courier' | 'home'
  submittedOrder: OrderResponse['data'] | null

  // computed
  pricePerKg: () => number
  subtotal: () => number
  total: () => number

  // actions
  updateCart: (variety: string, quantity: number, name?: string) => void
  setDeliveryType: (type: 'courier' | 'home') => void
  setSubmittedOrder: (order: OrderResponse['data']) => void
  resetOrder: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: new Map(),
  deliveryType: 'courier',
  submittedOrder: null,

  pricePerKg: () => (get().deliveryType === 'home' ? HOME_PRICE : COURIER_PRICE),

  subtotal: () => {
    let sum = 0
    get().cart.forEach((item) => { sum += item.price * item.quantity })
    return sum
  },

  total: () => get().subtotal(),

  updateCart: (variety, quantity, name) => {
    const price = get().pricePerKg()
    set((state) => {
      const newCart = new Map(state.cart)
      if (quantity === 0) {
        newCart.delete(variety)
      } else {
        const existing = state.cart.get(variety)
        newCart.set(variety, { variety, name: name ?? existing?.name ?? variety, quantity, price })
      }
      return { cart: newCart }
    })
  },

  setDeliveryType: (type) => {
    const newPrice = type === 'home' ? HOME_PRICE : COURIER_PRICE
    set((state) => {
      const newCart = new Map<string, CartItem>()
      state.cart.forEach((item, key) => {
        newCart.set(key, { ...item, price: newPrice })
      })
      return { deliveryType: type, cart: newCart }
    })
  },

  setSubmittedOrder: (order) => set({ submittedOrder: order }),

  resetOrder: () => set({ cart: new Map(), deliveryType: 'courier', submittedOrder: null }),
}))
