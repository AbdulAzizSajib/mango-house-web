'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Upload, Info } from 'lucide-react'

type DailyPhoto = {
  id: string
  src: string
  variety: string
  stage: string
  capturedAt: string
  caption: string
}

const INITIAL: DailyPhoto[] = [
  {
    id: '1',
    src: '/mangoImage/ban/himsagor.JPG.jpeg',
    variety: 'হিমসাগর',
    stage: 'গাছ পাড়ার পর',
    capturedAt: '2026-05-13T06:14',
    caption: 'PHOTO · CRATE OF FRESHLY PICKED HIMSAGOR · MAY 13',
  },
]

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<DailyPhoto[]>(INITIAL)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Omit<DailyPhoto, 'id'>>({
    src: '',
    variety: '',
    stage: '',
    capturedAt: new Date().toISOString().slice(0, 16),
    caption: '',
  })

  const addPhoto = () => {
    if (!draft.src.trim()) return
    setPhotos((p) => [{ ...draft, id: crypto.randomUUID() }, ...p])
    setDraft({
      src: '',
      variety: '',
      stage: '',
      capturedAt: new Date().toISOString().slice(0, 16),
      caption: '',
    })
    setAdding(false)
  }

  const removePhoto = (id: string) => setPhotos((p) => p.filter((x) => x.id !== id))

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Daily Photos</p>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">প্রতিদিনের ছবি</h1>
          <p className="text-sm text-foreground/60 mt-1.5">হিরো স্লাইডারের ছবি যোগ ও মুছে ফেলুন</p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          নতুন ছবি
        </button>
      </div>

      {/* Notice */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900">
          <p className="font-medium mb-0.5">নোট</p>
          <p>এই পরিবর্তনগুলো এখন শুধু লোকাল প্রিভিউ। ব্যাকএন্ড এন্ডপয়েন্ট রেডি হলে আপলোড/সেভ সিঙ্ক করা হবে।</p>
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-card border border-border/60 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Image Path (src)" placeholder="/mangoImage/your-photo.jpg">
              <input
                value={draft.src}
                onChange={(e) => setDraft({ ...draft, src: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm"
              />
            </Field>
            <Field label="Variety (Bangla)" placeholder="হিমসাগর">
              <input
                value={draft.variety}
                onChange={(e) => setDraft({ ...draft, variety: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm"
              />
            </Field>
            <Field label="Stage (Bangla)" placeholder="গাছ পাড়ার পর">
              <input
                value={draft.stage}
                onChange={(e) => setDraft({ ...draft, stage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm"
              />
            </Field>
            <Field label="Captured At" placeholder="">
              <input
                type="datetime-local"
                value={draft.capturedAt}
                onChange={(e) => setDraft({ ...draft, capturedAt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm font-mono"
              />
            </Field>
            <Field label="Caption (English, uppercase)" placeholder="PHOTO · ... · MAY 13" full>
              <input
                value={draft.caption}
                onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm font-mono"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted"
            >
              বাতিল
            </button>
            <button
              onClick={addPhoto}
              disabled={!draft.src.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              যোগ করুন
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {photos.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
          <p className="text-sm text-foreground/60">এখনো কোনো ছবি যোগ করা হয়নি</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((p) => (
            <div key={p.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              <div className="relative aspect-4/3 bg-muted">
                {p.src ? (
                  <Image src={p.src} alt={p.variety} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">no image</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-display text-base font-medium">{p.variety || '—'}</p>
                <p className="text-xs text-foreground/60">{p.stage || '—'}</p>
                <p className="font-mono text-[10px] text-foreground/45 mt-2 truncate">{p.caption}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                  <p className="font-mono text-[10px] text-foreground/50">{p.capturedAt}</p>
                  <button
                    onClick={() => removePhoto(p.id)}
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    মুছে ফেলুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, placeholder, full, children }: { label: string; placeholder?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">
        {label}
      </label>
      {children}
      {placeholder && <p className="font-mono text-[10px] text-foreground/40 mt-1">e.g. {placeholder}</p>}
    </div>
  )
}
