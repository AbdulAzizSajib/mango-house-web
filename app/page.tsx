'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import HeroSection from '@/components/mango/HeroSection'
import ProductSection from '@/components/mango/ProductSection'
import Testimonials from '@/components/mango/Testimonials'
import MangoCareGuide from '@/components/mango/MangoCareGuide'
import FAQ from '@/components/mango/FAQ'
import OrderSummary from '@/components/mango/OrderSummary'
import Footer from '@/components/mango/Footer'
import { useCartStore } from '@/store/useCartStore'

// Keep these exported so other components can import the types
export interface CartItem {
  variety: string
  name: string
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
  const router = useRouter()
  const { cart, deliveryType, submittedOrder, updateCart, pricePerKg, subtotal, deliveryCost, total } = useCartStore()

  const productSectionRef = useRef<HTMLDivElement>(null)

  const scrollToProducts = () => productSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  const goToCheckout = () => router.push('/checkout')

  const hasOrdered = submittedOrder !== null

  return (
    <main className="w-full min-h-screen bg-background">
      <HeroSection onShopNowClick={scrollToProducts} />

      <div ref={productSectionRef}>
        <ProductSection cart={cart} updateCart={updateCart} deliveryType={deliveryType} pricePerKg={pricePerKg()} />
      </div>

      <Testimonials />
      <MangoCareGuide />
      <FAQ />
      <Footer />

      {!hasOrdered && (
        <OrderSummary
          cart={cart}
          subtotal={subtotal()}
          deliveryCost={deliveryCost()}
          total={total()}
          deliveryType={deliveryType}
          onProceedClick={goToCheckout}
        />
      )}
    </main>
  )
}
