'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertCircle } from 'lucide-react'
import ProductCard from './ProductCard'
import type { CartItem } from '@/app/page'

interface ProductSectionProps {
  cart: Map<string, CartItem>
  updateCart: (variety: string, quantity: number) => void
  deliveryType: 'courier' | 'home'
  pricePerKg: number
}

export interface ApiProduct {
  id: string
  name: string
  description: string
  category: string
  location: string
  regularprice: number
  offerPrice: number | null
  images: string[]
  createdAt: string
  updatedAt: string
}

async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  if (!res.ok) throw new Error('প্রোডাক্ট লোড করতে সমস্যা হয়েছে')
  const json = await res.json()
  return Array.isArray(json) ? json : json.data
}

export default function ProductSection({ cart, updateCart, pricePerKg }: ProductSectionProps) {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products-public'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <section id="products" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="eyebrow mb-4">
              <span className="w-8 h-px bg-primary" />
              <h2 className="font-medium text-xl">আমাদের সংগ্রহ</h2>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              মৌসুমের <span className="text-primary">সেরা</span> আম
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-foreground/65 text-base sm:text-lg mb-3">
              রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই — প্রতিটি আমে আছে খাঁটি স্বাদ, ঘ্রাণ ও রাজশাহীর ঐতিহ্যের ছোঁয়া।
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="font-display text-xl font-medium">সর্বনিম্ন অর্ডার ১০ কেজি</p>
            </div>
          </div>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-foreground/50">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-base">লোড হচ্ছে...</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-16 gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">প্রোডাক্ট লোড করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করুন।</span>
          </div>
        )}

        {/* Grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => {
              const cartItem = cart.get(product.id)
              const quantity = cartItem?.quantity || 0
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  pricePerKg={pricePerKg}
                  quantity={quantity}
                  onUpdateQuantity={(qty) => updateCart(product.id, qty)}
                />
              )
            })}
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-16 text-foreground/50">
            এই মুহূর্তে কোনো প্রোডাক্ট নেই
          </div>
        )}
      </div>
    </section>
  )
}
