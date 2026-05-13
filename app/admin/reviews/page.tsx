'use client'

import { useState } from 'react'
import { Plus, Trash2, Info, Star } from 'lucide-react'

type Review = {
  id: string
  kind: 'featured' | 'mini'
  name: string
  location: string
  text: string
}

const INITIAL: Review[] = [
  { id: '1', kind: 'featured', name: 'শাহানা পারভীন', location: 'ধানমন্ডি', text: 'আমি ঢাকায় আম খুঁজে আর পাই না। বড় হয়েছি রাজশাহীতে...' },
  { id: '2', kind: 'mini', name: 'নুসরাত জাহান', location: 'উত্তরা', text: '৪৭টা আমের মধ্যে একটাও পচা ছিল না।' },
]

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Omit<Review, 'id'>>({ kind: 'mini', name: '', location: '', text: '' })
  const [tab, setTab] = useState<'featured' | 'mini'>('featured')

  const filtered = reviews.filter((r) => r.kind === tab)

  const addReview = () => {
    if (!draft.name.trim() || !draft.text.trim()) return
    setReviews((r) => [{ ...draft, id: crypto.randomUUID() }, ...r])
    setDraft({ kind: tab, name: '', location: '', text: '' })
    setAdding(false)
  }

  const removeReview = (id: string) => setReviews((r) => r.filter((x) => x.id !== id))

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Reviews</p>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">কাস্টমার রিভিউ</h1>
          <p className="text-sm text-foreground/60 mt-1.5">ফিচারড ও ছোট রিভিউ ম্যানেজ করুন</p>
        </div>
        <button
          onClick={() => { setDraft({ ...draft, kind: tab }); setAdding((v) => !v) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          নতুন রিভিউ
        </button>
      </div>

      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900">
          <p className="font-medium mb-0.5">নোট</p>
          <p>লোকাল প্রিভিউ — ব্যাকএন্ড এন্ডপয়েন্ট রেডি হলে সিঙ্ক হবে।</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-border/60">
        <TabBtn active={tab === 'featured'} onClick={() => setTab('featured')} label="ফিচারড" en="Featured" count={reviews.filter((r) => r.kind === 'featured').length} />
        <TabBtn active={tab === 'mini'} onClick={() => setTab('mini')} label="ছোট রিভিউ" en="Mini (Marquee)" count={reviews.filter((r) => r.kind === 'mini').length} />
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-card border border-border/60 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">Name</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="শাহানা পারভীন"
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">Location</label>
              <input
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                placeholder="ধানমন্ডি"
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">Review Text</label>
              <textarea
                rows={tab === 'featured' ? 4 : 2}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">
              বাতিল
            </button>
            <button
              onClick={addReview}
              disabled={!draft.name.trim() || !draft.text.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              যোগ করুন
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
          <p className="text-sm text-foreground/60">এই ট্যাবে কোনো রিভিউ নেই</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-card border border-border/60 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-0.5 mb-2 text-primary">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">"{r.text}"</p>
                  <p className="text-xs text-foreground/65">
                    <span className="font-medium text-foreground">{r.name}</span>
                    {r.location && <span className="text-foreground/40"> · {r.location}</span>}
                  </p>
                </div>
                <button
                  onClick={() => removeReview(r.id)}
                  className="text-destructive hover:bg-destructive/10 rounded-lg p-2"
                  aria-label="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, label, en, count }: { active: boolean; onClick: () => void; label: string; en: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 -mb-px border-b-2 transition-colors ${
        active ? 'border-primary text-foreground' : 'border-transparent text-foreground/60 hover:text-foreground'
      }`}
    >
      <p className="text-sm font-medium">
        {label} <span className="font-mono text-[10px] text-foreground/45">({count})</span>
      </p>
      <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-foreground/45 mt-0.5">{en}</p>
    </button>
  )
}
