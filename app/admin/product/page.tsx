'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Upload, Loader2, AlertCircle, Pencil, X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authFetch } from '@/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  description: string
  category: string
  location: string
  regularprice: number
  offerPrice: number | null
  images: string[]
  createdAt: string
  updatedAt: string
}

interface ProductsResponse { success: boolean; message: string; data: Product[] }
interface ProductResponse  { success: boolean; message: string; data: Product }

interface ProductDraft {
  name: string
  description: string
  category: string
  location: string
  regularprice: string
  offerPrice: string
  images: File[]
  removeImages: string[]
}

const EMPTY: ProductDraft = {
  name: '', description: '', category: 'Himsagar',
  location: 'Rajshahi', regularprice: '', offerPrice: '',
  images: [], removeImages: [],
}

const CATEGORIES = ['Gopalbhog','Himsagar','Ranipochondo','Langra','Amrapali','Fazli','Other']

// ─── API ──────────────────────────────────────────────────────────────────────

async function getProducts(): Promise<Product[]> {
  const json = await authFetch<ProductsResponse | Product[]>('/products')
  return Array.isArray(json) ? json : (json as ProductsResponse).data
}

function buildFormData(draft: ProductDraft, includeRemove = false): FormData {
  const fd = new FormData()
  fd.append('name', draft.name)
  fd.append('description', draft.description)
  fd.append('category', draft.category)
  fd.append('location', draft.location)
  fd.append('regularprice', draft.regularprice)
  fd.append('offerPrice', draft.offerPrice)
  draft.images.forEach((f) => fd.append('images', f))
  if (includeRemove) draft.removeImages.forEach((u) => fd.append('removeImages', u))
  return fd
}

async function createProduct(draft: ProductDraft): Promise<Product> {
  const json = await authFetch<ProductResponse>('/products', {
    method: 'POST', body: buildFormData(draft),
  })
  return json.data
}

async function updateProduct(id: string, draft: ProductDraft): Promise<Product> {
  const json = await authFetch<ProductResponse>(`/products/${id}`, {
    method: 'PATCH', body: buildFormData(draft, true),
  })
  return json.data
}

