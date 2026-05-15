import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
  _hasHydrated: boolean

  // computed
  pricePerKg: () => number
  totalKg: () => number
  subtotal: () => number
  deliveryCost: () => number
  total: () => number

  // actions
  setHydrated: () => void
  updateCart: (variety: string, quantity: number, name?: string) => void
  setDeliveryType: (type: 'courier' | 'home') => void
  setSubmittedOrder: (order: OrderResponse['data']) => void
  clearCart: () => void
  resetOrder: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: new Map(),
      deliveryType: 'courier',
      submittedOrder: null,
      _hasHydrated: false,

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

      setHydrated: () => set({ _hasHydrated: true }),

      setDeliveryType: (type) => set({ deliveryType: type }),

      setSubmittedOrder: (order) => set({ submittedOrder: order }),

      clearCart: () => set({ cart: new Map(), deliveryType: 'courier' }),

      resetOrder: () => set({ cart: new Map(), deliveryType: 'courier', submittedOrder: null }),
    }),
    {
      name: 'mango-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
      partialize: (state) => ({
        cart: Array.from(state.cart.entries()),
        deliveryType: state.deliveryType,
        submittedOrder: state.submittedOrder,
      }),
      merge: (persisted, current) => {
        const p = persisted as {
          cart: [string, CartItem][]
          deliveryType: 'courier' | 'home'
          submittedOrder: OrderResponse['data'] | null
        }
        return {
          ...current,
          cart: new Map(p.cart ?? []),
          deliveryType: p.deliveryType ?? 'courier',
          submittedOrder: p.submittedOrder ?? null,
        }
      },
    }
  )
)

