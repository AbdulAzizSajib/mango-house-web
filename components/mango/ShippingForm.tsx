"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  User,
  Phone,
  MapPin,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  AlertCircle,
  Truck,
  Store,
} from "lucide-react";
import { postOrder } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import type { OrderData } from "@/app/page";

interface ShippingFormProps {
  deliveryType: "courier" | "home";
  onDeliveryTypeChange: (type: "courier" | "home") => void;
  orderSummary: {
    subtotal: number;
    deliveryCost: number;
    total: number;
  };
  onOrderSuccess: () => void;
}

const baseSchema = {
  fullName: z.string().min(3, "পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে").trim(),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, "ফোন নম্বর ১০-১১ ডিজিটের হতে হবে")
    .trim(),
  deliveryType: z.enum(["courier", "home"]),
  city: z.string().min(2, "অনুগ্রহ করে শহর বেছে নিন"),
  deliveryDate: z.string().refine((date) => {
    const selected = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return selected >= tomorrow;
  }, "তারিখ আগামীকাল বা পরে হতে হবে"),
  notes: z.string().optional(),
};

const formSchema = z.object({
  ...baseSchema,
  address: z.string().min(10, "ঠিকানা কমপক্ষে ১০ অক্ষরের হতে হবে").trim(),
});

const CITIES = [
  { value: "Dhaka", label: "ঢাকা" },
  { value: "Chittagong", label: "চট্টগ্রাম" },
  { value: "Sylhet", label: "সিলেট" },
  { value: "Rajshahi", label: "রাজশাহী" },
  { value: "Khulna", label: "খুলনা" },
  { value: "Barisal", label: "বরিশাল" },
  { value: "Mymensingh", label: "ময়মনসিংহ" },
  { value: "Rangpur", label: "রংপুর" },
];

