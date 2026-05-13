const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ─── Public order types ───────────────────────────────────────────────────

export interface OrderPayload {
  fullName: string
  phone: string
  address: string
  city: string
  deliveryType: 'courier' | 'home'
  deliveryDate: string
  notes?: string
  subtotal: number
  total: number
  items: { variety: string; quantity: number; price: number }[]
}

export interface OrderResponse {
  success: boolean
  message: string
  data: {
    id: string
    createdAt: string
    fullName: string
    phone: string
    address: string
    city: string
    deliveryType: 'courier' | 'home'
    deliveryDate: string
    notes?: string
    subtotal: number
    total: number
    items: { id: string; orderId: string; variety: string; quantity: number; price: number }[]
  }
}

export async function postOrder(payload: OrderPayload): Promise<OrderResponse> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || 'অর্ডার পাঠাতে সমস্যা হয়েছে')
  }

  return res.json()
}

// ─── Admin auth ───────────────────────────────────────────────────────────

const TOKEN_KEY = 'mango_admin_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export interface LoginResponse {
  success: boolean
  message: string
  data: { token: string }
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || 'লগইন ব্যর্থ — ইমেইল বা পাসওয়ার্ড ঠিক করুন')
  }
  return json
}

/**
 * Authed fetch — attaches Bearer token, clears + redirects to /admin/login on 401.
 * Returns parsed JSON; throws Error with backend message on non-2xx.
 */
export class UnauthorizedError extends Error {
  constructor() { super('Unauthorized'); this.name = 'UnauthorizedError' }
}

export async function authFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers, cache: 'no-store' })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/admin/login')) {
      window.location.href = '/admin/login'
    }
    throw new UnauthorizedError()
  }

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((json as { message?: string })?.message || 'অনুরোধ ব্যর্থ হয়েছে')
  }
  return json as T
}

// ─── Admin orders ─────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export type AdminOrder = OrderResponse['data'] & { status?: OrderStatus }

export interface OrdersListResponse {
  success: boolean
  data: AdminOrder[]
}

export async function getOrders(): Promise<AdminOrder[]> {
  const json = await authFetch<OrdersListResponse | AdminOrder[]>('/admin/orders')
  return Array.isArray(json) ? json : json?.data ?? []
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await authFetch(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
