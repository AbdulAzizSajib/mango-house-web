'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Loader2 } from 'lucide-react'
import { loginAdmin, setToken, getToken } from '@/lib/api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (getToken()) router.replace('/admin')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginAdmin(email.trim(), password)
      setToken(res.data.token)
      router.replace('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl font-medium text-foreground">রাজশাহী ম্যাঙ্গো</p>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50 mt-0.5">Admin Login</p>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-7 card-elevated">
          <h1 className="font-display text-2xl font-medium text-foreground mb-1">স্বাগতম</h1>
          <p className="text-sm text-foreground/60 mb-6">অ্যাকাউন্টে প্রবেশ করুন</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/55 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/55 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-16 rounded-lg border border-border bg-input text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/55 hover:text-foreground"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'লগইন হচ্ছে…' : 'লগইন'}
            </button>
          </form>
        </div>

        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/40 text-center mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}
