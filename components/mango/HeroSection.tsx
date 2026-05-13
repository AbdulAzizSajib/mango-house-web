'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ArrowRight, Menu, X } from 'lucide-react'

interface HeroSectionProps {
  onShopNowClick: () => void
}

const NAV_LINKS = [
  { href: '#products', label: 'আমাদের আম' },
  { href: '#reviews', label: 'রিভিউ' },
  { href: '#care-guide', label: 'যত্নের টিপস' },
  { href: '#faq', label: 'FAQ' },
]

const PHONE_DISPLAY = '+880 1782-521705'
const PHONE_TEL = '+8801782521705'

/**
 * Live Bangla date — converts Gregorian to the Bangladesh civil Bangla calendar.
 * Boishakh 1 = April 14 every year; months are 31×6 then 30×6 (leap = +1 on Choitro).
 */
const BN_MONTHS_BN = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র']
const BN_MONTHS_EN = ['Boishakh', 'Joishtho', 'Ashar', 'Shrabon', 'Bhadro', 'Ashshin', 'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro']
const BN_WEEKDAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
const BN_WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const BN_SEASONS_BN = ['গ্রীষ্ম-কাল', 'বর্ষা-কাল', 'শরৎ-কাল', 'হেমন্ত-কাল', 'শীত-কাল', 'বসন্ত-কাল']
const BN_SEASONS_EN = ['Grishmo-Kal', 'Borsha-Kal', 'Shorot-Kal', 'Hemonto-Kal', 'Sheet-Kal', 'Boshonto-Kal']
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

function toBnDigits(n: number | string) {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])
}

function ordinalSuffixBn(day: number) {
  if (day === 1) return 'লা'
  if (day === 2 || day === 3) return 'রা'
  if (day === 4) return 'ঠা'
  return 'শে'
}

function ordinalSuffixEn(day: number) {
  const v = day % 100
  if (v >= 11 && v <= 13) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

function isGregorianLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function toBanglaDate(date: Date) {
  const g_year = date.getFullYear()
  const epochThisYear = new Date(g_year, 3, 14)  // April 14
  let bn_year: number
  let dayOfBnYear: number  // 0-based
  if (date < epochThisYear) {
    bn_year = g_year - 1 - 593
    const epochPrev = new Date(g_year - 1, 3, 14)
    dayOfBnYear = Math.floor((date.getTime() - epochPrev.getTime()) / 86400000)
  } else {
    bn_year = g_year - 593
    dayOfBnYear = Math.floor((date.getTime() - epochThisYear.getTime()) / 86400000)
  }
  // Choitro gets the leap day when next Gregorian year is a leap year
  const nextGregLeap = isGregorianLeap(bn_year + 594)
  const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, nextGregLeap ? 31 : 30]
  let monthIdx = 0
  let remaining = dayOfBnYear
  while (remaining >= monthLengths[monthIdx]) {
    remaining -= monthLengths[monthIdx]
    monthIdx++
  }
  const bn_day = remaining + 1
  const weekdayIdx = date.getDay()
  // Seasons: pairs of months, starting at Boishakh = Grishmo
  const seasonIdx = Math.floor(monthIdx / 2)
  return {
    bn: {
      weekday: BN_WEEKDAYS_BN[weekdayIdx],
      day: toBnDigits(bn_day) + ordinalSuffixBn(bn_day),
      month: BN_MONTHS_BN[monthIdx],
      year: toBnDigits(bn_year),
      season: BN_SEASONS_BN[seasonIdx],
    },
    en: {
      weekday: BN_WEEKDAYS_EN[weekdayIdx],
      day: bn_day + ordinalSuffixEn(bn_day),
      month: BN_MONTHS_EN[monthIdx],
      year: String(bn_year),
      season: BN_SEASONS_EN[seasonIdx],
    },
  }
}

/**
 * Daily hero slides. Drop a new image into /public/mangoImage/hero-slider/
 * and add an entry here — later this list will come from an API.
 */
