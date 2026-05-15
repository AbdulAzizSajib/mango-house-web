"use client";

import { useEffect, useState } from "react";
import { X, Globe, Phone, Truck } from "lucide-react";
import Image from "next/image";

const SESSION_KEY = "mango_popup_seen";

const SCHEDULE = [
  { name: "গুটি আম", date: "১৫ মে  " },
  { name: "গোপালভোগ", date: "২২ মে" },
  { name: "লক্ষণভোগ / লখনা / রানীপছন্দ", date: "২৫ মে" },
  { name: "হিমসাগর / খিরসাপাত", date: "৩০ মে" },
  { name: "ল্যাংড়া", date: "১০ জুন" },
  { name: "আম্রপালি / ফজলি", date: "১৫ জুন" },
  { name: "বারি-৪", date: "৫ জুলাই" },
  { name: "আশ্বিনা", date: "১০ জুলাই" },
  { name: "গৌড়মতি", date: "১৫ জুলাই" },
];

export default function AnnouncementPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Popup */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          background: "#FFF8F0",
          borderColor: "rgba(217,119,6,0.15)",
        }}
      >
        {/* Close */}
        <button
          onClick={close}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full transition"
          style={{ background: "#FAF3E9" }}
        >
          <X className="h-4 w-4 text-[#D97706]" />
        </button>

        <div className="grid md:grid-cols-[320px_1fr]">
          {/* Left */}
          <div className="relative px-8 py-10 flex flex-col justify-center overflow-hidden">
            <Image
              src="/mangoImage/Himsagor_1.png"
              alt="Himsagar Mango"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold leading-snug text-white drop-shadow-lg">
                আম সংগ্রহের
                <br />
                সম্ভাব্য সময়সূচি
              </h2>

              <p className="mt-3 text-2xl font-bold text-amber-300 drop-shadow font-display">
                ২০২৬ মৌসুম
              </p>

              <div className="mt-6 h-px bg-white/20" />
            </div>
          </div>

          {/* Right */}
          <div className="p-4 bg-[#FFF8F0]">
            <div className="mb-2">
              <h3 className="text-xl font-bold text-[#2B2B2B]">
                সম্ভাব্য সংগ্রহ তালিকা
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                আবহাওয়া ও মৌসুম অনুযায়ী তারিখ কিছুটা পরিবর্তন হতে পারে
              </p>
            </div>

            <div className="space-y-2">
              {SCHEDULE.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border px-2 py-1 transition-all hover:translate-x-0.5"
                  style={{
                    background: i % 2 === 0 ? "#FFFFFF" : "#FAF3E9",
                    borderColor: "rgba(217,119,6,0.10)",
                  }}
                >
                  <p className="text-sm md:text-[15px] font-medium text-[#2B2B2B]">
                    {item.name}
                  </p>

                  <span
                    className="rounded-full font-display px-3 py-1 text-sm font-semibold"
                    style={{
                      background: "#D97706",
                      color: "#fff",
                    }}
                  >
                    {item.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-t pt-4"
              style={{ borderColor: "rgba(217,119,6,0.12)" }}
            >
              <p className="text-xs text-neutral-500">
                তথ্যসূত্র: দৈনিক কালবেলা
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
