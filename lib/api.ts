const BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
