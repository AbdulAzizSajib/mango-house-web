'use client'

import Image from 'next/image'
import { Check, Trash2, ChevronDown } from 'lucide-react'

const QUANTITY_OPTIONS = [10, 15, 20, 25, 30]

interface ProductCardProps {
  variety: {
    id: string
    name: string
    nameEn: string
    tagline: string
    price: number
    image: string
    description: string[]
    origin: string
    badge?: string
  }
  quantity: number
  onUpdateQuantity: (quantity: number) => void
}

export default function ProductCard({ variety, quantity, onUpdateQuantity }: ProductCardProps) {
  const isSelected = quantity > 0

  return (
    <article
      className={`group relative bg-card rounded-2xl overflow-hidden card-elevated card-hover ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-4/3 img-zoom bg-muted">
        <Image
          src={variety.image}
          alt={variety.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {variety.badge && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/95 backdrop-blur-sm text-xs font-medium text-foreground shadow-sm">
            {variety.badge}
          </div>
        )}
        {isSelected && (
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Origin & english name */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          <span>📍 {variety.origin}</span>
          <span>{variety.nameEn}</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground leading-tight mb-1">
          {variety.name}
        </h3>
        <p className="text-sm text-primary font-medium  mb-3">
          {variety.tagline}
        </p>

        <ul className="space-y-1.5 mb-5">
          {variety.description.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-foreground/70 text-sm leading-relaxed">
              <Check className="w-3.5 h-3.5 text-primary mt-1 shrink-0" strokeWidth={3} />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="flex items-baseline justify-between mb-5 pb-5 border-b border-border/70">
          <div>
            <p className="font-display text-3xl font-medium text-foreground">
              <span className="text-xl">৳ </span>{variety.price.toLocaleString('bn-BD')}
              <span className="text-base text-muted-foreground font-sans font-normal"> /কেজি</span>
            </p>
          </div>
          {isSelected && (
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">মোট</p>
              <p className="text-lg font-bold text-secondary">
                ৳{(variety.price * quantity).toLocaleString('bn-BD')}
              </p>
            </div>
          )}
        </div>

        {/* Quantity selector */}
        <div className="space-y-2">
          <label className="text-[13px] uppercase tracking-wider text-muted-foreground font-medium flex items-center justify-between">
            <span>অর্ডারের পরিমাণ নির্ধারণ করুন</span>
            {isSelected && (
              <button
                onClick={() => onUpdateQuantity(0)}
                className="inline-flex items-center gap-1 text-destructive hover:underline normal-case tracking-normal text-xs font-semibold"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </label>

          <div className="relative">
            <select
              value={quantity}
              onChange={(e) => onUpdateQuantity(Number(e.target.value))}
              className={`w-full appearance-none cursor-pointer rounded-xl border-2 px-4 py-3 pr-11 font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card text-foreground hover:border-foreground/30'
              }`}
            >
              {!isSelected && <option value={0}>প্যাকেজ নির্বাচন করুন</option>}
              {QUANTITY_OPTIONS.map((qty) => (
                <option key={qty} value={qty}>
                  {qty} কেজি — {(variety.price * qty).toLocaleString('bn-BD') } টাকা
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60 pointer-events-none"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