type HeroSlide = {
  src: string
  alt: string
  variety: string      // e.g. "হিমসাগর"
  stage: string        // e.g. "গাছ পাড়ার পর"
  capturedAt: string   // ISO-like; rendered as MM.DD · hh:mm AM
  caption: string      // English caption strip
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/mangoImage/ban/himsagor.JPG.jpeg',
    alt: 'তাজা হিমসাগর আম',
    variety: 'হিমসাগর',
    stage: 'গাছ পাড়ার পর',
    capturedAt: '2026-05-13T06:14:00',
    caption: 'PHOTO · CRATE OF FRESHLY PICKED HIMSAGOR · MAY 13',
  },
  {
    src: '/mangoImage/Himsagor_1.png',
    alt: 'হিমসাগর',
    variety: 'হিমসাগর',
    stage: 'বাছাইয়ের সময়',
    capturedAt: '2026-05-12T07:02:00',
    caption: 'PHOTO · HAND-SORTED HIMSAGOR LOT · MAY 12',
  },
  {
    src: '/mangoImage/Gopalvog_1.png',
    alt: 'গোপালভোগ',
    variety: 'গোপালভোগ',
    stage: 'পাড়ার আগে শেষবার দেখা',
    capturedAt: '2026-05-11T16:48:00',
    caption: 'PHOTO · GOPALBHOG · MAY 11',
  },
  {
    src: '/mangoImage/amrupali.png',
    alt: 'আম্রপালি',
    variety: 'আম্রপালি',
    stage: 'প্যাকিংয়ের আগে',
    capturedAt: '2026-05-10T09:30:00',
    caption: 'PHOTO · AMRAPALI BATCH · MAY 10',
  },
]

function formatStamp(iso: string) {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return { date: `${mm}.${dd}`, time: `${String(h).padStart(2, '0')}:${m}`, ampm }
}

