'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Phone, MapPin, Package, X, Trash2 } from 'lucide-react'
import { getOrders, updateOrderStatus, deleteOrder, type AdminOrder, type OrderStatus } from '@/lib/api'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending',          label: 'পেন্ডিং',       color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'confirmed',        label: 'কনফার্মড',       color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'processing',       label: 'প্রসেসিং',       color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { value: 'packed',           label: 'প্যাকড',         color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { value: 'shipped',          label: 'শিপড',           color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'out_for_delivery', label: 'ডেলিভারিতে',    color: 'bg-violet-100 text-violet-800 border-violet-200' },
  { value: 'delivered',        label: 'ডেলিভারড',       color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'cancelled',        label: 'ক্যানসেল',       color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'returned',         label: 'রিটার্নড',       color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'refunded',         label: 'রিফান্ডেড',      color: 'bg-rose-100 text-rose-800 border-rose-200' },
]

function statusMeta(s?: OrderStatus) {
  return STATUS_OPTIONS.find((o) => o.value === s) ?? STATUS_OPTIONS[0]
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AdminOrdersPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<AdminOrder | null>(null)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const { data, isLoading, isError, error } = useQuery<AdminOrder[]>({
    queryKey: ['admin', 'orders'],
    queryFn: getOrders,
    retry: false,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: (_, { id, status }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      setSelected(null)
    },
  })

  const orders = data ?? []
  const filtered = filter === 'all' ? orders : orders.filter((o) => (o.status ?? 'pending') === filter)

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Orders</p>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">অর্ডার তালিকা</h1>
        <p className="text-sm text-foreground/60 mt-1.5">সব অর্ডার দেখুন ও স্ট্যাটাস আপডেট করুন</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')} label="সব" count={orders.length} />
        {STATUS_OPTIONS.map((s) => (
          <FilterPill
            key={s.value}
            active={filter === s.value}
            onClick={() => setFilter(s.value)}
            label={s.label}
            count={orders.filter((o) => (o.status ?? 'pending') === s.value).length}
          />
        ))}
      </div>

      {isLoading && (
        <div className="bg-card border border-border/60 rounded-xl p-12 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 text-sm text-destructive">
          <p className="font-medium mb-1">অর্ডার লোড করতে সমস্যা হয়েছে</p>
          <p className="text-destructive/80 text-xs">{error instanceof Error ? error.message : 'অজানা ত্রুটি'}</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
          <Package className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-foreground/60">কোনো অর্ডার নেই</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border/60">
                <tr className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55">
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const meta = statusMeta(o.status)
                  return (
                    <tr key={o.id} className="border-b border-border/40 last:border-b-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs text-foreground/70">#{o.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{o.fullName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground/70">{o.phone}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground/70">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 text-right font-medium">৳ {toBn((o.total ?? 0).toLocaleString())}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(o)}
                          className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(status) => updateMutation.mutate({ id: selected.id, status })}
          updating={updateMutation.isPending}
          onDelete={() => {
            if (confirm(`অর্ডার #${selected.id.slice(0, 8)} ডিলিট করবেন?`)) {
              deleteMutation.mutate(selected.id)
            }
          }}
          deleting={deleteMutation.isPending}
        />
      )}
    </div>
  )
}

function FilterPill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
        active ? 'bg-foreground text-background' : 'bg-card border border-border text-foreground/75 hover:border-foreground/30'
      }`}
    >
      {label}
      <span className={`font-mono text-[10px] ${active ? 'text-background/70' : 'text-foreground/50'}`}>{toBn(count)}</span>
    </button>
  )
}

function OrderModal({
  order,
  onClose,
  onStatusChange,
  updating,
  onDelete,
  deleting,
}: {
  order: AdminOrder
  onClose: () => void
  onStatusChange: (s: OrderStatus) => void
  updating: boolean
  onDelete: () => void
  deleting: boolean
}) {
  const currentStatus = (order.status ?? 'pending') as OrderStatus

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-label="বন্ধ" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border/60 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
          <div className="leading-tight">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Order</p>
            <p className="font-mono text-sm text-foreground">#{order.id.slice(0, 12)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              disabled={deleting}
              className="w-9 h-9 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center disabled:opacity-50 transition-colors"
              aria-label="ডিলিট"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors" aria-label="বন্ধ">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Customer */}
          <section>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mb-2">Customer</p>
            <p className="font-display text-lg font-medium text-foreground">{order.fullName}</p>
            <div className="mt-2 space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-foreground/75">
                <Phone className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
                <a href={`tel:${order.phone}`} className="font-mono text-xs hover:text-primary">{order.phone}</a>
              </p>
              <p className="flex items-start gap-2 text-foreground/75">
                <MapPin className="w-3.5 h-3.5 text-foreground/40 mt-0.5 shrink-0" />
                <span>{order.address}, {order.policeStation}, {order.district}</span>
              </p>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mb-2">Delivery</p>
            <div className="bg-muted/40 rounded-lg p-3 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-foreground/60">Type</span>
                <span className="font-medium">{order.deliveryType === 'home' ? 'হোম ডেলিভারি' : 'কুরিয়ার'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Date</span>
                <span className="font-mono text-xs">{order.deliveryDate ?? '—'}</span>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-border/60">
                  <p className="text-foreground/60 text-xs mb-1">Notes</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </section>

          {/* Items */}
          <section>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mb-2">Items</p>
            <div className="space-y-2">
              {order.items?.map((it) => (
                <div key={it.id ?? it.variety} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-b-0">
                  <div>
                    <p className="font-medium">{it.variety}</p>
                    <p className="font-mono text-[11px] text-foreground/55">{toBn(it.quantity)} কেজি × ৳ {toBn(it.price)}</p>
                  </div>
                  <p className="font-medium">৳ {toBn((it.quantity * it.price).toLocaleString())}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-border/60">
              <span className="font-medium">মোট</span>
              <span className="font-display text-lg font-medium">৳ {toBn((order.total ?? 0).toLocaleString())}</span>
            </div>
          </section>

          {/* Status */}
          <section>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mb-2">Status</p>
            <div className="flex items-center gap-3">
              <select
                value={currentStatus}
                disabled={updating}
                onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {updating && <Loader2 className="w-4 h-4 animate-spin text-foreground/40 shrink-0" />}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
