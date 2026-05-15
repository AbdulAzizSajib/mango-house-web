'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Phone, MapPin, Package, X } from 'lucide-react'
import { getOrders, updateOrderStatus, type AdminOrder, type OrderStatus } from '@/lib/api'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

const STATUS_OPTIONS: { value: OrderStatus; label: string; en: string; color: string }[] = [
  { value: 'pending',          label: 'পেন্ডিং',        en: 'Pending',          color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'confirmed',        label: 'কনফার্মড',        en: 'Confirmed',        color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'processing',       label: 'প্রসেসিং',        en: 'Processing',       color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { value: 'packed',           label: 'প্যাকড',          en: 'Packed',           color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { value: 'shipped',          label: 'শিপড',            en: 'Shipped',          color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'out_for_delivery', label: 'ডেলিভারিতে',     en: 'Out for Delivery', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  { value: 'delivered',        label: 'ডেলিভারড',        en: 'Delivered',        color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'cancelled',        label: 'ক্যানসেল',        en: 'Cancelled',        color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'returned',         label: 'রিটার্নড',        en: 'Returned',         color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'refunded',         label: 'রিফান্ডেড',       en: 'Refunded',         color: 'bg-rose-100 text-rose-800 border-rose-200' },
]

function statusMeta(s?: OrderStatus) {
  return STATUS_OPTIONS.find((o) => o.value === s) ?? STATUS_OPTIONS[0]
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'orders'] }),
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
          <p className="font-mono text-[10px] mt-2 text-destructive/70">
            Check that <code>GET {process.env.NEXT_PUBLIC_API_URL}/admin/orders</code> exists.
          </p>
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

      {/* Order detail drawer */}
      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(status) => updateMutation.mutate({ id: selected.id, status })}
          updating={updateMutation.isPending}
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
        active
          ? 'bg-foreground text-background'
          : 'bg-card border border-border text-foreground/75 hover:border-foreground/30'
      }`}
    >
      {label}
      <span className={`font-mono text-[10px] ${active ? 'text-background/70' : 'text-foreground/50'}`}>
        {toBn(count)}
      </span>
    </button>
  )
}

function OrderDetail({
  order,
  onClose,
  onStatusChange,
  updating,
}: {
  order: AdminOrder
  onClose: () => void
  onStatusChange: (s: OrderStatus) => void
  updating: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <button aria-label="বন্ধ" onClick={onClose} className="flex-1 bg-foreground/40" />
      <aside className="w-full max-w-md bg-card h-full overflow-y-auto border-l border-border/60">
        <div className="sticky top-0 bg-card border-b border-border/60 px-5 py-4 flex items-center justify-between">
          <div className="leading-tight">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Order</p>
            <p className="font-mono text-sm text-foreground">#{order.id.slice(0, 12)}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center" aria-label="বন্ধ">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Customer */}
          <section>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mb-2">Customer</p>
            <p className="font-display text-lg font-medium text-foreground">{order.fullName}</p>
            <div className="mt-2 space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-foreground/75">
                <Phone className="w-3.5 h-3.5 text-foreground/40" />
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
                <span className="font-mono text-xs">{order.deliveryDate}</span>
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
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const active = (order.status ?? 'pending') === s.value
                return (
                  <button
                    key={s.value}
                    disabled={updating || active}
                    onClick={() => onStatusChange(s.value)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      active
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-card border-border hover:border-foreground/30 disabled:opacity-60'
                    }`}
                  >
                    <p className="font-medium">{s.label}</p>
                    <p className={`font-mono text-[9px] tracking-[0.14em] uppercase mt-0.5 ${active ? 'text-background/70' : 'text-foreground/50'}`}>{s.en}</p>
                  </button>
                )
              })}
            </div>
            {updating && (
              <p className="mt-3 text-xs text-foreground/60 inline-flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> আপডেট হচ্ছে…
              </p>
            )}
          </section>
        </div>
      </aside>
    </div>
  )
}
