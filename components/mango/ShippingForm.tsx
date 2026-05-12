'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Phone, MapPin, Building2, Calendar, FileText, ShieldCheck, AlertCircle } from 'lucide-react'
import type { OrderData } from '@/app/page'

interface ShippingFormProps {
  onSubmit: (data: OrderData) => void
  orderSummary: {
    subtotal: number
    deliveryFee: number
    total: number
  }
}

const formSchema = z.object({
  fullName: z.string().min(3, 'পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে').trim(),
  phone: z.string().regex(/^\d{10,11}$/, 'ফোন নম্বর ১০-১১ ডিজিটের হতে হবে').trim(),
  address: z.string().min(10, 'ঠিকানা কমপক্ষে ১০ অক্ষরের হতে হবে').trim(),
  city: z.string().min(2, 'অনুগ্রহ করে শহর বেছে নিন'),
  deliveryDate: z.string().refine(
    (date) => {
      const selected = new Date(date)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return selected >= tomorrow
    },
    'ডেলিভারির তারিখ আগামীকাল বা পরে হতে হবে'
  ),
  notes: z.string().optional(),
})

const CITIES = [
  { value: 'Dhaka', label: 'ঢাকা' },
  { value: 'Chittagong', label: 'চট্টগ্রাম' },
  { value: 'Sylhet', label: 'সিলেট' },
  { value: 'Rajshahi', label: 'রাজশাহী' },
  { value: 'Khulna', label: 'খুলনা' },
  { value: 'Barisal', label: 'বরিশাল' },
  { value: 'Mymensingh', label: 'ময়মনসিংহ' },
  { value: 'Rangpur', label: 'রংপুর' },
]

export default function ShippingForm({ onSubmit, orderSummary }: ShippingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  })

  const onFormSubmit = async (data: OrderData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSubmit(data)
    setIsSubmitting(false)
  }

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl border border-border bg-input text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

  return (
    <section id="checkout" className="relative py-20 sm:py-24 px-4 sm:px-6 border-t border-border/40 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-primary" />
            চেকআউট
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-3">
            <span className="italic text-primary">ডেলিভারির</span> তথ্য দিন
          </h2>
          <p className="text-foreground/65">
            অর্ডারটি সম্পূর্ণ করতে কয়েকটি তথ্য দিন — ১ মিনিটেই হয়ে যাবে
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 sm:p-10 card-elevated border border-border/40">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/70 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> পূর্ণ নাম
                </label>
                <input {...register('fullName')} type="text" placeholder="যেমন: মোঃ রহিম উদ্দিন" className={inputClass} />
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/70 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> মোবাইল নম্বর
                </label>
                <input {...register('phone')} type="tel" placeholder="01XXXXXXXXX" className={inputClass} />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-foreground/70 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> সম্পূর্ণ ঠিকানা
              </label>
              <textarea
                {...register('address')}
                placeholder="বাসা/হোল্ডিং, রোড, এলাকা"
                rows={3}
                className={`${inputClass} resize-none`}
              />
              {errors.address && (
                <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.address.message}
                </p>
              )}
            </div>

            {/* City + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/70 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> শহর / জেলা
                </label>
                <select {...register('city')} className={inputClass}>
                  <option value="">বেছে নিন</option>
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.city && <p className="text-destructive text-sm mt-1.5">{errors.city.message}</p>}
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-foreground/70 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> ডেলিভারির তারিখ
                </label>
                <input {...register('deliveryDate')} type="date" className={inputClass} />
                {errors.deliveryDate && <p className="text-destructive text-sm mt-1.5">{errors.deliveryDate.message}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-foreground/70 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> বিশেষ নির্দেশনা <span className="text-muted-foreground font-normal normal-case tracking-normal">(ঐচ্ছিক)</span>
              </label>
              <textarea
                {...register('notes')}
                placeholder="ডেলিভারি সংক্রান্ত কোনো নির্দেশনা থাকলে লিখুন"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-5 border border-border/60">
              <p className="font-bold text-foreground mb-3 text-sm">অর্ডার সামারি</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">সাবটোটাল</span>
                  <span className="text-foreground font-medium">৳{orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border/60">
                  <span className="text-foreground/70">ডেলিভারি ফি</span>
                  <span className="text-foreground font-medium">
                    {orderSummary.deliveryFee === 0 ? '✓ ফ্রি' : `৳${orderSummary.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-foreground">সর্বমোট</span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    ৳{orderSummary.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-full text-base card-elevated disabled:opacity-50 hover:scale-[1.01]"
            >
              {isSubmitting ? 'প্রসেস হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}
            </button>

            <p className="text-center text-xs text-muted-foreground pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              আপনার তথ্য সম্পূর্ণ সুরক্ষিত · ক্যাশ অন ডেলিভারি সুবিধা
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
