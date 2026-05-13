'use client'

import { useEffect, useState } from 'react'

type Review = {
  name: string
  location: string
  text: string    // featured long quote
}

type MiniReview = {
  text: string    // short quote
  name: string
  location: string
}

const FEATURED_REVIEWS: Review[] = [
  {
    name: 'শাহানা পারভীন',
    location: 'ধানমন্ডি',
    text: 'আমি ঢাকায় আম খুঁজে আর পাই না। বড় হয়েছি রাজশাহীতে, জানি আসল হিমসাগরের কী স্বাদ। মতিউর ভাইয়ের আম খেয়ে ৩০ বছর পরে আবার সেই স্বাদ পেলাম।',
  },
  {
    name: 'রাফসান আহমেদ',
    location: 'উত্তরা',
    text: 'বাচ্চারা এত পছন্দ করেছে যে ২ দিনেই শেষ। কোনো গ্যাস বা ফরমালিনের গন্ধ নেই — একদম গাছ পাকা আমের স্বাদ। প্যাকিংও দারুণ, একটাও নষ্ট হয়নি।',
  },
  {
    name: 'সাবরিনা ইসলাম',
    location: 'চট্টগ্রাম',
    text: 'চট্টগ্রামে বসে রাজশাহীর হিমসাগর হাতে পাওয়াটা একটা ব্যাপার। প্যাকেজিং দেখে মনে হলো কেউ যত্ন করে সাজিয়ে পাঠিয়েছে — একটা আমও নষ্ট হয়নি।',
  },
  {
    name: 'মেহেদী হাসান',
    location: 'সিলেট',
    text: 'অফিসের সহকর্মীদের গিফট করেছিলাম, সবাই এতো প্রশংসা করেছে। দাম যৌক্তিক, কোয়ালিটি দেখেই বোঝা যায় খাঁটি মাল। ধন্যবাদ ভাই।',
  },
]

const MINI_REVIEWS: MiniReview[] = [
  { text: 'ক্যারেটের গায়ে লেখা ছিল "গাছ ২৭"। এমন কিছু আগে কোথাও দেখিনি।', name: 'আরাফাত হোসেন', location: 'বনানী' },
  { text: '৪৭টা আমের মধ্যে একটাও পচা ছিল না। প্যাকিং দারুণ।', name: 'নুসরাত জাহান', location: 'উত্তরা' },
  { text: 'বাচ্চারা প্রথমবার সত্যিকারের হিমসাগর চিনলো। ধন্যবাদ।', name: 'মাহবুব আলম', location: 'মিরপুর' },
  { text: 'ফজলি আম এত বড় হবে ভাবিনি! পুরো ফ্যামিলি মিলে খেয়েছি।', name: 'তানভীর রহমান', location: 'খুলনা' },
  { text: 'গোপালভোগের ঘ্রাণ পেয়েই ছোটবেলার কথা মনে পড়ে গেল।', name: 'ফারিয়া আক্তার', location: 'ঢাকা' },
  { text: 'হোয়াটসঅ্যাপে সব আপডেট দিয়েছে on time। ভরসা করা যায়।', name: 'শাকিল হোসেন', location: 'নারায়ণগঞ্জ' },
  { text: 'রানীপছন্দ প্রথম খেলাম এবার — নাম যেমন স্বাদও তেমন।', name: 'তাসনিম রহমান', location: 'গাজীপুর' },
  { text: 'কুরিয়ার থেকে নিয়ে খুলেই দেখি সব আম একদম ফ্রেশ।', name: 'ইমরান হোসেন', location: 'চট্টগ্রাম' },
]

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

export default function Testimonials() {
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const total = FEATURED_REVIEWS.length

  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(() => setFeaturedIdx((i) => (i + 1) % total), 5000)
    return () => clearInterval(id)
  }, [total])

  return (
    <section id="reviews" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow — serial · label */}
        <div className="flex items-center justify-center gap-3 mb-10 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
          <span className="font-mono tracking-[0.22em] text-primary">
            {toBn(featuredIdx + 1).padStart(2, '০')}
          </span>
          <span className="text-foreground/40">—</span>
          <span className="font-display text-sm text-foreground/70">যাঁরা কিনেছেন</span>
        </div>

        {/* Featured rotating quote */}
        <div className="relative min-h-[260px]" suppressHydrationWarning>
          {FEATURED_REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className={`${i === featuredIdx ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'} transition-opacity duration-700`}
              aria-hidden={i !== featuredIdx}
            >
              <blockquote className="font-display text-2xl sm:text-3xl lg:text-[34px] leading-[1.45] text-foreground/85 text-center max-w-3xl mx-auto">
                <span className="text-primary/70 mr-1" aria-hidden>“</span>
                {r.text}
                <span className="text-primary/70 ml-1" aria-hidden>”</span>
              </blockquote>

              {/* Divider */}
              <div className="flex justify-center mt-10 mb-6">
                <span className="w-40 h-px bg-foreground/20" />
              </div>

              {/* Customer line */}
              <div className="text-center leading-tight">
                <p className="font-display text-base font-medium text-foreground">{r.name}</p>
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-foreground/55 mt-1.5">
                  {r.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          {FEATURED_REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFeaturedIdx(i)}
              aria-label={`রিভিউ ${i + 1}`}
              aria-current={i === featuredIdx}
              className={`h-1 rounded-full transition-all ${i === featuredIdx ? 'w-6 bg-primary' : 'w-2 bg-foreground/20 hover:bg-foreground/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Mini marquee — continuous loop of short quotes */}
      <div className="mt-20 sm:mt-24">
        <div className="marquee group">
          <div className="marquee-track">
            {[...MINI_REVIEWS, ...MINI_REVIEWS].map((m, i) => (
              <article
                key={`${m.name}-${i}`}
                className="marquee-item shrink-0 w-70 sm:w-80 mx-3 sm:mx-4 pt-4 border-t border-foreground/25"
              >
                <p className="font-mono text-[11px] tracking-[0.18em] text-primary mb-3">★★★★★</p>
                <p className="font-display text-[15px] leading-[1.55] text-foreground/85 mb-3">
                  <span className="text-primary/70 mr-0.5" aria-hidden>“</span>
                  {m.text}
                  <span className="text-primary/70 ml-0.5" aria-hidden>”</span>
                </p>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/55">
                  — <span className="font-body tracking-normal normal-case text-[12px] text-foreground/70">{m.name}</span>
                  <span className="mx-1.5 text-foreground/30">·</span>
                  <span className="font-body tracking-normal normal-case text-[12px] text-foreground/55">{m.location}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee styles — scoped via styled-jsx for component locality */}
      <style jsx>{`
        .marquee {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            #000 8%,
            #000 92%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            #000 8%,
            #000 92%,
            transparent
          );
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 55s linear infinite;
        }
        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  )
}