async function deleteProduct(id: string): Promise<void> {
  await authFetch(`/products/${id}`, { method: 'DELETE' })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProductPage() {
  const qc = useQueryClient()
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>('idle')
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [draft, setDraft] = useState<ProductDraft>(EMPTY)
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: products = [], isLoading, isError: listError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); closeForm() },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: ProductDraft }) => updateProduct(id, draft),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); closeForm() },
  })

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })

  const closeForm = () => {
    setMode('idle'); setEditTarget(null)
    setDraft(EMPTY); setNewPreviews([])
    createMut.reset(); updateMut.reset()
  }

  const openEdit = (p: Product) => {
    setEditTarget(p)
    setDraft({
      name: p.name, description: p.description,
      category: p.category, location: p.location,
      regularprice: String(p.regularprice),
      offerPrice: p.offerPrice ? String(p.offerPrice) : '',
      images: [], removeImages: [],
    })
    setNewPreviews([])
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
    setDraft((d) => ({
      ...d,
      removeImages: d.removeImages.includes(url)
        ? d.removeImages.filter((u) => u !== url)
        : [...d.removeImages, url],
    }))

  const set = (k: keyof ProductDraft, v: string) =>
    setDraft((d) => ({ ...d, [k]: v }))

  const handleSubmit = () => {
    if (!draft.name.trim() || !draft.regularprice) return
    if (mode === 'create' && draft.images.length === 0) return
    if (mode === 'create') createMut.mutate(draft)
    else if (editTarget) updateMut.mutate({ id: editTarget.id, draft })
  }

  const isPending = createMut.isPending || updateMut.isPending
  const mutError = (createMut.error || updateMut.error) as Error | null

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Products</p>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">প্রোডাক্ট</h1>
          <p className="text-sm text-foreground/60 mt-1.5">আমের varieties ম্যানেজ করুন</p>
        </div>
        {mode === 'idle' && (
          <button
            onClick={() => setMode('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> নতুন প্রোডাক্ট
          </button>
        )}
      </div>

      {/* Form */}
      {(mode === 'create' || mode === 'edit') && (
        <div className="bg-card border border-border/60 rounded-xl p-5 sm:p-7 mb-8">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">
              {mode === 'create' ? 'নতুন প্রোডাক্ট' : `এডিট — ${editTarget?.name}`}
            </p>
            <button onClick={closeForm} className="text-foreground/50 hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {mutError && (
            <div className="mb-4 flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {mutError.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Name *">
              <input value={draft.name} onChange={(e) => set('name', e.target.value)}
                placeholder="Himsagar Premium" className={inp} />
            </Field>
            <Field label="Category">
              <select value={draft.category} onChange={(e) => set('category', e.target.value)} className={inp}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Location">
              <input value={draft.location} onChange={(e) => set('location', e.target.value)}
                placeholder="Rajshahi" className={inp} />
            </Field>
            <Field label="Regular Price (৳) *">
              <input type="number" min={0} value={draft.regularprice}
                onChange={(e) => set('regularprice', e.target.value)}
                placeholder="500" className={`${inp} font-mono`} />
            </Field>
            <Field label="Offer Price (৳)" hint="ছাড়ের দাম না থাকলে খালি রাখুন">
              <input type="number" min={0} value={draft.offerPrice}
                onChange={(e) => set('offerPrice', e.target.value)}
                placeholder="450" className={`${inp} font-mono`} />
            </Field>
            <Field label="Description" full>
              <textarea value={draft.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Sweet and aromatic mangoes from Rajshahi."
                rows={3} className={`${inp} resize-none`} />
            </Field>
          </div>

          {/* Existing images (edit mode) */}
          {mode === 'edit' && editTarget && editTarget.images.length > 0 && (
            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-2">
                বর্তমান ছবি — মুছতে ক্লিক করুন
              </p>
              <div className="flex gap-3 flex-wrap">
                {editTarget.images.map((url) => {
                  const marked = draft.removeImages.includes(url)
                  return (
                    <button key={url} type="button" onClick={() => toggleRemoveExisting(url)}
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
              {draft.removeImages.length > 0 && (
                <p className="text-xs text-destructive mt-1.5">{draft.removeImages.length}টি ছবি মুছে ফেলা হবে</p>
              )}
            </div>
          )}

          {/* New image upload */}
          <Field label={mode === 'edit' ? 'নতুন ছবি যোগ করুন (optional, max 10)' : 'Images * (max 10)'}>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
              className="mt-1 border-2 border-dashed border-border hover:border-primary rounded-xl p-5 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 text-foreground/40 mx-auto mb-1.5" />
              <p className="text-sm text-foreground/60">ড্র্যাগ করুন বা <span className="text-primary underline">ব্রাউজ করুন</span></p>
              <p className="font-mono text-[10px] text-foreground/40 mt-0.5">JPG, PNG, WEBP · একাধিক ছবি সিলেক্ট করা যাবে</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />
          </Field>

          {newPreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {newPreviews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={closeForm} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">
              বাতিল
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending || !draft.name.trim() || !draft.regularprice || (mode === 'create' && draft.images.length === 0)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isPending ? 'সংরক্ষণ হচ্ছে...' : mode === 'create' ? 'তৈরি করুন' : 'আপডেট করুন'}
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
          <AlertCircle className="w-4 h-4" /> প্রোডাক্ট লোড করতে সমস্যা হয়েছে
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
          <p className="text-sm text-foreground/50">এখনো কোনো প্রোডাক্ট নেই</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-card border border-border/60 rounded-xl overflow-hidden">
              {/* Images strip */}
              <div className="relative aspect-video bg-muted flex gap-0.5 overflow-hidden">
                {p.images.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">no image</div>
                ) : p.images.length === 1 ? (
                  <div className="relative w-full h-full">
                    <Image src={p.images[0]} alt={p.name} fill sizes="300px" className="object-cover" />
                  </div>
                ) : (
                  <>
                    <div className="relative w-2/3 h-full">
                      <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="object-cover" />
                    </div>
                    <div className="flex flex-col gap-0.5 w-1/3 h-full">
                      {p.images.slice(1, 3).map((url, i) => (
                        <div key={i} className="relative flex-1">
                          <Image src={url} alt="" fill sizes="100px" className="object-cover" />
                        </div>
                      ))}
                      {p.images.length > 3 && (
                        <div className="absolute bottom-1 right-1 bg-foreground/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                          +{p.images.length - 3}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {p.offerPrice && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
                    অফার
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display text-base font-medium leading-tight">{p.name}</p>
                  <span className="font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded text-foreground/50 shrink-0">{p.category}</span>
                </div>
                <p className="text-xs text-foreground/50 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 mb-1">
                  {p.offerPrice ? (
                    <>
                      <span className="font-mono text-base font-medium text-primary">৳{p.offerPrice}</span>
                      <span className="font-mono text-xs text-foreground/40 line-through">৳{p.regularprice}</span>
                    </>
                  ) : (
                    <span className="font-mono text-base font-medium text-foreground">৳{p.regularprice}</span>
                  )}
                  <span className="text-[10px] text-foreground/40 ml-auto">{p.location}</span>
                </div>
                <p className="font-mono text-[9px] text-foreground/35 mb-3">{p.images.length} image{p.images.length !== 1 ? 's' : ''}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <p className="font-mono text-[10px] text-foreground/40">
                    {new Date(p.createdAt).toLocaleDateString('en-GB')}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(p)}
                      className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-primary px-2 py-1 rounded hover:bg-muted">
                      <Pencil className="w-3.5 h-3.5" /> এডিট
                    </button>
                    <button
                      onClick={() => { if (confirm('এই প্রোডাক্ট মুছে ফেলবেন?')) deleteMut.mutate(p.id) }}
                      disabled={deleteMut.isPending && deleteMut.variables === p.id}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:underline px-2 py-1 rounded hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {deleteMut.isPending && deleteMut.variables === p.id
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

const inp = 'w-full px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

function Field({ label, hint, full, children }: {
  label: string; hint?: string; full?: boolean; children: React.ReactNode
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="font-mono text-[10px] text-foreground/40 mt-1">{hint}</p>}
    </div>
  )
}
