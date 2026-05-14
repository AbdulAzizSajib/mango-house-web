'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ShippingForm from '@/components/mango/ShippingForm'
import OrderConfirmation from '@/components/mango/OrderConfirmation'
import Footer from '@/components/mango/Footer'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, deliveryType, submittedOrder, setDeliveryType, resetOrder, subtotal, deliveryCost, total } = useCartStore()
  const confirmationRef = useRef<HTMLDivElement>(null)

  const hasOrdered = submittedOrder !== null
  const hasItems = cart.size > 0

  // If the user lands here with an empty cart and no completed order, bounce home.
  useEffect(() => {
    if (!hasItems && !hasOrdered) router.replace('/')
  }, [hasItems, hasOrdered, router])

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
      {/* Slim header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/75 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            শপে ফিরে যান
          </Link>
          <div className="leading-tight text-right">
            <p className="font-display text-base sm:text-lg font-medium text-foreground">চেকআউট</p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mt-0.5">
              Checkout
            </p>
          </div>
        </div>
      </header>

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
