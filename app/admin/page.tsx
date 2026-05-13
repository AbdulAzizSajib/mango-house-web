'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ShoppingBag, Images, MessageSquare, ArrowRight } from 'lucide-react'
import { getOrders, type AdminOrder } from '@/lib/api'

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery<AdminOrder[]>({
    queryKey: ['admin', 'orders'],
    queryFn: getOrders,
    retry: false,
  })

  const orders = data ?? []
  const totalOrders = orders.length
  const pending = orders.filter((o) => (o.status ?? 'pending') === 'pending').length
  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary mb-2">Overview</p>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground">ড্যাশবোর্ড</h1>
        <p className="text-sm text-foreground/60 mt-1.5">আজকের সারসংক্ষেপ এক নজরে</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10">
        <StatCard
          label="মোট অর্ডার"
          en="Total Orders"
          value={isLoading ? '—' : toBn(totalOrders)}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          label="পেন্ডিং"
          en="Pending"
          value={isLoading ? '—' : toBn(pending)}
          loading={isLoading}
          error={isError}
        />
        <StatCard
          label="মোট আয়"
          en="Revenue"
          value={isLoading ? '—' : `৳ ${toBn(revenue.toLocaleString())}`}
          loading={isLoading}
          error={isError}
        />
      </div>

      {/* Shortcuts */}
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground/55 mb-3">Quick Access</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Shortcut href="/admin/orders" icon={ShoppingBag} label="অর্ডার ম্যানেজ" en="Manage Orders" />
        <Shortcut href="/admin/photos" icon={Images} label="ছবি আপলোড" en="Upload Photos" />
        <Shortcut href="/admin/reviews" icon={MessageSquare} label="রিভিউ" en="Reviews" />
      </div>

      {isError && (
        <p className="mt-8 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
          অর্ডার লোড করতে সমস্যা হয়েছে। ব্যাকএন্ড <code className="font-mono text-xs">/admin/orders</code> এন্ডপয়েন্ট আছে কিনা চেক করুন।
        </p>
      )}
    </div>
  )
}

function StatCard({ label, en, value, loading, error }: { label: string; en: string; value: string; loading?: boolean; error?: boolean }) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-5">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50">{en}</p>
      <p className="text-sm text-foreground/70 mt-1">{label}</p>
      <p className={`font-display text-3xl font-medium mt-3 ${error ? 'text-destructive' : 'text-foreground'} ${loading ? 'opacity-40' : ''}`}>
        {error ? '!' : value}
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
