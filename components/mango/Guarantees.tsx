import { Wallet, ShieldCheck, Sprout, Zap } from 'lucide-react'

const GUARANTEES = [
  {
    Icon: Wallet,
    title: 'নিরাপদ অগ্রিম পেমেন্ট',
    desc: 'পেমেন্ট সম্পন্ন করার পর আপনার নিকটস্থ কুরিয়ার পয়েন্ট থেকে আম সংগ্রহ করুন।',
  },
  {
    Icon: ShieldCheck,
    title: '১০০% তাজা গ্যারান্টি',
    desc: 'পচা বা নষ্ট আম পেলে সম্পূর্ণ টাকা ফেরত অথবা রিপ্লেসমেন্ট।',
  },
  {
    Icon: Sprout,
    title: 'রাসায়নিকমুক্ত',
    desc: 'কার্বাইড, ফরমালিন বা কেমিক্যাল ছাড়া প্রাকৃতিকভাবে পাকানো।',
  },
  {
    Icon: Zap,
    title: '২৪-৪৮ ঘণ্টায় ডেলিভারি',
    desc: 'অর্ডার করার পর দ্রুততম সময়ে আপনার নিকটস্থ কুরিয়ার পয়েন্টে পৌঁছে যাবে।',
  },
]

export default function Guarantees() {
  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-primary" />
            <p className="font-medium text-base">আমাদের প্রতিশ্রুতি</p>
            <span className="w-8 h-px bg-primary" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight">
            কেন <span className=" text-primary">রাজশাহী ম্যাঙ্গো</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GUARANTEES.map(({ Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-2xl p-6 card-elevated card-hover border border-border/40">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
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
