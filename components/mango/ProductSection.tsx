"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";
import type { CartItem } from "@/app/page";

interface ProductSectionProps {
  cart: Map<string, CartItem>;
  updateCart: (variety: string, quantity: number, name?: string) => void;
  deliveryType: "courier" | "home";
  pricePerKg: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  regularprice: number;
  offerPrice: number | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!res.ok) throw new Error("প্রোডাক্ট লোড করতে সমস্যা হয়েছে");
  const json = await res.json();
  return Array.isArray(json) ? json : json.data;
}

// FIX: skeleton card to prevent layout shift during load
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-muted rounded-lg w-2/3" />
        <div className="h-4 bg-muted rounded-lg w-full" />
        <div className="h-4 bg-muted rounded-lg w-4/5" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-muted rounded-lg w-1/3" />
          <div className="h-10 bg-muted rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSection({
  cart,
  updateCart,
  pricePerKg,
}: ProductSectionProps) {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products-public"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section
      id="products"
      className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="eyebrow mb-4">
              <span className="w-8 h-px bg-primary" />
              {/* FIX: eyebrow as <p>, heading as single <h2> — no duplicate h2 */}
              <p className="font-medium text-xl">আমাদের সংগ্রহ</p>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              মৌসুমের <span className="text-primary">সেরা</span> আম
            </h2>
          </div>

          <div className="max-w-md space-y-3">
            <p className="text-foreground/65 text-base sm:text-lg">
              রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই — প্রতিটি আমে আছে খাঁটি
              স্বাদ, ঘ্রাণ ও রাজশাহীর ঐতিহ্যের ছোঁয়া।
            </p>
            {/* FIX: min order badge — slightly more prominent */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="font-display text-base font-medium">
                সর্বনিম্ন অর্ডার ১০ কেজি
              </p>
            </div>
          </div>
        </div>

        {/* Loading — skeleton grid instead of just a spinner */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error — with retry button */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                লোড করতে সমস্যা হয়েছে
              </p>
              <p className="text-sm text-foreground/55">
                ইন্টারনেট কানেকশন চেক করুন
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 rounded-full border border-border hover:bg-muted text-sm font-medium transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Product grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => {
              const cartItem = cart.get(product.id);
              const quantity = cartItem?.quantity || 0;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  pricePerKg={pricePerKg}
                  quantity={quantity}
                  onUpdateQuantity={(qty) =>
                    updateCart(product.id, qty, product.name)
                  }
                />
              );
            })}
          </div>
        )}

        {/* FIX: empty state with icon instead of plain text */}
        {products && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <PackageSearch className="w-7 h-7 text-foreground/40" />
            </div>
            <p className="font-medium text-foreground/60">
              এই মুহূর্তে কোনো আম নেই
            </p>
            <p className="text-sm text-foreground/40">শীঘ্রই নতুন আম আসছে</p>
          </div>
        )}
      </div>
    </section>
  );
}
