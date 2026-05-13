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
  // Only set JSON content-type when body is NOT FormData (multipart handles its own boundary)
  if (!(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
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

// ─── Hero Banners ─────────────────────────────────────────────────────────────

export interface HeroBanner {
  id: string
  title: string
  subtitle: string
  category: string
  harvestDate: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HeroBannersResponse {
  success: boolean
  message: string
  data: HeroBanner[]
}

export interface HeroBannerResponse {
  success: boolean
  message: string
  data: HeroBanner
}

export async function getBanners(): Promise<HeroBanner[]> {
  const json = await authFetch<HeroBannersResponse>('/hero-banners')
  return json.data
}

export async function getBanner(id: string): Promise<HeroBanner> {
  const json = await authFetch<HeroBannerResponse>(`/hero-banners/${id}`)
  return json.data
}

export interface CreateBannerPayload {
  title: string
  subtitle?: string
  category?: string
  harvestDate?: string
  isActive: boolean
  images: File[]
}

export async function createBanner(payload: CreateBannerPayload): Promise<HeroBanner> {
  const fd = new FormData()
  fd.append('title', payload.title)
  if (payload.subtitle) fd.append('subtitle', payload.subtitle)
  if (payload.category) fd.append('category', payload.category)
  if (payload.harvestDate) fd.append('harvestDate', payload.harvestDate)
  fd.append('isActive', String(payload.isActive))
  payload.images.forEach((f) => fd.append('images', f))
  const json = await authFetch<HeroBannerResponse>('/hero-banners', { method: 'POST', body: fd })
  return json.data
}

export interface UpdateBannerPayload {
  title?: string
  subtitle?: string
  category?: string
  harvestDate?: string
  isActive?: boolean
  images?: File[]
  removeImages?: string[]
}

export async function updateBanner(id: string, payload: UpdateBannerPayload): Promise<HeroBanner> {
  const fd = new FormData()
  if (payload.title !== undefined) fd.append('title', payload.title)
  if (payload.subtitle !== undefined) fd.append('subtitle', payload.subtitle)
  if (payload.category !== undefined) fd.append('category', payload.category)
  if (payload.harvestDate !== undefined) fd.append('harvestDate', payload.harvestDate)
  if (payload.isActive !== undefined) fd.append('isActive', String(payload.isActive))
  payload.images?.forEach((f) => fd.append('images', f))
  payload.removeImages?.forEach((url) => fd.append('removeImages', url))
  const json = await authFetch<HeroBannerResponse>(`/hero-banners/${id}`, { method: 'PATCH', body: fd })
  return json.data
}

export async function deleteBanner(id: string): Promise<void> {
  await authFetch(`/hero-banners/${id}`, { method: 'DELETE' })
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  comment: string
  location: string
  isApproved: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface TestimonialsResponse {
  success: boolean
  data: Testimonial[]
}

export interface TestimonialResponse {
  success: boolean
  data: Testimonial
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const json = await authFetch<TestimonialsResponse>('/testimonials/admin/all')
  return json.data
}

export async function createTestimonial(payload: { name: string; comment: string; location: string }): Promise<Testimonial> {
  const json = await authFetch<TestimonialResponse>('/testimonials', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return json.data
}

export async function approveTestimonial(id: string, isApproved: boolean): Promise<Testimonial> {
  const json = await authFetch<TestimonialResponse>(`/testimonials/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ isApproved }),
  })
  return json.data
}

export async function featureTestimonial(id: string, isFeatured: boolean): Promise<Testimonial> {
  const json = await authFetch<TestimonialResponse>(`/testimonials/${id}/feature`, {
    method: 'PATCH',
    body: JSON.stringify({ isFeatured }),
  })
  return json.data
}

export async function updateTestimonial(id: string, comment: string): Promise<Testimonial> {
  const json = await authFetch<TestimonialResponse>(`/testimonials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ comment }),
  })
  return json.data
}

export async function deleteTestimonial(id: string): Promise<void> {
  await authFetch(`/testimonials/${id}`, { method: 'DELETE' })
}
