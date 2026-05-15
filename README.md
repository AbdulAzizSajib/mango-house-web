# Rajshahi Mango

E-commerce web application for ordering fresh Rajshahi mangoes — direct from the orchard to your door.

**Live:** [rajshahimango.site](https://www.rajshahimango.site)

---

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **State** — Zustand (cart & order state, persisted to localStorage)
- **Data Fetching** — TanStack Query v5
- **Forms** — React Hook Form + Zod
- **Analytics** — Vercel Analytics

## Features

- Product listing with variety selection and quantity picker
- Cart with minimum order validation (10 kg)
- Checkout with district/thana selection and delivery type (courier / home)
- Order confirmation page with WhatsApp support link
- Admin dashboard — orders, status management, hero banners, reviews, products
- SEO metadata + JSON-LD structured data

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Admin

Admin panel available at `/admin` — requires login credentials.
