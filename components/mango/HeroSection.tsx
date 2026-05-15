"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar";

interface HeroSectionProps {
  onShopNowClick: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Bangla date helpers ───────────────────────────────────────────────────────
const BN_MONTHS_BN = [
  "বৈশাখ",
  "জ্যৈষ্ঠ",
  "আষাঢ়",
  "শ্রাবণ",
  "ভাদ্র",
  "আশ্বিন",
  "কার্তিক",
  "অগ্রহায়ণ",
  "পৌষ",
  "মাঘ",
  "ফাল্গুন",
  "চৈত্র",
];
const BN_MONTHS_EN = [
  "Boishakh",
  "Joishtho",
  "Ashar",
  "Shrabon",
  "Bhadro",
  "Ashshin",
  "Kartik",
  "Ogrohayon",
  "Poush",
  "Magh",
  "Falgun",
  "Choitro",
];
const BN_WEEKDAYS_BN = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];
const BN_WEEKDAYS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const BN_SEASONS_BN = [
  "গ্রীষ্ম-কাল",
  "বর্ষা-কাল",
  "শরৎ-কাল",
  "হেমন্ত-কাল",
  "শীত-কাল",
  "বসন্ত-কাল",
];
const BN_SEASONS_EN = [
  "Grishmo-Kal",
  "Borsha-Kal",
  "Shorot-Kal",
  "Hemonto-Kal",
  "Sheet-Kal",
  "Boshonto-Kal",
];
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBnDigits(n: number | string) {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}
function ordinalSuffixBn(day: number) {
  if (day === 1) return "লা";
  if (day === 2 || day === 3) return "রা";
  if (day === 4) return "ঠা";
  return "শে";
}
function ordinalSuffixEn(day: number) {
  const v = day % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
function isGregorianLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
function toBanglaDate(date: Date) {
  const g_year = date.getFullYear();
  const epochThisYear = new Date(g_year, 3, 14);
  let bn_year: number;
  let dayOfBnYear: number;
  if (date < epochThisYear) {
    bn_year = g_year - 1 - 593;
    const epochPrev = new Date(g_year - 1, 3, 14);
    dayOfBnYear = Math.floor((date.getTime() - epochPrev.getTime()) / 86400000);
  } else {
    bn_year = g_year - 593;
    dayOfBnYear = Math.floor(
      (date.getTime() - epochThisYear.getTime()) / 86400000,
    );
  }
  const nextGregLeap = isGregorianLeap(bn_year + 594);
  const monthLengths = [
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    30,
    nextGregLeap ? 31 : 30,
  ];
  let monthIdx = 0;
  let remaining = dayOfBnYear;
  while (remaining >= monthLengths[monthIdx]) {
    remaining -= monthLengths[monthIdx];
    monthIdx++;
  }
  const bn_day = remaining + 1;
  const weekdayIdx = date.getDay();
  const seasonIdx = Math.floor(monthIdx / 2);
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
  };
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type Banner = {
  images: string[];
  alt: string;
  variety: string;
  harvestDate: string | null;
};

const FALLBACK: Banner[] = [
  {
    images: ["/mangoImage/ban/himsagor.JPG.jpeg", "/mangoImage/Himsagor_1.png"],
    alt: "হিমসাগর আম",
    variety: "হিমসাগর",
    harvestDate: null,
  },
  {
    images: ["/mangoImage/Himsagor_1.png"],
    alt: "হিমসাগর",
    variety: "হিমসাগর",
    harvestDate: null,
  },
  {
    images: ["/mangoImage/Gopalvog_1.png"],
    alt: "গোপালভোগ",
    variety: "গোপালভোগ",
    harvestDate: null,
  },
  {
    images: ["/mangoImage/amrupali.png"],
    alt: "আম্রপালি",
    variety: "আম্রপালি",
    harvestDate: null,
  },
];

function formatStamp(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return {
    date: `${mm}.${dd}`,
    time: `${String(h).padStart(2, "0")}:${m}`,
    ampm,
  };
}

export default function HeroSection({ onShopNowClick }: HeroSectionProps) {
  const [images, setImages] = useState<Banner[]>(FALLBACK);
  const [bnDate, setBnDate] = useState<ReturnType<typeof toBanglaDate> | null>(
    null,
  );

  useEffect(() => {
    fetch(`${BASE_URL}/hero-banners`)
      .then((r) => r.json())
      .then((json) => {
        const banners: {
          title: string;
          images: string[];
          isActive: boolean;
          harvestDate: string | null;
        }[] = json?.data ?? [];
        const active = banners
          .filter((b) => b.isActive && b.images.length > 0)
          .slice(0, 4);
        if (active.length === 0) return;
        setImages(
          active.map((b) => ({
            images: b.images,
            alt: b.title,
            variety: b.title,
            harvestDate: b.harvestDate,
          })),
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tick = () => setBnDate(toBanglaDate(new Date()));
    tick();
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();
    const id = setTimeout(tick, msUntilMidnight + 1000);
    return () => clearTimeout(id);
  }, []);

  const stamp = images[0]?.harvestDate
    ? formatStamp(images[0].harvestDate)
    : null;
  const cells = [...images, ...FALLBACK].slice(0, 4);

  return (
    <>
      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left: copy ── */}
          <div className="order-2 lg:order-1">
            {/* Bangla date */}
            <div
              className="mb-6 flex items-start gap-2.5 min-h-11"
              suppressHydrationWarning
            >
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                aria-hidden
              />
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

            {/* FIX: cleaner heading — no awkward mid-line breaks on mobile */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium text-foreground leading-[1.08] mb-6">
              রাজশাহীর বাগান থেকে{" "}
              <span className="text-primary font-extrabold">সরাসরি</span> আপনার
              ঘরে
            </h1>

            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
              রাজশাহীর সেরা আম বাগান থেকে সংগ্রহ করা বাছাইকৃত টাটকা আম, নিরাপদ
              প্যাকেজিংয়ের মাধ্যমে দ্রুত হোম ডেলিভারি কিংবা নিকটস্থ কুরিয়ার
              পয়েন্টে পৌঁছে দেওয়া হয়।
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={onShopNowClick}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground text-base hover:bg-primary/90 card-elevated hover:scale-[1.02] active:scale-[0.98] font-medium transition-all"
              >
                আম দেখুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* FIX: WhatsApp button now has the logo */}
              <a
                href="https://wa.me/8801782521705"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full border-2 border-secondary/30 text-secondary font-medium text-base hover:border-secondary hover:bg-secondary/8 transition-all"
              >
                <img src="/whatsapp.png" alt="" className="w-5 h-5" />
                হোয়াটসঅ্যাপে অর্ডার
              </a>
            </div>

            {/* FIX: mobile — show a single featured image instead of nothing */}
            <div className="lg:hidden relative rounded-2xl overflow-hidden h-56 sm:h-72 w-full">
              <figure className="hover-gallery w-full h-full">
                {cells[0].images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={i === 0 ? cells[0].alt : ""}
                    className="w-full h-full object-cover"
                  />
                ))}
              </figure>
              <div className="absolute inset-0 bg-linear-to-t from-foreground/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4">
                <p className="font-display text-white text-base font-medium">
                  {cells[0].variety}
                </p>
              </div>
              {stamp && (
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-border/30">
                  <p className="font-mono text-[11px] text-foreground/60 leading-none tracking-wider">
                    {stamp.date}
                  </p>
                  <p className="font-mono text-lg font-medium text-primary leading-tight tracking-tight mt-0.5">
                    {stamp.time}
                  </p>
                  <p className="font-mono text-[10px] text-foreground/50 leading-none">
                    {stamp.ampm}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Bento Gallery (desktop only) ── */}
          <div className="hidden lg:block order-1 lg:order-2 relative">
            {/* FIX: use aspect-based rows instead of hardcoded h-140 */}
            <div
              className="grid grid-cols-2 gap-2"
              style={{ gridTemplateRows: "1fr 1fr 9rem" }}
            >
              {/* Cell 1 — tall left, spans 2 rows */}
              <div className="relative row-span-2 rounded-2xl overflow-hidden min-h-0">
                <figure className="hover-gallery w-full h-full">
                  {cells[0].images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={i === 0 ? cells[0].alt : ""}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </figure>
                <div className="absolute inset-0 bg-linear-to-t from-foreground/50 via-transparent to-transparent pointer-events-none" />

                {/* Stamp */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-border/30 shadow-lg">
                  {stamp ? (
                    <>
                      <p className="font-mono text-[11px] text-foreground/60 leading-none tracking-wider">
                        {stamp.date}
                      </p>
                      <p className="font-mono text-lg font-medium text-primary leading-tight tracking-tight mt-0.5">
                        {stamp.time}
                      </p>
                      <p className="font-mono text-[10px] text-foreground/50 leading-none">
                        {stamp.ampm}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-[11px] text-foreground/60 leading-none tracking-wider">
                        তাজা
                      </p>
                      <p className="font-display text-sm font-medium text-primary leading-tight mt-0.5">
                        আম
                      </p>
                    </>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                  <p className="font-display text-white text-sm font-medium leading-tight">
                    {cells[0].variety}
                  </p>
                </div>
              </div>

              {/* Cell 2 — top right */}
              <div className="relative rounded-2xl overflow-hidden min-h-0">
                <figure className="hover-gallery w-full h-full">
                  {cells[1].images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={i === 0 ? cells[1].alt : ""}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </figure>
                <div className="absolute inset-0 bg-linear-to-t from-foreground/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 right-3 pointer-events-none">
                  <p className="font-display text-white text-xs font-medium">
                    {cells[1].variety}
                  </p>
                </div>
              </div>

              {/* Cell 3 — bottom right */}
              <div className="relative rounded-2xl overflow-hidden min-h-0">
                <figure className="hover-gallery w-full h-full">
                  {cells[2].images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={i === 0 ? cells[2].alt : ""}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </figure>
                <div className="absolute inset-0 bg-linear-to-t from-foreground/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-3 right-3 pointer-events-none">
                  <p className="font-display text-white text-xs font-medium">
                    {cells[2].variety}
                  </p>
                </div>
              </div>

              {/* Cell 4 — wide bottom, spans 2 cols */}
              <div className="relative col-span-2 rounded-2xl overflow-hidden">
                <figure className="hover-gallery w-full h-full">
                  {cells[3].images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={i === 0 ? cells[3].alt : ""}
                      className="w-full h-full object-cover object-center"
                    />
                  ))}
                </figure>
                <div className="absolute inset-0 bg-linear-to-r from-foreground/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 left-4 flex flex-col justify-center pointer-events-none">
                  <p className="font-display text-white text-sm font-medium">
                    {cells[3].variety}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
