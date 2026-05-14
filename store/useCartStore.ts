import { create } from 'zustand'
import type { OrderResponse } from '@/lib/api'

const PRICE_PER_KG = 80
const HOME_SURCHARGE_PER_KG = 15

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
  totalKg: () => number
  subtotal: () => number
  deliveryCost: () => number
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

  // Product price is flat — delivery is a separate line.
  pricePerKg: () => PRICE_PER_KG,

  totalKg: () => {
    let kg = 0
    get().cart.forEach((item) => { kg += item.quantity })
    return kg
  },

  subtotal: () => {
    let sum = 0
    get().cart.forEach((item) => { sum += item.price * item.quantity })
    return sum
  },

  deliveryCost: () =>
    get().deliveryType === 'home' ? get().totalKg() * HOME_SURCHARGE_PER_KG : 0,

  total: () => get().subtotal() + get().deliveryCost(),

  updateCart: (variety, quantity, name) => {
    set((state) => {
      const newCart = new Map(state.cart)
      if (quantity === 0) {
        newCart.delete(variety)
      } else {
        const existing = state.cart.get(variety)
        newCart.set(variety, {
          variety,
          name: name ?? existing?.name ?? variety,
          quantity,
          price: PRICE_PER_KG,
        })
      }
      return { cart: newCart }
    })
  },

  setDeliveryType: (type) => set({ deliveryType: type }),

  setSubmittedOrder: (order) => set({ submittedOrder: order }),

  resetOrder: () => set({ cart: new Map(), deliveryType: 'courier', submittedOrder: null }),
}))
