'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

type Testimonial = {
  id: string
  name: string
  location: string
  comment: string
  isApproved: boolean
  isFeatured: boolean
  createdAt: string
}

const inp = 'w-full px-3 py-2.5 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const EMPTY_FORM = { name: '', comment: '', location: '' }
type FormState = typeof EMPTY_FORM
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function Testimonials() {
  const [featured, setFeatured] = useState<Testimonial[]>([])
  const [mini, setMini] = useState<Testimonial[]>([])
  const [featuredIdx, setFeaturedIdx] = useState(0)

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errMsg, setErrMsg] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  // Fetch public testimonials on mount
  useEffect(() => {
    fetch(`${BASE_URL}/testimonials`)
      .then((r) => r.json())
      .then((json) => {
        const data: Testimonial[] = json?.data ?? []
        setFeatured(data.filter((t) => t.isFeatured))
        setMini(data.filter((t) => !t.isFeatured))
      })
      .catch(() => {})
  }, [])

  // Auto-rotate featured
  useEffect(() => {
    if (featured.length <= 1) return
    const id = setInterval(() => setFeaturedIdx((i) => (i + 1) % featured.length), 5000)
    return () => clearInterval(id)
  }, [featured.length])

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.comment.trim()) return
    setStatus('loading')
    setErrMsg('')
    try {
      const res = await fetch(`${BASE_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || 'কিছু একটা সমস্যা হয়েছে')
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch (err) {
      setStatus('error')
      setErrMsg(err instanceof Error ? err.message : 'কিছু একটা সমস্যা হয়েছে')
    }
  }

  const marqueeItems = mini.length > 0 ? [...mini, ...mini] : []

  return (
    <section id="reviews" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-10 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
          {featured.length > 0 && (
            <span className="font-mono tracking-[0.22em] text-primary">
              {toBn(featuredIdx + 1).padStart(2, '০')}
            </span>
          )}
          <span className="text-foreground/40">—</span>
          <span className="font-display text-sm text-foreground/70">যাঁরা কিনেছেন</span>
        </div>

        {/* Featured rotating quote */}
        {featured.length > 0 && (
          <>
            <div className="relative min-h-65" suppressHydrationWarning>
              {featured.map((r, i) => (
                <div
                  key={r.id}
                  className={`${i === featuredIdx ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'} transition-opacity duration-700`}
                  aria-hidden={i !== featuredIdx}
                >
                  <blockquote className="font-display text-2xl sm:text-3xl lg:text-[34px] leading-[1.45] text-foreground/85 text-center max-w-3xl mx-auto">
                    <span className="text-primary/70 mr-1" aria-hidden>"</span>
                    {r.comment}
                    <span className="text-primary/70 ml-1" aria-hidden>"</span>
                  </blockquote>

                  <div className="flex justify-center mt-10 mb-6">
                    <span className="w-40 h-px bg-foreground/20" />
                  </div>

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
              {featured.map((_, i) => (
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
          </>
        )}
      </div>

      {/* Mini marquee */}
      {marqueeItems.length > 0 && (
        <div className="mt-20 sm:mt-24">
          <div className="marquee group">
            <div className="marquee-track">
              {marqueeItems.map((m, i) => (
                <article
                  key={`${m.id}-${i}`}
                  className="marquee-item shrink-0 w-70 sm:w-80 mx-3 sm:mx-4 pt-4 border-t border-foreground/25"
                >
                  <p className="font-mono text-[11px] tracking-[0.18em] text-primary mb-3">★★★★★</p>
                  <p className="font-display text-[15px] leading-[1.55] text-foreground/85 mb-3">
                    <span className="text-primary/70 mr-0.5" aria-hidden>"</span>
                    {m.comment}
                    <span className="text-primary/70 ml-0.5" aria-hidden>"</span>
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
      )}

      {/* Write a review */}
      <div ref={formRef} className="mt-20 sm:mt-28 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary">আপনার মতামত</span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-foreground mt-2">রিভিউ লিখুন</h2>
          <p className="text-sm text-foreground/55 mt-1.5">আমাদের আম কেমন লেগেছে জানালে আমরা খুশি হবো</p>
        </div>

        {status === 'success' ? (
          <div className="bg-secondary/10 border border-secondary/30 rounded-2xl px-6 py-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-secondary mx-auto mb-3" />
            <p className="font-display text-lg font-medium text-foreground">ধন্যবাদ আপনার রিভিউয়ের জন্য!</p>
            <p className="text-sm text-foreground/60 mt-1.5 mb-5">আমরা রিভিউটি যাচাই করে প্রকাশ করবো।</p>
            <button
              onClick={() => setStatus('idle')}
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
            >
              আরেকটি রিভিউ লিখুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 space-y-4">
            {status === 'error' && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">
                  নাম <span className="text-primary">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="আপনার নাম"
                  required
                  className={inp}
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">
                  এলাকা
                </label>
                <input
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="ঢাকা, চট্টগ্রাম..."
                  className={inp}
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">
                আপনার অভিজ্ঞতা <span className="text-primary">*</span>
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => set('comment', e.target.value)}
                placeholder="আমাদের আম সম্পর্কে আপনার মতামত লিখুন..."
                rows={4}
                required
                className={`${inp} resize-none`}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={status === 'loading' || !form.name.trim() || !form.comment.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {status === 'loading'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> পাঠানো হচ্ছে...</>
                  : <><Send className="w-4 h-4" /> রিভিউ পাঠান</>}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .marquee {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
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
