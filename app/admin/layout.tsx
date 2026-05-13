'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Images, MessageSquare, LogOut, Menu, X, Leaf } from 'lucide-react'
import { getToken, clearToken } from '@/lib/api'

const NAV = [
  { href: '/admin', label: 'ড্যাশবোর্ড', en: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'অর্ডার', en: 'Orders', icon: ShoppingBag },
  { href: '/admin/photos', label: 'প্রতিদিনের ছবি', en: 'Daily Photos', icon: Images },
  { href: '/admin/reviews', label: 'রিভিউ', en: 'Reviews', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setReady(true)
      return
    }
    if (!getToken()) {
      router.replace('/admin/login')
      return
    }
    setReady(true)
  }, [isLoginPage, router])

  const handleLogout = () => {
    clearToken()
    router.replace('/admin/login')
  }

  if (isLoginPage) return <>{children}</>

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-foreground/50">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border/60 z-40 transform transition-transform lg:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/60">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-medium text-foreground">রাজশাহী ম্যাঙ্গো</p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/50 mt-0.5">Admin</p>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {NAV.map(({ href, label, en, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground/75 hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="leading-tight">
                  <p>{label}</p>
                  <p className={`font-mono text-[9px] tracking-[0.16em] uppercase mt-0.5 ${active ? 'text-primary-foreground/70' : 'text-foreground/40'}`}>{en}</p>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/75 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {mobileOpen && (
        <button
          aria-label="মেনু বন্ধ করুন"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-foreground/40 z-30 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 bg-card border-b border-border/60 px-4 py-3 flex items-center justify-between">
          <button
            aria-label="মেনু"
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-display text-base font-medium">অ্যাডমিন</p>
          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-muted"
            aria-label="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Close button on open sidebar (mobile) */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed top-4 right-4 z-50 lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-border"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
