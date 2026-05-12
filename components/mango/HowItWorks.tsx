import { ShoppingCart, Package, Truck } from 'lucide-react'

const STEPS = [
  {
    num: '০১',
    Icon: ShoppingCart,
    title: 'অর্ডার করুন',
    desc: 'পছন্দের আম বেছে নিয়ে কয়েক ক্লিকে অর্ডার সম্পন্ন করুন। ।',
  },
  {
    num: '০২',
    Icon: Package,
    title: 'যত্নে প্যাকিং',
    desc: 'বাগান থেকে তাজা আম এনে বিশেষ প্যাকেজিং-এ পাঠানোর প্রস্তুতি নেওয়া হয়।',
  },
  {
    num: '০৩',
    Icon: Truck,
    title: 'দ্রুত ডেলিভারি',
    desc: '২৪–৪৮ ঘণ্টার মধ্যে আপনার ঠিকানায় হোম ডেলিভারি অথবা নিকটস্থ সুন্দরবন কুরিয়ার , AJR কুরিয়ার সার্ভিস থেকে তাজা আম সংগ্রহ করুন।',
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <div className="eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-primary" />
         <p className='font-medium text-base'>   কীভাবে কাজ করে</p>
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-4">
            মাত্র <span className=" text-primary">৩ ধাপে</span> আম আপনার ঘরে
          </h2>
          <p className="text-foreground/65 text-base sm:text-lg">
            সহজ, দ্রুত ও ঝামেলামুক্ত অর্ডার প্রক্রিয়া
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-border" />

          {STEPS.map(({ num, Icon, title, desc }, i) => (
            <div key={num} className="relative bg-card rounded-2xl p-7 card-elevated card-hover">
              <div className="relative mb-6 flex items-center justify-between">
                <div className="w-16 h-16 rounded-xl bg-primary text-primary-foreground flex items-center justify-center card-elevated">
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
                <span className="font-display text-5xl font-medium text-muted/80">{num}</span>
              </div>

              <h3 className="font-display text-2xl font-medium text-foreground mb-2">
                {title}
              </h3>
              <p className="text-foreground/65 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
