'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ShoppingBag, Images, MessageSquare, ArrowRight, Loader2 } from 'lucide-react'
import { authFetch } from '@/lib/api'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

interface RecentOrder {
  id: string
  fullName: string
  district: string
  total: number
  status: string
  paymentMethod: string | null
  createdAt: string
}

interface DashboardStats {
  orders: {
    total: number
    byStatus: {
      pending: number
      confirmed: number
      processing: number
      packed: number
      shipped: number
      outForDelivery: number
      delivered: number
      cancelled: number
      returned: number
      refunded: number
    }
  }
  revenue: {
    realized: number
    pending: number
  }
  products: { total: number }
  testimonials: { total: number; pending: number; featured: number }
  heroBanners: { total: number; active: number }
  recentOrders: RecentOrder[]
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const json = await authFetch<{ success: boolean; data: DashboardStats }>('/dashboard/stats')
      return json.data
    },
    retry: false,
  })

  const v = (n?: number) => isLoading ? '—' : isError ? '!' : toBn(n ?? 0)
  const s = data?.orders.byStatus

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Overview</p>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">ড্যাশবোর্ড</h1>
        <p className="text-sm text-foreground/60 mt-1.5">আজকের সারসংক্ষেপ এক নজরে</p>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard label="মোট অর্ডার"   en="Total Orders" value={v(data?.orders.total)}      loading={isLoading} error={isError} highlight />
        <StatCard label="পেন্ডিং"       en="Pending"      value={v(s?.pending)}               loading={isLoading} error={isError} />
        <StatCard label="মোট আয়"       en="Realized"     value={isLoading ? '—' : isError ? '!' : `৳ ${toBn((data?.revenue.realized ?? 0).toLocaleString())}`} loading={isLoading} error={isError} />
        <StatCard label="পেন্ডিং আয়"   en="Pending Rev." value={isLoading ? '—' : isError ? '!' : `৳ ${toBn((data?.revenue.pending ?? 0).toLocaleString())}`}  loading={isLoading} error={isError} />
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="পণ্য"          en="Products"     value={v(data?.products.total)}            loading={isLoading} error={isError} />
        <StatCard label="রিভিউ পেন্ডিং" en="Reviews"      value={v(data?.testimonials.pending)}      loading={isLoading} error={isError} />
        <StatCard label="হিরো ব্যানার"  en="Banners"      value={v(data?.heroBanners.active)}        loading={isLoading} error={isError} />
        <StatCard label="ফিচার্ড রিভিউ" en="Featured"     value={v(data?.testimonials.featured)}    loading={isLoading} error={isError} />
      </div>

      {/* Order pipeline */}
      <div className="bg-card border border-border/60 rounded-xl p-5 mb-8">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mb-4">Order Pipeline</p>
        {isLoading ? (
          <div className="flex items-center gap-2 text-foreground/40 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> লোড হচ্ছে...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'কনফার্মড',    en: 'Confirmed',       n: s?.confirmed },
              { label: 'প্রসেসিং',    en: 'Processing',      n: s?.processing },
              { label: 'প্যাকড',      en: 'Packed',          n: s?.packed },
              { label: 'শিপড',        en: 'Shipped',         n: s?.shipped },
              { label: 'ডেলিভারিতে', en: 'Out for Delivery', n: s?.outForDelivery },
            ].map((item) => (
              <div key={item.en} className="text-center py-3 px-2 rounded-lg bg-muted/40">
                <p className="font-display text-2xl font-medium text-foreground">{toBn(item.n ?? 0)}</p>
                <p className="text-xs text-foreground/70 mt-0.5">{item.label}</p>
                <p className="font-mono text-[9px] text-foreground/40 tracking-wider uppercase">{item.en}</p>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border/40">
            {[
              { label: 'ডেলিভারড',  en: 'Delivered', n: s?.delivered,  color: 'text-green-600' },
              { label: 'ক্যানসেল',  en: 'Cancelled', n: s?.cancelled,  color: 'text-red-500' },
              { label: 'রিটার্নড',  en: 'Returned',  n: s?.returned,   color: 'text-orange-500' },
              { label: 'রিফান্ডেড', en: 'Refunded',  n: s?.refunded,   color: 'text-rose-500' },
            ].map((item) => (
              <div key={item.en} className="flex items-center gap-1.5">
                <span className={`font-display text-base font-medium ${item.color}`}>{toBn(item.n ?? 0)}</span>
                <span className="text-xs text-foreground/60">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      {!isLoading && !isError && (data?.recentOrders?.length ?? 0) > 0 && (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">Recent Orders</p>
            <Link href="/admin/orders" className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary hover:underline">
              সব দেখুন
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {data!.recentOrders.map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{o.fullName}</p>
                  <p className="font-mono text-[10px] text-foreground/50">#{o.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-foreground/70">৳ {toBn(o.total.toLocaleString())}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-foreground/60">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shortcuts */}
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground/55 mb-3">Quick Access</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Shortcut href="/admin/orders"  icon={ShoppingBag}   label="অর্ডার ম্যানেজ" en="Manage Orders" />
        <Shortcut href="/admin/photos"  icon={Images}        label="ছবি আপলোড"      en="Upload Photos" />
        <Shortcut href="/admin/reviews" icon={MessageSquare} label="রিভিউ"           en="Reviews" />
      </div>

      {isError && (
        <p className="mt-8 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
          ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে।
        </p>
      )}
    </div>
  )
}

function StatCard({ label, en, value, loading, error, highlight }: {
  label: string; en: string; value: string; loading?: boolean; error?: boolean; highlight?: boolean
}) {
  return (
    <div className={`border rounded-xl p-5 ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/60'}`}>
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">{en}</p>
      <p className="text-sm text-foreground/70 mt-1">{label}</p>
      <p className={`font-display text-3xl font-medium mt-3 ${error ? 'text-destructive' : highlight ? 'text-primary' : 'text-foreground'} ${loading ? 'opacity-40' : ''}`}>
        {value}
      </p>
    </div>
  )
}

function Shortcut({ href, icon: Icon, label, en }: { href: string; icon: typeof ShoppingBag; label: string; en: string }) {
  return (
    <Link
      href={href}
      className="group bg-card border border-border/60 rounded-xl p-5 hover:border-primary/40 hover:card-elevated transition-all flex items-center gap-4"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/50 mt-0.5">{en}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}