export default function HeroSection({ onShopNowClick }: HeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  // Client-only so SSR/client agree; null on first render to avoid hydration mismatch.
  const [bnDate, setBnDate] = useState<ReturnType<typeof toBanglaDate> | null>(null)

  useEffect(() => {
    const tick = () => setBnDate(toBanglaDate(new Date()))
    tick()
    // Re-tick at next midnight so the date flips without a reload.
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const id = setTimeout(tick, msUntilMidnight + 1000)
    return () => clearTimeout(id)
  }, [])

  const goTo = useCallback((i: number) => {
    const n = HERO_SLIDES.length
    setSlideIndex(((i % n) + n) % n)
  }, [])

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(id)
  }, [])

  const slide = HERO_SLIDES[slideIndex]
  const stamp = formatStamp(slide.capturedAt)
  const total = HERO_SLIDES.length

  return (
    <>
      {/* Top navigation */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <p className="font-display text-lg sm:text-2xl font-medium text-foreground">রাজশাহী ম্যাঙ্গো</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground tracking-wider uppercase">Since 2025</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-base font-medium text-foreground/80">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-primary">{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Mobile: editorial monospace phone link */}
            <a
              href={`tel:${PHONE_TEL}`}
              className="md:hidden font-mono text-[13px] tracking-tight text-foreground/90 underline underline-offset-[6px] decoration-foreground/40 hover:decoration-foreground"
            >
              {PHONE_DISPLAY}
            </a>

            {/* Desktop: editorial monospace phone link */}
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden md:inline-block font-mono text-sm tracking-tight text-foreground/90 underline underline-offset-[6px] decoration-foreground/40 hover:decoration-foreground"
            >
              {PHONE_DISPLAY}
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors"
              aria-label="মেনু"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="order-2 lg:order-1">
            {/* Today's Bangla date — live, stacked Bangla over English */}
            <div className="mb-6 flex items-start gap-2.5 min-h-11" suppressHydrationWarning>
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
              {bnDate && (
                <div className="leading-tight">
                  <p className="font-display text-base sm:text-lg font-medium text-secondary">
                    <span className="text-secondary/60">আজ</span>
                    <span className="mx-2 text-secondary/50">·</span>
                    {bnDate.bn.weekday}
                    <span className="mx-2 text-secondary/50">·</span>
                    {bnDate.bn.day} {bnDate.bn.month} {bnDate.bn.year}
                  </p>
                  <p className="mt-1 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-foreground/45">
                    <span className="text-foreground/35">TODAY</span>
                    <span className="mx-1.5 text-foreground/30">·</span>
                    {bnDate.en.weekday}
                    <span className="mx-1.5 text-foreground/30">·</span>
                    {bnDate.en.day} {bnDate.en.month} {bnDate.en.year}
                    <span className="mx-1.5 text-foreground/30">·</span>
                    {bnDate.en.season}
                  </p>
                </div>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.05] mb-6">
              বাগান থেকে<br />
              <span className="text-primary">সরাসরি</span> <br /> আপনার ঘরে
            </h1>

            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
            রাজশাহীর সেরা আম বাগান থেকে সংগ্রহ করা বাছাইকৃত ফ্রেশ আম, <br/> নিরাপদ প্যাকেজিংয়ের মাধ্যমে দেশের নিকটস্থ কুরিয়ার সার্ভিসে দ্রুত পাঠানো হয়।
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
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-2 border-secondary/30 text-secondary font-medium text-base hover:border-secondary hover:bg-secondary/8"
              >
                হোয়াটসঅ্যাপে অর্ডার
              </a>
            </div>

            {/* Trust strip */}
            {/* <div className="grid grid-cols-3 gap-4 max-w-max">
              {[
                { Icon: Leaf, label: '১০০% অর্গানিক আম', green: true },
                { Icon: ShieldCheck, label: 'নিরাপদ ও কেমিক্যালমুক্ত', green: true },
                { Icon: Truck, label: 'দ্রুত ডেলিভারি', green: false },
              ].map(({ Icon, label, green }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${green ? 'bg-secondary/10' : 'bg-muted'}`}>
                    <Icon className={`w-4 h-4 ${green ? 'text-secondary' : 'text-primary'}`} />
                  </div>
                  <p className="text-sm font-medium text-foreground/80 leading-tight">{label}</p>
                </div>
              ))}
            </div> */}
          </div>

          {/* Right: editorial daily slider */}
          <div className="hidden lg:block order-1 lg:order-2 relative">
            <div
              className="relative aspect-4/5 sm:aspect-5/6 p-3 sm:p-4 rounded-sm bg-[#EFE6D2] overflow-hidden"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(120,80,30,0.10) 0 1px, transparent 1px 14px)',
              }}
              role="region"
              aria-roledescription="carousel"
              aria-label="আজকের আমের ছবি"
            >
              {/* Photo plate */}
              <div className="relative w-full h-[calc(100%-44px)] overflow-hidden">
                {HERO_SLIDES.map((s, i) => (
                  <div
                    key={s.src}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === slideIndex ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden={i !== slideIndex}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-linear-to-tr from-foreground/15 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Circular date stamp — top right */}
              <div className="absolute top-5 right-5 w-27.5 h-27.5 rounded-full border border-foreground/50 bg-[#EFE6D2]/85 backdrop-blur-[1px] flex items-center justify-center text-center px-3">
                <div className="leading-tight">
                  <p className="font-display text-[13px] text-foreground/80">
                    পাড়া হয়েছে<br />আজ ভোরে
                  </p>
                  <p className="font-mono text-[10px] mt-1 text-primary tracking-tight">
                    {stamp.date}
                    <br />
                    {stamp.time} {stamp.ampm}
                  </p>
                </div>
              </div>

              {/* Caption strip — bottom */}
              <div className="absolute left-3 right-3 sm:left-4 sm:right-4 bottom-3 sm:bottom-4 border-t border-foreground/40 bg-[#EFE6D2]/90 px-3 py-2">
                <p className="font-mono text-[11px] tracking-[0.08em] text-foreground/80 truncate">
                  {slide.caption}
                </p>
              </div>

              {/* Click areas for prev/next */}
              <button
                type="button"
                onClick={() => goTo(slideIndex - 1)}
                aria-label="আগের ছবি"
                className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize focus:outline-none"
              />
              <button
                type="button"
                onClick={() => goTo(slideIndex + 1)}
                aria-label="পরের ছবি"
                className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize focus:outline-none"
              />
            </div>

            {/* Below-frame metadata: variety · stage  +  plate counter */}
            <div className="flex items-center justify-between mt-3 px-1 text-[13px]">
              <p className="font-display text-foreground/80">
                <span>{slide.variety}</span>
                <span className="mx-2 text-foreground/40">·</span>
                <span className="text-foreground/60">{slide.stage}</span>
              </p>
              <p className="font-mono tracking-tight text-foreground/70">
                প্লেট {String(slideIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mt-2 px-1">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`স্লাইড ${i + 1}`}
                  aria-current={i === slideIndex}
                  className={`h-1 rounded-full transition-all ${
                    i === slideIndex ? 'w-6 bg-primary' : 'w-2 bg-foreground/20 hover:bg-foreground/40'
                  }`}
                />
              ))}
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
    </>
  )
}
