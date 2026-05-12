'use client'

import { ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react'
import type { CartItem } from '@/app/page'

const MIN_ORDER_KG = 10

const VARIETY_BN: Record<string, string> = {
  gopalbhog: 'গোপালভোগ',
  himsagar: 'হিমসাগর',
  ranipochondo: 'রানীপছন্দ',
  langra: 'ল্যাংড়া',
  amrapali: 'আম্রপালি',
  fazli: 'ফজলি',
}

interface OrderSummaryProps {
  cart: Map<string, CartItem>
  subtotal: number
  deliveryFee: number
  total: number
  onProceedClick: () => void
}

export default function OrderSummary({
  cart,
  subtotal,
  deliveryFee,
  total,
  onProceedClick,
}: OrderSummaryProps) {
  const isEmpty = cart.size === 0
  const totalItems = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0)
  const belowMin = totalItems < MIN_ORDER_KG
  const remaining = MIN_ORDER_KG - totalItems

  if (isEmpty) return null

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40">
      {/* Minimum order warning */}
      {belowMin && (
        <div className="bg-primary/95 text-primary-foreground border-b border-primary/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>সর্বনিম্ন ১০ কেজি অর্ডার করতে হবে — আরো <span className="font-bold underline">{remaining} কেজি</span> যোগ করুন</span>
          </div>
        </div>
      )}

      <div className="bg-card border-t border-border shadow-[0_-12px_40px_rgba(31,20,7,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 sm:gap-6 items-center">
            {/* Items */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center relative">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cart.size}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  আপনার কার্ট
                </p>
                <p className="font-semibold text-foreground text-sm truncate">
                  {totalItems} কেজি · {Array.from(cart.values()).map((i) => VARIETY_BN[i.variety] || i.variety).join(', ')}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="hidden sm:block text-right pr-6 border-r border-border">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">সর্বমোট</p>
              <p className="font-display text-2xl font-bold text-foreground leading-none mt-1">
                ৳{total.toLocaleString()}
              </p>
              {deliveryFee === 0 && !belowMin && (
                <p className="text-[11px] text-secondary font-semibold mt-1">✓ ফ্রি ডেলিভারি</p>
              )}
            </div>

            {/* Mobile total */}
            <div className="sm:hidden flex items-center justify-between border-t border-border pt-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">সর্বমোট</p>
                <p className="font-display text-xl font-bold text-foreground">৳{total.toLocaleString()}</p>
              </div>
              {deliveryFee === 0 && !belowMin && (
                <p className="text-xs text-secondary font-semibold">✓ ফ্রি ডেলিভারি</p>
              )}
            </div>

            {/* Action */}
            <button
              onClick={onProceedClick}
              disabled={belowMin}
              className={`group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-sm ${
                belowMin
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 card-elevated hover:scale-[1.02]'
              }`}
            >
              অর্ডার সম্পন্ন করুন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
