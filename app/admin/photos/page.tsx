'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import {
  Plus, Trash2, Upload, Loader2, AlertCircle,
  Pencil, X, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getBanners, createBanner, updateBanner, deleteBanner,
  type HeroBanner, type CreateBannerPayload, type UpdateBannerPayload,
} from '@/lib/api'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'GOPALBHOG', 'HIMSAGAR', 'RANIPOCHONDO',
  'LANGRA', 'AMRAPALI', 'FAZLI', 'OTHER',
] as const

const EMPTY: CreateBannerPayload = {
  title: '', subtitle: '', category: '',
  harvestDate: '', isActive: true, images: [],
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPhotosPage() {
  const qc = useQueryClient()
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>('idle')
  const [editTarget, setEditTarget] = useState<HeroBanner | null>(null)
  const [draft, setDraft] = useState<CreateBannerPayload>(EMPTY)
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [removeImages, setRemoveImages] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  // ── GET ──
  const { data: banners = [], isLoading, isError: listError } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: getBanners,
  })

  // ── CREATE ──
  const createMut = useMutation({
    mutationFn: createBanner,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hero-banners'] }); closeForm() },
  })

  // ── UPDATE ──
  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBannerPayload }) =>
      updateBanner(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hero-banners'] }); closeForm() },
  })

  // ── DELETE ──
  const deleteMut = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hero-banners'] }),
  })

  // ── helpers ──
  const closeForm = () => {
    setMode('idle'); setEditTarget(null)
    setDraft(EMPTY); setNewPreviews([]); setRemoveImages([])
    createMut.reset(); updateMut.reset()
  }

  const openEdit = (b: HeroBanner) => {
    setEditTarget(b)
    setDraft({
      title: b.title,
      subtitle: b.subtitle ?? '',
      category: b.category ?? '',
      harvestDate: b.harvestDate ?? '',
      isActive: b.isActive,
      images: [],
    })
    setNewPreviews([]); setRemoveImages([])
    createMut.reset(); updateMut.reset()
    setMode('edit')
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    setDraft((d) => ({ ...d, images: [...d.images, ...arr] }))
    setNewPreviews((p) => [...p, ...arr.map((f) => URL.createObjectURL(f))])
  }

  const removeNewImage = (idx: number) => {
    setDraft((d) => ({ ...d, images: d.images.filter((_, i) => i !== idx) }))
    setNewPreviews((p) => p.filter((_, i) => i !== idx))
  }

  const toggleRemoveExisting = (url: string) =>
    setRemoveImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    )

  const set = (k: keyof CreateBannerPayload, v: string | boolean | File[]) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const handleSubmit = () => {
    if (!draft.title.trim()) return
    if (mode === 'create') {
      if (draft.images.length === 0) return
      createMut.mutate(draft)
    } else if (mode === 'edit' && editTarget) {
      const payload: UpdateBannerPayload = {
        title: draft.title,
        subtitle: draft.subtitle || undefined,
        category: draft.category || undefined,
        harvestDate: draft.harvestDate || undefined,
        isActive: draft.isActive,
        images: draft.images.length > 0 ? draft.images : undefined,
        removeImages: removeImages.length > 0 ? removeImages : undefined,
      }
      updateMut.mutate({ id: editTarget.id, payload })
    }
  }

  const isPending = createMut.isPending || updateMut.isPending
  const mutError = (createMut.error || updateMut.error) as Error | null

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Hero Banners</p>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">হিরো ব্যানার</h1>
          <p className="text-sm text-foreground/60 mt-1.5">হোমপেজ স্লাইডারের জন্য ব্যানার ম্যানেজ করুন</p>
        </div>
        {mode === 'idle' && (
          <button
            onClick={() => setMode('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> নতুন ব্যানার
          </button>
        )}
      </div>

      {/* Form — create or edit */}
      {(mode === 'create' || mode === 'edit') && (
        <div className="bg-card border border-border/60 rounded-xl p-5 sm:p-7 mb-8">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">
              {mode === 'create' ? 'নতুন ব্যানার' : `এডিট — ${editTarget?.title}`}
            </p>
            <button onClick={closeForm} className="text-foreground/50 hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mutation error */}
          {mutError && (
            <div className="mb-4 flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {mutError.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Title (Bangla) *">
              <input value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="গোপালভোগ" className={inp} />
            </Field>
            <Field label="Subtitle (optional)">
              <input value={draft.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="পাড়ার আগে শেষবার দেখা" className={inp} />
            </Field>
            <Field label="Category (optional)">
              <select value={draft.category} onChange={(e) => set('category', e.target.value)} className={inp}>
                <option value="">— বেছে নিন —</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Harvest Date (optional)">
              <input
                type="datetime-local"
                value={draft.harvestDate ? draft.harvestDate.slice(0, 16) : ''}
                onChange={(e) => set('harvestDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                className={`${inp} font-mono`}
              />
            </Field>
            <Field label="Active">
              <div className="flex items-center gap-2 mt-1">
                <input id="isActive" type="checkbox" checked={draft.isActive}
                  onChange={(e) => set('isActive', e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer" />
                <label htmlFor="isActive" className="text-sm text-foreground/80 cursor-pointer">হোমপেজে দেখাও</label>
              </div>
            </Field>
          </div>

          {/* Existing images (edit mode) */}
          {mode === 'edit' && editTarget && editTarget.images.length > 0 && (
            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-2">বর্তমান ছবি — মুছতে ক্লিক করুন</p>
              <div className="flex gap-3 flex-wrap">
                {editTarget.images.map((url) => {
                  const marked = removeImages.includes(url)
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => toggleRemoveExisting(url)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${marked ? 'border-destructive opacity-50' : 'border-border'}`}
                    >
                      <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                      {marked && (
                        <div className="absolute inset-0 bg-destructive/40 flex items-center justify-center">
                          <X className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {removeImages.length > 0 && (
                <p className="text-xs text-destructive mt-1.5">{removeImages.length}টি ছবি মুছে ফেলা হবে</p>
              )}
            </div>
          )}

          {/* New image upload */}
          <Field label={mode === 'edit' ? 'নতুন ছবি যোগ করুন (optional)' : 'Images *'}>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
              className="mt-1 border-2 border-dashed border-border hover:border-primary rounded-xl p-5 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 text-foreground/40 mx-auto mb-1.5" />
              <p className="text-sm text-foreground/60">ড্র্যাগ করুন বা <span className="text-primary underline">ব্রাউজ করুন</span></p>
              <p className="font-mono text-[10px] text-foreground/40 mt-0.5">JPG, PNG, WEBP</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </Field>

          {newPreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {newPreviews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={closeForm} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">
              বাতিল
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !draft.title.trim() || (mode === 'create' && draft.images.length === 0)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isPending ? 'সংরক্ষণ হচ্ছে...' : mode === 'create' ? 'আপলোড করুন' : 'আপডেট করুন'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-foreground/50">
          <Loader2 className="w-5 h-5 animate-spin" /> লোড হচ্ছে...
        </div>
      ) : listError ? (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4" /> ব্যানার লোড করতে সমস্যা হয়েছে
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
          <p className="text-sm text-foreground/50">এখনো কোনো ব্যানার নেই</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((b) => (
            <div key={b.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              {/* Images strip */}
              <div className="relative aspect-video bg-muted flex gap-0.5 overflow-hidden">
                {b.images.slice(0, 2).map((url, i) => (
                  <div key={i} className={`relative ${b.images.length > 1 ? 'w-1/2' : 'w-full'} h-full`}>
                    <Image src={url} alt={b.title} fill sizes="200px" className="object-cover" />
                  </div>
                ))}
                {b.images.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">no image</div>
                )}
                {/* Active badge */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${b.isActive ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground/50'}`}>
                  {b.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                  {b.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display text-base font-medium leading-tight">{b.title}</p>
                  <span className="font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded text-foreground/50">{b.category}</span>
                </div>
                <p className="text-xs text-foreground/55 mb-1">{b.subtitle}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[9px] text-foreground/40">{b.images.length} image{b.images.length !== 1 ? 's' : ''}</span>
                  {b.harvestDate && (
                    <span className="font-mono text-[9px] text-foreground/40">
                      Harvest: {new Date(b.harvestDate).toLocaleDateString('en-GB')}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <p className="font-mono text-[10px] text-foreground/40">
                    {new Date(b.createdAt).toLocaleDateString('en-GB')}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(b)}
                      className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-primary px-2 py-1 rounded hover:bg-muted"
                    >
                      <Pencil className="w-3.5 h-3.5" /> এডিট
                    </button>
                    <button
                      onClick={() => { if (confirm('এই ব্যানার মুছে ফেলবেন?')) deleteMut.mutate(b.id) }}
                      disabled={deleteMut.isPending && deleteMut.variables === b.id}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:underline px-2 py-1 rounded hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {deleteMut.isPending && deleteMut.variables === b.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                      মুছুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inp = 'w-full px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="font-mono text-[10px] text-foreground/40 mt-1">e.g. {hint}</p>}
    </div>
  )
}
