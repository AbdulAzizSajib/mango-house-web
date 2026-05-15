"use client";

import { useState } from "react";
import { ShoppingBag, ArrowRight, AlertCircle, ChevronUp } from "lucide-react";
import type { CartItem } from "@/app/page";

const MIN_ORDER_KG = 10;

interface OrderSummaryProps {
  cart: Map<string, CartItem>;
  subtotal: number;
  deliveryCost: number;
  total: number;
  deliveryType: "courier" | "home";
  onProceedClick: () => void;
}

export default function OrderSummary({
  cart,
  subtotal,
  deliveryCost,
  total,
  deliveryType,
  onProceedClick,
}: OrderSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const isEmpty = cart.size === 0;
  const totalKg = Array.from(cart.values()).reduce(
    (sum, i) => sum + i.quantity,
    0,
  );
  const belowMin = totalKg < MIN_ORDER_KG;
  const remaining = MIN_ORDER_KG - totalKg;
  const items = Array.from(cart.values());
  const deliveryLabel =
    deliveryType === "home" ? "হোম ডেলিভারি (+৳১৫/কেজি)" : "কুরিয়ার কালেক্ট";

  if (isEmpty) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div className="rounded-2xl border border-border bg-card shadow-[0_8px_40px_rgba(31,20,7,0.18)] overflow-hidden">
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors"
        >
          {/* Bag icon + badge */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {cart.size}
            </span>
          </div>

          {/* Labels */}
          <div className="flex-1 min-w-0 text-left">
            {/* FIX: secondary info small on top, price big below */}
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-none">
              {totalKg} কেজি · {cart.size} আইটেম
            </p>
            <p className="font-display text-xl font-semibold text-foreground leading-tight mt-0.5">
              ৳ {total.toLocaleString()}
            </p>
          </div>

          {/* FIX: chevron direction — up when expanded, down when collapsed */}
          <div
            className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
              expanded ? "rotate-0" : "rotate-180"
            }`}
          >
            <ChevronUp className="w-5 h-5" />
          </div>
        </button>

        {/* Expanded panel */}
        {expanded && (
          <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
            {/* Min order warning */}
            {belowMin && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2.5 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  সর্বনিম্ন ১০ কেজি অর্ডার করতে হবে — আরো{" "}
                  <span className="font-bold underline">{remaining} কেজি</span>{" "}
                  যোগ করুন
                </span>
              </div>
            )}

            {/* Items list */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.variety}
                  className="flex justify-between items-baseline gap-2 text-sm"
                >
                  <div className="min-w-0">
                    <span className="text-foreground font-medium truncate block">
                      {item.name || item.variety}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.quantity} কেজি × ৳{item.price}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground shrink-0">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border/50 pt-2.5 space-y-1.5 text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>আমের দাম</span>
                <span className="text-foreground font-medium">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>{deliveryLabel}</span>
                <span className="text-foreground font-medium">
                  {deliveryCost > 0
                    ? `৳ ${deliveryCost.toLocaleString()}`
                    : "ফ্রি"}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-foreground pt-1.5 border-t border-border/50">
                <span>সর্বমোট</span>
                <span className="font-display text-lg">
                  ৳ {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                setExpanded(false);
                onProceedClick();
              }}
              disabled={belowMin}
              className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-medium text-base transition-all ${
                belowMin
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-md"
              }`}
            >
              অর্ডার নিশ্চিত করুন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
