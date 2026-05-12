'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Phone, MapPin, Building2, Calendar, FileText, ShieldCheck, AlertCircle, Truck, Store } from 'lucide-react'
import type { OrderData } from '@/app/page'

interface ShippingFormProps {
  onSubmit: (data: OrderData) => void
  deliveryType: 'courier' | 'home'
  onDeliveryTypeChange: (type: 'courier' | 'home') => void
  orderSummary: {
    subtotal: number
    total: number
  }
}

const baseSchema = {
  fullName: z.string().min(3, 'পূর্ণ নাম কমপক্ষে ৩ অক্ষরের হতে হবে').trim(),
  phone: z.string().regex(/^\d{10,11}$/, 'ফোন নম্বর ১০-১১ ডিজিটের হতে হবে').trim(),
  deliveryType: z.enum(['courier', 'home']),
  city: z.string().min(2, 'অনুগ্রহ করে শহর বেছে নিন'),
  deliveryDate: z.string().refine(
    (date) => {
      const selected = new Date(date)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return selected >= tomorrow
    },
    'তারিখ আগামীকাল বা পরে হতে হবে'
  ),
  notes: z.string().optional(),
}

const formSchema = z.object({ ...baseSchema, address: z.string().min(10, 'ঠিকানা কমপক্ষে ১০ অক্ষরের হতে হবে').trim() })

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

export default function ShippingForm({ onSubmit, deliveryType, onDeliveryTypeChange, orderSummary }: ShippingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = formSchema

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { deliveryType },
  })

  const handleTypeChange = (type: 'courier' | 'home') => {
    onDeliveryTypeChange(type)
    setValue('deliveryType', type)
  }

  const onFormSubmit = async (data: OrderData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSubmit({ ...data, deliveryType })
    setIsSubmitting(false)
  }

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl border border-border bg-input text-foreground text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

  const labelClass = 'text-base font-medium text-foreground/80 mb-2 flex items-center gap-2'

  return (
    <section id="checkout" className="relative py-20 sm:py-24 px-4 sm:px-6 border-t border-border/40 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-primary" />
            <p className="text-lg font-medium">চেকআউট</p>
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-3">
            <span className="text-primary">অর্ডার</span> নিশ্চিত করুন
          </h2>
          <p className="text-base text-foreground/65">
            তথ্য দিন — ১ মিনিটেই হয়ে যাবে
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 sm:p-10 card-elevated border border-border/40">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">

            {/* Delivery type selector */}
            <div>
              <p className="text-base font-medium text-foreground/80 mb-3">ডেলিভারি পদ্ধতি বেছে নিন</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('courier')}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryType === 'courier' ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryType === 'courier' ? 'bg-primary/15' : 'bg-muted'}`}>
                    <Store className={`w-5 h-5 ${deliveryType === 'courier' ? 'text-primary' : 'text-foreground/60'}`} />
                  </div>
                  <div>
                    <p className={`font-medium text-base ${deliveryType === 'courier' ? 'text-primary' : 'text-foreground'}`}>
                      কুরিয়ার অফিস
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">নিকটস্থ সুন্দরবন অথবা  AJR কুরিয়ার পয়েন্ট থেকে সংগ্রহ</p>
                    <p className={`text-base font-medium mt-2 ${deliveryType === 'courier' ? 'text-primary' : 'text-foreground/70'}`}>
                      ৳ ৮০ / কেজি
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange('home')}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryType === 'home' ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryType === 'home' ? 'bg-primary/15' : 'bg-muted'}`}>
                    <Truck className={`w-5 h-5 ${deliveryType === 'home' ? 'text-primary' : 'text-foreground/60'}`} />
                  </div>
                  <div>
                    <p className={`font-medium text-base ${deliveryType === 'home' ? 'text-primary' : 'text-foreground'}`}>
                      হোম ডেলিভারি
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">আপনার দরজায় পৌঁছে দেওয়া হবে</p>
                    <p className={`text-base font-medium mt-2 ${deliveryType === 'home' ? 'text-primary' : 'text-foreground/70'}`}>
                      ৳ ৯৫ / কেজি
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  <User className="w-4 h-4" /> পূর্ণ নাম
                </label>
                <input {...register('fullName')} type="text" placeholder="যেমন: মোঃ রহিম উদ্দিন" className={inputClass} />
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  <Phone className="w-4 h-4" /> মোবাইল নম্বর
                </label>
                <input {...register('phone')} type="tel" placeholder="01XXXXXXXXX" className={inputClass} />
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
                {...register('address')}
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
                <select {...register('city')} className={inputClass}>
                  <option value="">বেছে নিন</option>
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.city && <p className="text-destructive text-sm mt-1.5">{errors.city.message}</p>}
              </div>
              <div>
                <label className={labelClass}>
                  <Calendar className="w-4 h-4" /> পছন্দের তারিখ
                </label>
                <input {...register('deliveryDate')} type="date" className={inputClass} />
                {errors.deliveryDate && <p className="text-destructive text-sm mt-1.5">{errors.deliveryDate.message}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>
                <FileText className="w-4 h-4" /> বিশেষ নির্দেশনা
                <span className="text-muted-foreground font-normal text-sm">(ঐচ্ছিক)</span>
              </label>
              <textarea
                {...register('notes')}
                placeholder="কোনো নির্দেশনা থাকলে লিখুন"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-5 border border-border/60">
              <p className="font-medium text-foreground mb-3 text-base">অর্ডার সামারি</p>
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-foreground/70">ডেলিভারি ধরন</span>
                  <span className="text-foreground font-medium">
                    {deliveryType === 'home' ? 'হোম ডেলিভারি · ৳৯৫/কেজি' : 'কুরিয়ার কালেক্ট · ৳৮০/কেজি'}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 rounded-full text-lg card-elevated disabled:opacity-50 hover:scale-[1.01]"
            >
              {isSubmitting ? 'প্রসেস হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}
            </button>

            <p className="text-center text-sm text-muted-foreground pt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              আপনার তথ্য সম্পূর্ণ সুরক্ষিত · ক্যাশ অন ডেলিভারি সুবিধা
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
