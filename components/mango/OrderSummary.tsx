"use client";

import { ArrowRight, AlertCircle } from "lucide-react";
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
  onProceedClick,
}: OrderSummaryProps) {
  const isEmpty = cart.size === 0;
  const totalKg = Array.from(cart.values()).reduce((sum, i) => sum + i.quantity, 0);
  const belowMin = totalKg < MIN_ORDER_KG;
  const remaining = MIN_ORDER_KG - totalKg;

  if (isEmpty) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:bottom-4 sm:left-auto sm:right-4 sm:w-auto">
      {belowMin ? (
        <div className="w-full flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-4 py-3 text-xs font-medium shadow-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          আরো <span className="font-bold mx-1">{remaining} কেজি</span> যোগ করুন
        </div>
      ) : (
        <button
          onClick={onProceedClick}
          className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90 active:scale-[0.98] shadow-lg transition-all"
        >
          অর্ডার নিশ্চিত করুন
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
