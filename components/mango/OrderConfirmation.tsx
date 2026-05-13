'use client'

import { useEffect, useState } from 'react'
import { Check, MessageCircle, RotateCw, MapPin, Calendar, Phone, ShoppingBag } from 'lucide-react'
import type { OrderResponse } from '@/lib/api'


const CITY_BN: Record<string, string> = {
  Dhaka: 'ঢাকা',
  Chittagong: 'চট্টগ্রাম',
  Sylhet: 'সিলেট',
  Rajshahi: 'রাজশাহী',
  Khulna: 'খুলনা',
  Barisal: 'বরিশাল',
  Mymensingh: 'ময়মনসিংহ',
  Rangpur: 'রংপুর',
}

interface OrderConfirmationProps {
  order: OrderResponse['data']
  onPlaceAnotherOrder: () => void
}

export default function OrderConfirmation({ order, onPlaceAnotherOrder }: OrderConfirmationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setShowAnimation(true)
  }, [])

  const { items, total, fullName, phone, address, city, deliveryDate, notes } = order

  return (
    <section id="confirmation" className="relative py-20 sm:py-24 px-4 sm:px-6 border-t border-border/40 bg-muted/20">
      <div className="max-w-2xl mx-auto">
        {/* Check */}
        <div className={`text-center mb-8 transition-all duration-700 ${showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary text-secondary-foreground card-elevated">
            <Check className="w-10 h-10" strokeWidth={3} />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground mb-3 leading-tight">
            অর্ডার <span className="text-primary">নিশ্চিত</span>
          </h1>
          <p className="text-lg text-foreground/70 mb-1">
            রাজশাহী ম্যাঙ্গোকে বেছে নেওয়ার জন্য ধন্যবাদ
          </p>
          <p className="text-foreground/60 text-sm">
            ডেলিভারির বিস্তারিত জানতে আমরা <span className="font-medium text-foreground">{phone}</span> নম্বরে কল করব
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 card-elevated border border-border/40 mb-5">
          {/* Items */}
          <div className="mb-6 pb-6 border-b border-border/60">
            <h2 className="font-display text-xl font-medium text-foreground mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> অর্ডার সামারি
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{item.variety}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} কেজি × ৳ {item.price}</p>
                  </div>
                  <p className="font-medium text-foreground">
                    ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="mb-6 pb-6 border-b border-border/60">
            <h2 className="font-display text-xl font-medium text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> ডেলিভারি তথ্য
            </h2>
            <div className="space-y-2 text-sm text-foreground/80">
              <p><span className="font-medium text-foreground">নাম:</span> {fullName}</p>
              <p className="flex items-start gap-2"><Phone className="w-3.5 h-3.5 mt-1 text-muted-foreground" /> {phone}</p>
              <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-1 text-muted-foreground" /> {address}, {CITY_BN[city] || city}</p>
              <p className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 mt-1 text-muted-foreground" />
                {new Date(deliveryDate).toLocaleDateString('bn-BD', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              {notes && <p><span className="font-medium text-foreground">নোট:</span> {notes}</p>}
            </div>
          </div>

          {/* Total */}
          <div className="bg-muted/50 rounded-xl p-5 mb-6 border border-border/60">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="font-medium text-foreground">পরিশোধের পরিমাণ</p>
                <p className="text-xs text-muted-foreground mt-0.5">ক্যাশ অন ডেলিভারি</p>
              </div>
              <span className="font-display text-3xl font-medium text-foreground">
                ৳{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-5">
            <p className="text-foreground font-medium mb-3 text-sm uppercase tracking-wider">পরবর্তী ধাপ</p>
            <ul className="space-y-3 text-sm text-foreground/80">
              {[
                'আমরা আপনাকে কল করে ডেলিভারির বিস্তারিত নিশ্চিত করব',
                'আপনার আম সাবধানে প্যাক করে পাঠানো হবে',
                'ডেলিভারির আগে SMS-এ নিশ্চিতকরণ পাবেন',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlaceAnotherOrder}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-4 rounded-full card-elevated hover:scale-[1.01] hover:bg-primary/90"
          >
            <RotateCw className="w-4 h-4" />
            আরেকটি অর্ডার দিন
          </button>
          <a
            href="https://wa.me/8801782521705?text=আমার%20অর্ডার%20সম্পর্কে%20সাহায্য%20দরকার"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-medium py-4 rounded-full hover:scale-[1.01] hover:bg-secondary/90"
          >
            <MessageCircle className="w-4 h-4" />
            হোয়াটসঅ্যাপে যোগাযোগ
          </a>
        </div>
      </div>
    </section>
  )
}
