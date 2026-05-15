"use client";

import { useEffect, useState } from "react";
import {
  Check,
  RotateCw,
  MapPin,
  Calendar,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import type { OrderResponse } from "@/lib/api";

const NEXT_STEPS = [
  "আমরা আপনাকে কল করে ডেলিভারির বিস্তারিত নিশ্চিত করব",
  "আপনার আম সাবধানে প্যাক করে পাঠানো হবে",
  "ডেলিভারির আগে SMS-এ নিশ্চিতকরণ পাবেন",
];

interface OrderConfirmationProps {
  order: OrderResponse["data"];
  onPlaceAnotherOrder: () => void;
}

export default function OrderConfirmation({
  order,
  onPlaceAnotherOrder,
}: OrderConfirmationProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowAnimation(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section
      id="confirmation"
      className="relative py-8 sm:py-12 px-4 sm:px-6 border-t border-border/40 bg-muted/20 min-h-screen"
    >
      <div className="max-w-2xl mx-auto">
        {/* Success icon */}
        <div
          className={`text-center mb-5 transition-all duration-700 ${showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-full bg-secondary/30 animate-ping" />
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-secondary-foreground shadow-lg">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          className={`text-center mb-6 transition-all duration-500 delay-300 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground mb-2 leading-tight">
            অর্ডার <span className="text-primary">সফল হয়েছে!</span>
          </h1>
          <p className="text-base text-foreground/70 mb-1">
            Rajshahi Mango-কে বেছে নেওয়ার জন্য ধন্যবাদ 🥭
          </p>
          <p className="text-foreground/55 text-sm">
            আমরা{" "}
            <span className="font-semibold text-lg mx-1 text-foreground">
              {order.phone}
            </span>{" "}
            নম্বরে কল করে নিশ্চিত করব
          </p>
        </div>

        {/* Main card */}
        <div
          className={`transition-all duration-500 delay-500 ${showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div className="bg-card rounded-2xl border border-border/40 card-elevated overflow-hidden mb-4">
            {/* Items */}
            <div className="p-4 sm:p-6 border-b border-border/60">
              <h2 className="font-display text-base font-medium text-foreground mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                অর্ডার সারসংক্ষেপ
              </h2>
              <div className="space-y-2.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.variety}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} কেজি × ৳{item.price}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline mt-3 pt-1 border-t border-border/50">
                <span className="text-sm font-medium text-foreground/70">
                  সর্বমোট
                </span>
                <span className="font-display text-xl font-semibold text-foreground">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="p-4 sm:px-6 border-b border-border/60">
              <h2 className="font-display text-base font-medium text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                ডেলিভারি তথ্য
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2.5 text-foreground/80">
                  <User className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span>{order.fullName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground/80">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-start gap-2.5 text-foreground/80">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                  <span>
                    {order.address}, {order.district}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground/80">
                  <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                    {order.deliveryType === "home" ? "🏠" : "📦"}
                  </span>
                  <span>
                    {order.deliveryType === "home"
                      ? "হোম ডেলিভারি"
                      : "কুরিয়ার পয়েন্ট থেকে সংগ্রহ"}
                  </span>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-2.5 text-foreground/80">
                    <span className="w-3.5 h-3.5 shrink-0 text-xs">📝</span>
                    <span className="italic text-foreground/60">
                      {order.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Next steps */}
            <div className="p-4 sm:p-6">
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-3">
                পরবর্তী ধাপ
              </p>
              <ul className="space-y-2.5">
                {NEXT_STEPS.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-foreground/75"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs font-semibold flex items-center justify-center mt-0.5">
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
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3 rounded-full card-elevated hover:scale-[1.01] active:scale-[0.98] hover:bg-primary/90 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              আরেকটি অর্ডার দিন
            </button>

            <a
              href={`https://wa.me/8801782521705?text=${encodeURIComponent(`আমার অর্ডার সম্পর্কে সাহায্য দরকার। নাম: ${order.fullName}, ফোন: ${order.phone}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2.5 bg-secondary text-secondary-foreground font-medium py-3 rounded-full hover:scale-[1.01] active:scale-[0.98] hover:bg-secondary/90 transition-all"
            >
              <img src="/whatsapp.png" alt="" className="w-4 h-4" />
              হোয়াটসঅ্যাপে যোগাযোগ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
