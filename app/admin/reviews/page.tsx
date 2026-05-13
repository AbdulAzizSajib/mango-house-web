'use client'

import { useState } from 'react'
import {
  Plus, Trash2, Star, Loader2, AlertCircle,
  CheckCircle2, X, Pencil, BadgeCheck, Sparkles,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllTestimonials, createTestimonial, approveTestimonial,
  featureTestimonial, updateTestimonial, deleteTestimonial,
  type Testimonial,
} from '@/lib/api'

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = ['all', 'pending', 'approved', 'featured'] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, { bn: string; en: string }> = {
  all:      { bn: 'সব',       en: 'All' },
  pending:  { bn: 'পেন্ডিং', en: 'Pending' },
  approved: { bn: 'অ্যাপ্রুভড', en: 'Approved' },
  featured: { bn: 'ফিচারড',  en: 'Featured' },
}

const EMPTY_DRAFT = { name: '', comment: '', location: '' }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('all')
  const [mode, setMode] = useState<'idle' | 'create' | 'edit'>('idle')
  const [editTarget, setEditTarget] = useState<Testimonial | null>(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [editComment, setEditComment] = useState('')

  // ── GET ──
  const { data: reviews = [], isLoading, isError: listError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getAllTestimonials,
  })

  // ── CREATE ──
  const createMut = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); closeForm() },
  })

  // ── APPROVE ──
  const approveMut = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      approveTestimonial(id, isApproved),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  })

  // ── FEATURE ──
  const featureMut = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      featureTestimonial(id, isFeatured),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  })

  // ── UPDATE ──
  const updateMut = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      updateTestimonial(id, comment),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); closeForm() },
  })

  // ── DELETE ──
  const deleteMut = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  })

  // ── helpers ──
  const closeForm = () => {
    setMode('idle'); setEditTarget(null)
    setDraft(EMPTY_DRAFT); setEditComment('')
    createMut.reset(); updateMut.reset()
  }

  const openEdit = (r: Testimonial) => {
    setEditTarget(r); setEditComment(r.comment)
    createMut.reset(); updateMut.reset()
    setMode('edit')
  }

  const handleCreate = () => {
    if (!draft.name.trim() || !draft.comment.trim()) return
    createMut.mutate(draft)
  }

  const handleUpdate = () => {
    if (!editTarget || !editComment.trim()) return
    updateMut.mutate({ id: editTarget._id, comment: editComment })
  }

  const filtered = reviews.filter((r) => {
    if (tab === 'pending')  return !r.isApproved
    if (tab === 'approved') return r.isApproved
    if (tab === 'featured') return r.isFeatured
    return true
  })

  const counts: Record<Tab, number> = {
    all:      reviews.length,
    pending:  reviews.filter((r) => !r.isApproved).length,
    approved: reviews.filter((r) => r.isApproved).length,
    featured: reviews.filter((r) => r.isFeatured).length,
  }

  const isPending = createMut.isPending || updateMut.isPending
  const mutError = (createMut.error || updateMut.error) as Error | null

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Reviews</p>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">কাস্টমার রিভিউ</h1>
          <p className="text-sm text-foreground/60 mt-1.5">রিভিউ অ্যাপ্রুভ, ফিচার ও ম্যানেজ করুন</p>
        </div>
        {mode === 'idle' && (
          <button
            onClick={() => setMode('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> নতুন রিভিউ
          </button>
        )}
      </div>

      {/* Form — create */}
      {mode === 'create' && (
        <div className="bg-card border border-border/60 rounded-xl p-5 sm:p-7 mb-8">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">নতুন রিভিউ</p>
            <button onClick={closeForm} className="text-foreground/50 hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>

          {mutError && (
            <div className="mb-4 flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {mutError.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Karim Hossain"
                className={inp}
              />
            </Field>
            <Field label="Location">
              <input
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                placeholder="Dhaka"
                className={inp}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Review *">
                <textarea
                  rows={3}
                  value={draft.comment}
                  onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
                  placeholder="Best mangoes I've ever had!"
                  className={`${inp} resize-none`}
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button onClick={closeForm} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">বাতিল</button>
            <button
              onClick={handleCreate}
              disabled={isPending || !draft.name.trim() || !draft.comment.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isPending ? 'সংরক্ষণ হচ্ছে...' : 'যোগ করুন'}
            </button>
          </div>
        </div>
      )}

      {/* Form — edit comment */}
      {mode === 'edit' && editTarget && (
        <div className="bg-card border border-border/60 rounded-xl p-5 sm:p-7 mb-8">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">কমেন্ট এডিট — {editTarget.name}</p>
            <button onClick={closeForm} className="text-foreground/50 hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>

          {mutError && (
            <div className="mb-4 flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {mutError.message}
            </div>
          )}

          <Field label="Comment *">
            <textarea
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className={`${inp} resize-none`}
            />
          </Field>

          <div className="flex justify-end gap-2 mt-5">
            <button onClick={closeForm} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">বাতিল</button>
            <button
              onClick={handleUpdate}
              disabled={isPending || !editComment.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
              {isPending ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-border/60 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 -mb-px border-b-2 transition-colors whitespace-nowrap ${
              tab === t ? 'border-primary text-foreground' : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            <p className="text-sm font-medium">
              {TAB_LABELS[t].bn} <span className="font-mono text-[10px] text-foreground/45">({counts[t]})</span>
            </p>
            <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-foreground/45 mt-0.5">{TAB_LABELS[t].en}</p>
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-foreground/50">
          <Loader2 className="w-5 h-5 animate-spin" /> লোড হচ্ছে...
        </div>
      ) : listError ? (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4" /> রিভিউ লোড করতে সমস্যা হয়েছে
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
          <p className="text-sm text-foreground/50">এই ট্যাবে কোনো রিভিউ নেই</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onApprove={(v) => approveMut.mutate({ id: r.id, isApproved: v })}
              onFeature={(v) => featureMut.mutate({ id: r.id, isFeatured: v })}
              onEdit={() => openEdit(r)}
              onDelete={() => { if (confirm('এই রিভিউ মুছে ফেলবেন?')) deleteMut.mutate(r.id) }}
              approving={approveMut.isPending && approveMut.variables?.id === r.id}
              featuring={featureMut.isPending && featureMut.variables?.id === r.id}
              deleting={deleteMut.isPending && deleteMut.variables === r.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({
  review, onApprove, onFeature, onEdit, onDelete,
  approving, featuring, deleting,
}: {
  review: Testimonial
  onApprove: (v: boolean) => void
  onFeature: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
  approving: boolean
  featuring: boolean
  deleting: boolean
}) {
  return (
    <div className={`bg-card border rounded-xl p-5 transition-colors ${review.isApproved ? 'border-border/60' : 'border-amber-200'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Status badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {!review.isApproved && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                পেন্ডিং
              </span>
            )}
            {review.isApproved && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                <BadgeCheck className="w-3 h-3" /> Approved
              </span>
            )}
            {review.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2 text-primary">
            {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
          </div>

          <p className="text-sm text-foreground/85 leading-relaxed mb-3">"{review.comment}"</p>
          <p className="text-xs text-foreground/65">
            <span className="font-medium text-foreground">{review.name}</span>
            {review.location && <span className="text-foreground/40"> · {review.location}</span>}
            <span className="text-foreground/30 ml-2">{new Date(review.createdAt).toLocaleDateString('en-GB')}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40 flex-wrap">
        {/* Approve toggle */}
        <ActionBtn
          onClick={() => onApprove(!review.isApproved)}
          loading={approving}
          active={review.isApproved}
          activeClass="bg-green-100 text-green-800 hover:bg-green-200"
          inactiveClass="bg-amber-100 text-amber-800 hover:bg-amber-200"
          icon={<BadgeCheck className="w-3.5 h-3.5" />}
          label={review.isApproved ? 'Approved' : 'Approve'}
        />

        {/* Feature toggle (only when approved) */}
        {review.isApproved && (
          <ActionBtn
            onClick={() => onFeature(!review.isFeatured)}
            loading={featuring}
            active={review.isFeatured}
            activeClass="bg-primary/10 text-primary hover:bg-primary/20"
            inactiveClass="bg-muted text-foreground/60 hover:bg-muted/80"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            label={review.isFeatured ? 'Featured' : 'Feature'}
          />
        )}

        {/* Edit */}
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-primary px-2.5 py-1.5 rounded-lg hover:bg-muted"
        >
          <Pencil className="w-3.5 h-3.5" /> এডিট
        </button>

        <div className="flex-1" />

        {/* Delete */}
        <button
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 text-xs text-destructive hover:underline px-2.5 py-1.5 rounded-lg hover:bg-destructive/10 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          মুছুন
        </button>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ActionBtn({ onClick, loading, active, activeClass, inactiveClass, icon, label }: {
  onClick: () => void
  loading: boolean
  active: boolean
  activeClass: string
  inactiveClass: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${active ? activeClass : inactiveClass}`}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {label}
    </button>
  )
}

const inp = 'w-full px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}