export default function ShippingForm({
  deliveryType,
  onDeliveryTypeChange,
  orderSummary,
  onOrderSuccess,
}: ShippingFormProps) {
  const { cart, setSubmittedOrder } = useCartStore();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: postOrder,
    onSuccess: (res) => {
      setSubmittedOrder(res.data);
      onOrderSuccess();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { deliveryType },
  });

  const handleTypeChange = (type: "courier" | "home") => {
    onDeliveryTypeChange(type);
    setValue("deliveryType", type);
  };

  const onFormSubmit = (data: OrderData) => {
    const items = Array.from(cart.values()).map((i) => ({
      variety: i.name || i.variety,
      quantity: i.quantity,
      price: i.price,
    }));
    mutate({
      ...data,
      deliveryType,
      subtotal: orderSummary.subtotal,
      total: orderSummary.total,
      items,
    });
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-border bg-input text-foreground text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  const labelClass =
    "text-base font-medium text-foreground/80 mb-2 flex items-center gap-2";

  return (
    <section
      id="checkout"
      className="relative py-8 sm:py-4 px-4 sm:px-6 bg-muted/20"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <div className="eyebrow justify-center mb-2">
            <span className="w-8 h-px bg-primary" />
            <p className="text-lg font-medium">চেকআউট</p>
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-3">
            <span className="text-primary">অর্ডার</span> নিশ্চিত করুন
          </h2>
        </div>

        <div className="bg-card rounded-2xl p-5 sm:p-7 card-elevated border border-border/40">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Delivery type selector */}
            <div>
              <p className="text-base font-medium text-foreground/80 mb-3">
                ডেলিভারি পদ্ধতি বেছে নিন
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("courier")}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryType === "courier"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryType === "courier" ? "bg-primary/15" : "bg-muted"}`}
                  >
                    <Store
                      className={`w-5 h-5 ${deliveryType === "courier" ? "text-primary" : "text-foreground/60"}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-base ${deliveryType === "courier" ? "text-primary" : "text-foreground"}`}
                    >
                      কুরিয়ার অফিস
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      নিকটস্থ সুন্দরবন অথবা AJR কুরিয়ার পয়েন্ট থেকে সংগ্রহ
                    </p>
                    <p
                      className={`text-base font-display font-medium mt-2 ${deliveryType === "courier" ? "text-primary" : "text-foreground/70"}`}
                    >
                      ডেলিভারি ফ্রি
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("home")}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryType === "home"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryType === "home" ? "bg-primary/15" : "bg-muted"}`}
                  >
                    <Truck
                      className={`w-5 h-5 ${deliveryType === "home" ? "text-primary" : "text-foreground/60"}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-base ${deliveryType === "home" ? "text-primary" : "text-foreground"}`}
                    >
                      হোম ডেলিভারি
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      আপনার দরজায় পৌঁছে দেওয়া হবে
                    </p>
                    <p
                      className={`text-base font-display font-medium mt-2 ${deliveryType === "home" ? "text-primary" : "text-foreground/70"}`}
                    >
                      + ৳ ১৫ / কেজি ডেলিভারি
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-5 border border-border/60">
              <div className="flex items-baseline justify-between mb-3">
                <p className="font-medium text-foreground text-base">
                  অর্ডার সামারি
                </p>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/50">
                  {Array.from(cart.values()).length} ITEM
                  {Array.from(cart.values()).length !== 1 ? "S" : ""}
                  <span className="mx-1.5 text-foreground/30">·</span>
                  {Array.from(cart.values()).reduce((s, i) => s + i.quantity, 0)} KG
                </p>
              </div>

              {/* Items list */}
              <div className="space-y-2 text-sm pb-3 mb-3 border-b border-border/60">
                {Array.from(cart.values()).map((item) => (
                  <div
                    key={item.variety}
                    className="flex justify-between items-baseline gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-foreground truncate">
                        {item.name || item.variety}
                      </p>
                      <p className="font-mono text-[11px] text-foreground/55 mt-0.5">
                        {item.quantity} কেজি × ৳ {item.price}
                      </p>
                    </div>
                    <p className="font-display font-medium text-foreground shrink-0">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-foreground/70">আমের দাম</span>
                  <span className="font-display text-foreground font-medium">
                    ৳ {orderSummary.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-display text-foreground/70">
                    {deliveryType === "home"
                      ? "হোম ডেলিভারি (+৳১৫/কেজি)"
                      : "কুরিয়ার কালেক্ট"}
                  </span>
                  <span className="font-display text-foreground font-medium">
                    {orderSummary.deliveryCost > 0
                      ? `৳ ${orderSummary.deliveryCost.toLocaleString()}`
                      : "ফ্রি"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-border/60">
                  <span className="font-medium text-foreground">সর্বমোট</span>
                  <span className="font-display text-2xl font-medium text-foreground">
                    ৳ {orderSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  <User className="w-4 h-4" /> পূর্ণ নাম
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="যেমন: মোঃ রহিম উদ্দিন"
                  className={inputClass}
                />
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />{" "}
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  <Phone className="w-4 h-4" /> মোবাইল নম্বর
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>
                <MapPin className="w-4 h-4" /> সম্পূর্ণ ঠিকানা
              </label>
              <textarea
                {...register("address")}
                placeholder="বাসা/হোল্ডিং, রোড, এলাকা"
                rows={3}
                className={`${inputClass} resize-none`}
              />
              {errors.address && (
                <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.address.message}
                </p>
              )}
            </div>

            {/* City + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  <Building2 className="w-4 h-4" /> শহর / জেলা
                </label>
                <select {...register("city")} className={inputClass}>
                  <option value="">বেছে নিন</option>
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  <Calendar className="w-4 h-4" /> পছন্দের তারিখ
                </label>
                <input
                  {...register("deliveryDate")}
                  type="date"
                  className={inputClass}
                />
                {errors.deliveryDate && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.deliveryDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>
                <FileText className="w-4 h-4" /> বিশেষ নির্দেশনা
                <span className="text-muted-foreground font-normal text-sm">
                  (ঐচ্ছিক)
                </span>
              </label>
              <textarea
                {...register("notes")}
                placeholder="কোনো নির্দেশনা থাকলে লিখুন"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Submit */}
            {isError && (
              <p className="text-destructive text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {(error as Error)?.message ||
                  "অর্ডার পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন"}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-full text-lg card-elevated disabled:opacity-50 hover:scale-[1.01]"
            >
              {isPending ? "প্রসেস হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
            </button>

            <p className="text-center text-sm text-muted-foreground pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              আপনার তথ্য সম্পূর্ণ সুরক্ষিত · ক্যাশ অন ডেলিভারি সুবিধা
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
