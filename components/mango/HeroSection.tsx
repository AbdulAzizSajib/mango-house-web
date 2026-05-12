'use client'

import Image from 'next/image'
import { ArrowRight, Leaf, ShieldCheck, Truck, Phone } from 'lucide-react'

interface HeroSectionProps {
  onShopNowClick: () => void
}

export default function HeroSection({ onShopNowClick }: HeroSectionProps) {
  return (
    <section className="relative w-full bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div> */}
            <div className="leading-tight">
              <p className="font-display text-lg sm:text-2xl font-medium text-foreground">রাজশাহী ম্যাঙ্গো</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground tracking-wider uppercase">Since 2025</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xl font-medium text-foreground/80">
            <a href="#products" className="hover:text-primary">আম</a>
            <a href="#about" className="hover:text-primary">আমরা</a>
            <a href="#reviews" className="hover:text-primary">রিভিউ</a>
            <a href="#faq" className="hover:text-primary">FAQ</a>
          </nav>

          <a
            href="tel:+8801700000000"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">01782521705</span>
          </a>
        </div>
      </header>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="order-2 lg:order-1">
            <div className="eyebrow mb-6">
              <span className="w-8 h-px  bg-primary" />
          <h2 className='text-lg font-medium'>    মৌসুমের সেরা সংগ্রহ</h2>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.05] mb-6">
              বাগান থেকে<br />
              <span className="text-primary">সরাসরি</span> <br /> আপনার ঘরে
            </h1>

            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
             রাজশাহীর বিখ্যাত আম বাগান থেকে হাতে বাছাই করা — কার্বাইড ও ফরমালিনমুক্ত, প্রাকৃতিকভাবে পাকানো তাজা ও সুস্বাদু আম সরাসরি আপনার ঘরে।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onShopNowClick}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground  text-base hover:bg-primary/90 card-elevated hover:scale-[1.02] font-medium"
              >
                আম দেখুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-2 border-foreground/15 text-foreground font-medium text-base hover:border-foreground/40 hover:bg-foreground/5"
              >
                হোয়াটসঅ্যাপে অর্ডার
              </a>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-4 max-w-max">
              {[
                { Icon: Leaf, label: '১০০% অর্গানিক আম' },
                { Icon: ShieldCheck, label: 'নিরাপদ ও কেমিক্যালমুক্ত' },
                { Icon: Truck, label: 'দ্রুত ডেলিভারি' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2  ">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground/80 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: real photograph */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-4/5 sm:aspect-5/6 rounded-2xl overflow-hidden card-elevated">
              <Image
                src="/mangoImage/ban/himsagor.JPG.jpeg"
                alt="তাজা আম"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Soft vignette */}
              <div className="absolute inset-0 bg-linear-to-tr from-foreground/20 via-transparent to-transparent" />
            </div>

            {/* Floating credential card */}
            {/* <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-card rounded-xl p-4 card-elevated max-w-[220px]">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
                  ].map((src, i) => (
                    <div key={i} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-card">
                      <Image src={src} alt="" fill sizes="32px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="font-display text-xl font-bold text-foreground">৫০০০+</p>
                  <p className="text-[11px] text-muted-foreground">খুশি কাস্টমার</p>
                </div>
              </div>
            </div> */}

            {/* Rating badge */}
            {/* <div className="absolute -top-3 -right-3 sm:-right-6 bg-card rounded-xl p-3 card-elevated">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-foreground text-sm">৪.৯</p>
                  <p className="text-[10px] text-muted-foreground">১২০০+ রিভিউ</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
