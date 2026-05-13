'use client'

import { useState } from 'react'
import { ShoppingBag, ArrowRight, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react'
import type { CartItem } from '@/app/page'

const MIN_ORDER_KG = 10


interface OrderSummaryProps {
  cart: Map<string, CartItem>
  subtotal: number
  total: number
  deliveryType: 'courier' | 'home'
  onProceedClick: () => void
}

export default function OrderSummary({ cart, subtotal, total, deliveryType, onProceedClick }: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(false)

  const isEmpty = cart.size === 0
  const totalKg = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0)
  const belowMin = totalKg < MIN_ORDER_KG
  const remaining = MIN_ORDER_KG - totalKg
  const items = Array.from(cart.values())

  if (isEmpty) return null

  const deliveryLabel = deliveryType === 'home' ? 'হোম ডেলিভারি · ৳৯৫/কেজি' : 'কুরিয়ার কালেক্ট · ৳৮০/কেজি'

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div className="rounded-2xl border border-border bg-card shadow-[0_8px_40px_rgba(31,20,7,0.18)] overflow-hidden">

        {/* Header — always visible */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-card hover:bg-muted/40 transition-colors"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
              {cart.size}
            </span>
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-[16px] text-muted-foreground font-semibold uppercase tracking-wider">
              আপনার কার্ট {totalKg} কেজি
            </p>
            <p className="font-display text-lg font-medium text-foreground leading-none mt-0.5">
              ৳ {total.toLocaleString()}
            </p>
          </div>

          <div className="shrink-0 text-muted-foreground">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </div>
        </button>

        {/* Expanded panel */}
        {expanded && (
          <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">

            {belowMin && (
              <div className="flex items-start gap-2 bg-primary/10 text-primary rounded-xl px-3 py-2.5 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>সর্বনিম্ন ১০ কেজি — আরো <span className="underline font-medium">{remaining} কেজি</span> যোগ করুন</span>
              </div>
            )}

            {/* Items list */}
            <div className="space-y-1.5">
              {items.map((item) => (
                <div key={item.variety} className="flex justify-between items-center text-sm">
                  <span className="text-foreground/80">
                    {item.name || item.variety} · {item.quantity} কেজি
                  </span>
                  <span className="font-semibold text-foreground">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border/50 pt-2 space-y-1 text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>ডেলিভারি ধরন</span>
                <span className="text-foreground font-medium">{deliveryLabel}</span>
              </div>
              <div className="flex justify-between font-medium text-foreground pt-1 border-t border-border/50">
                <span>সর্বমোট</span>
                <span className="font-display text-lg">৳ {total.toLocaleString()}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => { setExpanded(false); onProceedClick() }}
              disabled={belowMin}
              className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-sm transition-all ${
                belowMin
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-md'
              }`}
            >
              অর্ডার নিশ্চিত করুন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
