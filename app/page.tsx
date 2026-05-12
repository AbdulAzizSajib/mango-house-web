'use client'

import { useState, useRef } from 'react'
import HeroSection from '@/components/mango/HeroSection'
import StatsBar from '@/components/mango/StatsBar'
import ProductSection from '@/components/mango/ProductSection'
import AboutSection from '@/components/mango/AboutSection'
import HowItWorks from '@/components/mango/HowItWorks'
import Guarantees from '@/components/mango/Guarantees'
import Testimonials from '@/components/mango/Testimonials'
import MangoCareGuide from '@/components/mango/MangoCareGuide'
import FAQ from '@/components/mango/FAQ'
import OrderSummary from '@/components/mango/OrderSummary'
import ShippingForm from '@/components/mango/ShippingForm'
import OrderConfirmation from '@/components/mango/OrderConfirmation'
import Footer from '@/components/mango/Footer'

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

const COURIER_PRICE_PER_KG = 80
const HOME_PRICE_PER_KG = 95

export default function Home() {
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map())
  const [deliveryType, setDeliveryType] = useState<'courier' | 'home'>('courier')
  const [submittedOrder, setSubmittedOrder] = useState<{
    items: CartItem[]
    orderData: OrderData
    total: number
  } | null>(null)

  const productSectionRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)

  const pricePerKg = deliveryType === 'home' ? HOME_PRICE_PER_KG : COURIER_PRICE_PER_KG

  const updateCart = (variety: string, quantity: number) => {
    const newCart = new Map(cart)
    if (quantity === 0) {
      newCart.delete(variety)
    } else {
      newCart.set(variety, { variety, quantity, price: pricePerKg })
    }
    setCart(newCart)
  }

  const handleDeliveryTypeChange = (type: 'courier' | 'home') => {
    setDeliveryType(type)
    // update existing cart items with new price
    const newCart = new Map<string, CartItem>()
    cart.forEach((item, key) => {
      newCart.set(key, { ...item, price: type === 'home' ? HOME_PRICE_PER_KG : COURIER_PRICE_PER_KG })
    })
    setCart(newCart)
  }

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFormSubmit = (orderData: OrderData) => {
    const items = Array.from(cart.values())
    setSubmittedOrder({ items, orderData, total })
    setTimeout(() => {
      confirmationRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const handlePlaceAnotherOrder = () => {
    setCart(new Map())
    setSubmittedOrder(null)
    setDeliveryType('courier')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const subtotal = Array.from(cart.values()).reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal
  const hasOrdered = submittedOrder !== null
  const hasItems = cart.size > 0

  return (
    <main className="w-full min-h-screen bg-background">
      <HeroSection onShopNowClick={scrollToProducts} />

      {/* <StatsBar /> */}

      <div ref={productSectionRef}>
        <ProductSection cart={cart} updateCart={updateCart} deliveryType={deliveryType} pricePerKg={pricePerKg} />
      </div>

      {/* <AboutSection /> */}

      <HowItWorks />

      <Guarantees />

      <Testimonials />

      <MangoCareGuide />

      {hasItems && !hasOrdered && (
        <div ref={checkoutRef}>
          <ShippingForm
            onSubmit={handleFormSubmit}
            deliveryType={deliveryType}
            onDeliveryTypeChange={handleDeliveryTypeChange}
            orderSummary={{ subtotal, total }}
          />

        </div>
      )}

      {hasOrdered && submittedOrder && (
        <div ref={confirmationRef}>
          <OrderConfirmation
            items={submittedOrder.items}
            orderData={submittedOrder.orderData}
            total={submittedOrder.total}
            onPlaceAnotherOrder={handlePlaceAnotherOrder}
          />
        </div>
      )}

      <FAQ />

      <Footer />

      {!hasOrdered && (
        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          total={total}
          deliveryType={deliveryType}
          onProceedClick={scrollToCheckout}
        />
      )}
    </main>
  )
}
