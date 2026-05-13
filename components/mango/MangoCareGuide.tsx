'use client'

import { useState } from 'react'
import { Plus, Phone } from 'lucide-react'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

const GUIDE_SECTIONS = [
  {
    title: 'আম হাতে পাওয়ার পর কী করবেন',
    intro: 'কেমিক্যালমুক্ত আম সংবেদনশীল। সঠিক যত্নে রাখলেই পুরোপুরি স্বাদ পাবেন।',
    points: [
      'প্যাকেট খুলে দ্রুত আম বের করুন; ভেজা/আদ্রতা থাকলে ফ্যানের বাতাসে শুকিয়ে নিন।',
      'পরিষ্কার খড়, পাটের বস্তা, কাঠের তক্তা বা মোটা পেপারের উপর আম রাখুন।',
      'পাকানোর জন্য গরম ও শুষ্ক ঘর বেছে নিন — বদ্ধ স্টোর রুম সবচেয়ে ভালো।',
      'পরিবহনে আঘাত পাওয়া আম আলাদা করে রাখুন — এগুলো আগে ক্ষতিগ্রস্ত হবে।',
      'AC রুম বা খোলা বারান্দায় পাকাতে দেবেন না।',
      'দিনে কয়েকবার চেক করুন — আঙুল চাপ না দিয়ে ঠোকা দিন। টক-টক মানে কাঁচা, ঠস-ঠস মানে পাকা।',
      'কেমিক্যালমুক্ত পাকা আমের মন কাড়া সুগন্ধ থাকে — সুগন্ধ পেলেই দ্রুত খেয়ে ফেলুন।',
      'বেশি পেকে গেলে বোঁটা কেটে পলিথিনে ভরে ফ্রিজে রাখুন — ৫-৭ দিন ভালো থাকবে।',
    ],
  },
  {
    title: 'যা করবেন না',
    intro: 'এই ভুলগুলো এড়িয়ে চললে আম নষ্ট হওয়ার আশঙ্কা অনেক কমে যাবে।',
    points: [
      'আম পানিতে ধুবেন না বা গরম পানির ট্রিটমেন্ট করবেন না — ঠিকমতো পাকবে না।',
      'বাক্স, বালতি বা ক্যারেটের ভেতর গাদা করে রেখে পাকাতে দেবেন না।',
      'ঠান্ডা মেঝের উপর সরাসরি আম রাখবেন না — কিছু অংশ কাঁচা থেকে যাবে।',
      'আমের আঠা ত্বকে লাগলে সঙ্গে সঙ্গে সাবান-পানি দিয়ে ধুয়ে ফেলুন; ৮-১০ মিনিটেই ক্ষত তৈরি হতে পারে।',
      'চোখে লাগলে দ্রুত প্রচুর পানি দিয়ে ধুয়ে নিন; প্রয়োজনে ডাক্তারের পরামর্শ নিন।',
      'সামান্য আঘাতপ্রাপ্ত আম ফেলে দেবেন না — ভালো অংশ সিদ্ধ করে আমসত্ত্ব বানানো যায়।',
    ],
  },
  {
    title: 'দ্রুত পাকাতে চাইলে',
    intro: '১-২ দিনের মধ্যে পাকা আম খেতে চাইলে এই পদ্ধতি।',
    points: [
      'একটি কাগজের ব্যাগে আম ভরুন।',
      'প্রতি ১০টি আমের সঙ্গে ১টি ফরমালিনমুক্ত আপেল/কলা/টমেটো রাখুন।',
      'ব্যাগের মুখ ভালোভাবে বেঁধে গরম স্থানে রাখুন।',
      'ইথিলিন গ্যাসে ১-২ দিনে আম খাওয়ার উপযোগী হয়ে যাবে।',
    ],
  },
  {
    title: 'দেরিতে পাকাতে চাইলে',
    intro: 'অনুষ্ঠানের জন্য সংরক্ষণ করতে চাইলে এভাবে রাখুন।',
    points: [
      'পুষ্ট কাঁচা আম শ্যাওড়া, লাউ-কুমড়া বা কলাপাতা দিয়ে ঢেকে রাখুন।',
      'অথবা কুসুম গরম পানিতে ৫-৬ মিনিট ধুয়ে নিন — কয়েকদিন বেশি সংরক্ষণ করা যাবে।',
    ],
  },
  {
    title: 'বেশিদিন কাঁচা রাখতে চাইলে',
    intro: 'তরকারি বা লবণ-মরিচ মাখিয়ে খাওয়ার জন্য কাঁচা আম দীর্ঘদিন রাখুন।',
    points: [
      'আমের গায়ে সরিষার তেল মাখিয়ে রাখলে কয়েকদিন কাঁচা থাকবে।',
      'বোঁটা কেটে ফ্রিজের ডিপে রাখলে অনেক দিন ভালো থাকে।',
    ],
  },
]

export default function MangoCareGuide() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="care-guide" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-primary" />
          <p className='text-sm font-medium'>  যত্নের গাইড</p>
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-3">
            আম পাওয়ার পর <span className="text-primary">কীভাবে রাখবেন</span>
          </h2>
          <p className="text-foreground/65 text-base sm:text-lg max-w-2xl mx-auto">
            কেমিক্যালমুক্ত আম সংবেদনশীল — সঠিক যত্নে রাখলে পুরো স্বাদ পাবেন। নিচের গাইডটি একবার পড়ে নিন।
          </p>
        </div>

        <div className="space-y-3">
          {GUIDE_SECTIONS.map((section, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={section.title}
                className={`bg-card rounded-xl overflow-hidden border ${
                  isOpen ? 'border-primary/40 card-elevated' : 'border-border/60'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-5 sm:px-6 py-5 flex items-center gap-4 text-left hover:bg-muted/30"
                >
                  <div
                    className={`shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center font-display text-lg font-medium transition-colors ${
                      isOpen
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-primary/40 bg-transparent text-primary'
                    }`}
                  >
                    {toBn(i + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg sm:text-xl font-medium text-foreground leading-tight">
                      {section.title}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? 'bg-primary text-primary-foreground rotate-45'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pt-1">
                      {section.intro && (
                        <p className="text-sm text-foreground/65 italic mb-4 border-l-2 border-primary/40 pl-3">
                          {section.intro}
                        </p>
                      )}
                      <ul className="space-y-2.5">
                        {section.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-foreground/80 leading-relaxed">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
