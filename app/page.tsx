'use client'

import { useRef } from 'react'
import HeroSection from '@/components/mango/HeroSection'
import ProductSection from '@/components/mango/ProductSection'

import Testimonials from '@/components/mango/Testimonials'
import MangoCareGuide from '@/components/mango/MangoCareGuide'
import FAQ from '@/components/mango/FAQ'
import OrderSummary from '@/components/mango/OrderSummary'
import ShippingForm from '@/components/mango/ShippingForm'
import OrderConfirmation from '@/components/mango/OrderConfirmation'
import Footer from '@/components/mango/Footer'
import { useCartStore } from '@/store/useCartStore'

// Keep these exported so other components can import the types
export interface CartItem {
  variety: string
  quantity: number
  price: number
}

export interface OrderData {
  fullName: string
  phone: string
  deliveryType: 'courier' | 'home'
  address: string
  city: string
  deliveryDate: string
  notes?: string
}

export default function Home() {
  const { cart, deliveryType, submittedOrder, updateCart, setDeliveryType, resetOrder, pricePerKg, subtotal, total } = useCartStore()

  const productSectionRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)

  const scrollToProducts = () => productSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToCheckout = () => checkoutRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleOrderSuccess = () => {
    setTimeout(() => {
      confirmationRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const handlePlaceAnotherOrder = () => {
    resetOrder()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasOrdered = submittedOrder !== null
  const hasItems = cart.size > 0

  return (
    <main className="w-full min-h-screen bg-background">
      <HeroSection onShopNowClick={scrollToProducts} />

      <div ref={productSectionRef}>
        <ProductSection cart={cart} updateCart={updateCart} deliveryType={deliveryType} pricePerKg={pricePerKg()} />
      </div>

    
      <Testimonials />
      <MangoCareGuide />

      {hasItems && !hasOrdered && (
        <div ref={checkoutRef}>
          <ShippingForm
            deliveryType={deliveryType}
            onDeliveryTypeChange={setDeliveryType}
            orderSummary={{ subtotal: subtotal(), total: total() }}
            onOrderSuccess={handleOrderSuccess}
          />
        </div>
      )}

      {hasOrdered && submittedOrder && (
        <div ref={confirmationRef}>
          <OrderConfirmation
            order={submittedOrder}
            onPlaceAnotherOrder={handlePlaceAnotherOrder}
          />
        </div>
      )}

      <FAQ />
      <Footer />

      {!hasOrdered && (
        <OrderSummary
          cart={cart}
          subtotal={subtotal()}
          total={total()}
          deliveryType={deliveryType}
          onProceedClick={scrollToCheckout}
        />
      )}
    </main>
  )
}
