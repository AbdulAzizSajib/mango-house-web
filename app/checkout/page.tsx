'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/mango/Navbar'
import ShippingForm from '@/components/mango/ShippingForm'
import OrderConfirmation from '@/components/mango/OrderConfirmation'
import Footer from '@/components/mango/Footer'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, deliveryType, submittedOrder, setDeliveryType, resetOrder, subtotal, deliveryCost, total, _hasHydrated } = useCartStore()
  const confirmationRef = useRef<HTMLDivElement>(null)

  const hasOrdered = submittedOrder !== null
  const hasItems = cart.size > 0

  useEffect(() => {
    if (!_hasHydrated) return
    if (!hasItems && !hasOrdered) router.replace('/')
  }, [_hasHydrated, hasItems, hasOrdered, router])

  const handleOrderSuccess = () => {
    setTimeout(() => {
      confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handlePlaceAnotherOrder = () => {
    resetOrder()
    router.push('/')
  }

  return (
    <main className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1">
        {hasItems && !hasOrdered && (
          <ShippingForm
            deliveryType={deliveryType}
            onDeliveryTypeChange={setDeliveryType}
            orderSummary={{ subtotal: subtotal(), deliveryCost: deliveryCost(), total: total() }}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {hasOrdered && submittedOrder && (
          <div ref={confirmationRef}>
            <OrderConfirmation order={submittedOrder} onPlaceAnotherOrder={handlePlaceAnotherOrder} />
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
