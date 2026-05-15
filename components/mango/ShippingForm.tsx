"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
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
  CreditCard,
  Hash,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
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
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
    return selected >= minDate;
  }, "তারিখ কমপক্ষে ২ দিন পরে হতে হবে"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["bkash", "nagad"], {
    required_error: "পেমেন্ট পদ্ধতি বেছে নিন",
  }),
  transactionId: z.string().min(4, "ট্রানজেকশন আইডি দিন").trim(),
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

const getMinDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
};

export default function ShippingForm({
  deliveryType,
  onDeliveryTypeChange,
  orderSummary,
  onOrderSuccess,
}: ShippingFormProps) {
  const { cart, setSubmittedOrder } = useCartStore();
  const [copied, setCopied] = useState(false);

  const SEND_MONEY_NUMBER = "01782521705";

  const handleCopy = () => {
    navigator.clipboard.writeText(SEND_MONEY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    control,
    formState: { errors },
  } = useForm<OrderData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { deliveryType },
  });

  const selectedPayment = useWatch({ control, name: "paymentMethod" });

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
    "w-full px-3 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  const labelClass =
    "text-sm font-medium text-foreground/80 mb-1.5 flex items-center gap-1.5";

  return (
    <section
      id="checkout"
      className="relative py-4 px-4 sm:px-6 bg-muted/20"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-3">
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">
            <span className="text-primary">অর্ডার</span> নিশ্চিত করুন
          </h2>
        </div>

        <div className="bg-card rounded-2xl p-4 sm:p-5 card-elevated border border-border/40">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            {/* STEP 1: Delivery type */}
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-2">
                ডেলিভারি পদ্ধতি বেছে নিন
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange("courier")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    deliveryType === "courier"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${deliveryType === "courier" ? "bg-primary/15" : "bg-muted"}`}>
                    <Store className={`w-4 h-4 ${deliveryType === "courier" ? "text-primary" : "text-foreground/60"}`} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${deliveryType === "courier" ? "text-primary" : "text-foreground"}`}>
                      কুরিয়ার অফিস
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">সুন্দরবন / AJR পয়েন্ট</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white">
                      ডেলিভারি ফ্রি
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("home")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    deliveryType === "home"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${deliveryType === "home" ? "bg-primary/15" : "bg-muted"}`}>
                    <Truck className={`w-4 h-4 ${deliveryType === "home" ? "text-primary" : "text-foreground/60"}`} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${deliveryType === "home" ? "text-primary" : "text-foreground"}`}>
                      হোম ডেলিভারি
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">দরজায় পৌঁছে দেওয়া হবে</p>
                    <p className={`text-xs font-medium mt-1 ${deliveryType === "home" ? "text-primary" : "text-foreground/70"}`}>
                      + ৳ ১৫ / কেজি
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* STEP 2: Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            {/* STEP 3: Address */}
            <div>
              <label className={labelClass}>
                <MapPin className="w-4 h-4" />
                {deliveryType === "courier"
                  ? "আপনার এলাকা / উপজেলার নাম"
                  : "সম্পূর্ণ ঠিকানা"}
              </label>
              <textarea
                {...register("address")}
                placeholder={
                  deliveryType === "courier"
                    ? "যেমন: মিরপুর-১০, ঢাকা । আপনার কাছের কুরিয়ার পয়েন্ট এ পৌঁছে দেওয়া হবে"
                    : "বাসা/হোল্ডিং, রোড, এলাকা"
                }
                rows={3}
                className={`${inputClass} resize-none`}
              />
              {deliveryType === "courier" && (
                <p className="text-muted-foreground text-xs mt-1.5">
                  আপনার এলাকার নাম লিখলেই হবে — আমরা কাছের সুন্দরবন / AJR
                  পয়েন্ট জানিয়ে দেবো
                </p>
              )}
              {errors.address && (
                <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.address.message}
                </p>
              )}
            </div>

            {/* STEP 4: City + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  min={getMinDateStr()}
                  onClick={(e) => {
                    (e.currentTarget as HTMLInputElement).showPicker?.();
                  }}
                  className={`${inputClass} cursor-pointer`}
                />
                {errors.deliveryDate && (
                  <p className="text-destructive text-sm mt-1.5">
                    {errors.deliveryDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* STEP 5: Notes */}
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

            {/* STEP 6: Order Summary */}
            <div className="bg-muted/50 rounded-xl p-3.5 border border-border/60">
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-medium text-foreground text-base">
                  অর্ডার সারসংক্ষেপ
                </p>
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/50">
                  {Array.from(cart.values()).length} আইটেম
                  <span className="mx-1.5 text-foreground/30">·</span>
                  {Array.from(cart.values()).reduce(
                    (s, i) => s + i.quantity,
                    0,
                  )}{" "}
                  কেজি
                </p>
              </div>
              <div className="space-y-1.5 text-sm pb-2 mb-2 border-b border-border/60">
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
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">আমের দাম</span>
                  <span className="font-medium">৳ {orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">
                    {deliveryType === "home" ? "হোম ডেলিভারি (+৳১৫/কেজি)" : "কুরিয়ার কালেক্ট"}
                  </span>
                  <span className="font-medium">
                    {orderSummary.deliveryCost > 0 ? `৳ ${orderSummary.deliveryCost.toLocaleString()}` : "ফ্রি"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-border/60">
                  <span className="font-medium text-foreground">সর্বমোট</span>
                  <span className="font-display text-xl font-bold text-foreground">
                    ৳ {orderSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 7: Payment */}
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> পেমেন্ট পদ্ধতি
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {(["bkash", "nagad"] as const).map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === method
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <input
                      {...register("paymentMethod")}
                      type="radio"
                      value={method}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="flex flex-col gap-1">
                      {method === "bkash" ? (
                        <Image
                          src="/bkash.svg"
                          alt="bKash"
                          width={56}
                          height={22}
                          className="object-contain"
                        />
                      ) : (
                        <Image
                          src="/nagad.jpeg"
                          alt="Nagad"
                          width={56}
                          height={22}
                          className="object-contain"
                        />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{" "}
                  {errors.paymentMethod.message}
                </p>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 text-sm text-amber-800 mb-4">
                <p className="mb-2.5">
                  নিচের নম্বরে <strong>Send Money</strong> করুন, তারপর
                  ট্রানজেকশন আইডি নিচে লিখুন।
                </p>
                <div className="flex items-center gap-3 bg-white/70 border border-amber-300 rounded-lg px-3.5 py-2.5">
                  <span className="font-mono text-xl font-bold tracking-widest text-amber-900 flex-1 select-all">
                    {SEND_MONEY_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                      copied
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-amber-700/80">
                  ট্রানজেকশন আইডি পাবেন পেমেন্ট সফল হলে যে SMS আসে তাতে — যেমন:{" "}
                  <span className="font-mono font-semibold">8AB12CD34EF</span>
                </p>
              </div>

              <label className={labelClass}>
                <Hash className="w-4 h-4" /> ট্রানজেকশন আইডি
              </label>
              <input
                {...register("transactionId")}
                type="text"
                placeholder="যেমন: 8AB12CD34EF"
                className={inputClass}
              />
              {errors.transactionId && (
                <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{" "}
                  {errors.transactionId.message}
                </p>
              )}
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-full text-base card-elevated disabled:opacity-50 hover:scale-[1.01] flex items-center justify-center gap-2 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  প্রসেস হচ্ছে...
                </>
              ) : (
                "অর্ডার নিশ্চিত করুন"
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              আপনার তথ্য সম্পূর্ণ সুরক্ষিত
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
