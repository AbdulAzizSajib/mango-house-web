"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import type { ApiProduct } from "./ProductSection";

const QUANTITY_OPTIONS = [10, 15, 20, 25, 30];

interface ProductCardProps {
  product: ApiProduct;
  pricePerKg: number;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
}

export default function ProductCard({
  product,
  pricePerKg,
  quantity,
  onUpdateQuantity,
}: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const isSelected = quantity > 0;
  const images = product.images ?? [];
  const hasMany = images.length > 1;

  const prev = () =>
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setImgIndex((i) => (i + 1) % images.length);

  return (
    <article
      className={`group relative bg-card rounded-2xl overflow-hidden card-elevated card-hover transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* ── Image area ── */}
      <div className="relative aspect-4/3 bg-muted overflow-hidden">
        {images.length > 0 ? (
          images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === imgIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={i === 0 ? product.name : ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">
            ছবি নেই
          </div>
        )}

        {/* FIX: arrows always visible on mobile, hover-only on desktop */}
        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="আগের ছবি"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow transition-opacity md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="পরের ছবি"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow transition-opacity md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {hasMany && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIndex(i)}
                aria-label={`ছবি ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Offer badge */}
        {product.offerPrice && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-sm">
            অফার
          </div>
        )}

        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 sm:py-4 sm:px-6">
        {/* FIX: location uses lucide MapPin — no hardcoded SVG fill color */}
        <div className="flex items-center justify-between text-[12px] uppercase tracking-wider text-muted-foreground font-medium mb-2.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            {product.location}
          </span>
          <span>{product.category}</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground leading-tight mb-1">
          {product.name}
        </h3>

        <p className="text-sm text-foreground/65 leading-relaxed mb-2 line-clamp-3">
          {product.description}
        </p>

        {/* Price row */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <p className="font-display text-3xl font-medium text-foreground">
              <span className="text-xl">৳ </span>
              {pricePerKg.toLocaleString("bn-BD")}
              <span className="text-base text-muted-foreground font-sans font-normal">
                {" "}
                /কেজি
              </span>
            </p>
            {product.offerPrice && (
              <span className="font-display text-sm text-muted-foreground line-through">
                ৳{product.regularprice.toLocaleString("bn-BD")}
              </span>
            )}
          </div>
          {isSelected && (
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                মোট
              </p>
              <p className="font-display text-lg font-bold text-secondary">
                ৳{(pricePerKg * quantity).toLocaleString("bn-BD")}
              </p>
            </div>
          )}
        </div>

        {/* Quantity selector + delete */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={quantity}
              onChange={(e) => onUpdateQuantity(Number(e.target.value))}
              className={`w-full font-display appearance-none cursor-pointer rounded-lg border-2 px-4 py-2 pr-11 font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              {!isSelected && <option value={0}>পরিমাণ নির্ধারণ করুন</option>}
              {QUANTITY_OPTIONS.map((qty) => (
                <option key={qty} value={qty} className="font-display">
                  {qty} কেজি — ৳{(pricePerKg * qty).toLocaleString("bn-BD")}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60 pointer-events-none"
              strokeWidth={2.5}
            />
          </div>

          {/* FIX: bigger hit area for delete, tooltip for clarity */}
          {isSelected && (
            <button
              onClick={() => onUpdateQuantity(0)}
              title="কার্ট থেকে সরান"
              aria-label="কার্ট থেকে সরান"
              className="w-11 h-11 flex items-center justify-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/8 active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
