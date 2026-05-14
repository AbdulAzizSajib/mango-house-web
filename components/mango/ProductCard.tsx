"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
      className={`group relative bg-card rounded-2xl overflow-hidden card-elevated card-hover ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      {/* Image area */}
      <div className="relative aspect-4/3 bg-muted overflow-hidden">
        {/* Main image */}
        {images.length > 0 ? (
          images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-500 ${i === imgIndex ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={src}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">
            no image
          </div>
        )}

        {/* Prev / Next arrows */}
        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
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
                className={`h-1 rounded-full transition-all ${i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        )}

        {/* Offer badge */}
        {product.offerPrice && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-sm">
            অফার
          </div>
        )}

        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Location & category */}
        <div className="flex items-center justify-between text-[13px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
            >
              <path
                fill="#121313"
                d="M19 9A7 7 0 1 0 5 9c0 1.387.409 2.677 1.105 3.765h-.008L12 22l5.903-9.235h-.007A6.97 6.97 0 0 0 19 9m-7 3a3 3 0 1 1 0-6a3 3 0 0 1 0 6"
                strokeWidth="0.5"
                stroke="#83CAFF"
              />
            </svg>
            {product.location}
          </span>
          <span>{product.category}</span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground leading-tight mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-foreground/65 leading-relaxed mb-4 line-clamp-3">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline justify-between mb-5 pb-5 border-b border-border/70">
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

        {/* Quantity selector */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <select
              value={quantity}
              onChange={(e) => onUpdateQuantity(Number(e.target.value))}
              className={`w-full font-display appearance-none cursor-pointer rounded-xl border-2 px-4 py-3 pr-11 font-medium text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              {!isSelected && (
                <option value={0}>অর্ডারের পরিমাণ নির্ধারণ করুন</option>
              )}
              {QUANTITY_OPTIONS.map((qty) => (
                <option className="font-display" key={qty} value={qty}>
                  {qty} কেজি — {(pricePerKg * qty).toLocaleString("bn-BD")} টাকা
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60 pointer-events-none"
              strokeWidth={2.5}
            />
          </div>
          {isSelected && (
            <button
              onClick={() => onUpdateQuantity(0)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
