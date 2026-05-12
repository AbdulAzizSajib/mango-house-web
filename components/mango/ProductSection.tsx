'use client'

import ProductCard from './ProductCard'
import type { CartItem } from '@/app/page'


interface ProductSectionProps {
  cart: Map<string, CartItem>
  updateCart: (variety: string, quantity: number, price: number) => void
}

const MANGO_VARIETIES = [
  {
    id: 'gopalbhog',
    name: 'গোপালভোগ আম',
    nameEn: 'Gopalbhog',
    tagline: 'মৌসুমের প্রথম রাজা',
    price: 80,
    origin: 'রাজশাহী',
    description: [
      'মৌসুমের শুরুতেই পাওয়া যায়',
      'অত্যন্ত মিষ্টি ও সুগন্ধি',
      'আঁশ কম, শাঁস নরম',
      'মাঝারি সাইজের ও রসালো',
      'খেতে খুবই স্মুথ ও মুখে গলে যায়',
    ],
    image: '/mangoImage/Gopalvog_1.png',
    badge: 'প্রিমিয়াম',
  },
  {
    id: 'himsagar',
    name: 'হিমসাগর আম',
    nameEn: 'Himsagar',
    tagline: 'বাংলার গর্ব',
    price: 80,
    origin: 'রাজশাহী',
    description: [
      'বাংলাদেশের অন্যতম জনপ্রিয় প্রিমিয়াম আম',
      'প্রায় আঁশবিহীন',
      'গাঢ় হলুদ শাঁস ও দারুণ মিষ্টি স্বাদ',
      'পাতলা আঁটি, বেশি শাঁস',
      'সুগন্ধ ও স্বাদের জন্য খুব বিখ্যাত',
    ],
    image: '/mangoImage/Himsagor_1.png',
    badge: 'জনপ্রিয়',
  },
  {
    id: 'ranipochondo',
    name: 'রানীপছন্দ আম',
    nameEn: 'Rani Pochondo',
    tagline: 'রাজকীয় মিষ্টতা',
    price: 80,
    origin: 'রাজশাহী',
    description: [
      'নামের মতোই রাজকীয় স্বাদ',
      'আকারে বড় ও দেখতে আকর্ষণীয়',
      'মিষ্টি ও হালকা টক স্বাদের ব্যালেন্স',
      'শাঁস নরম ও রসালো',
      'অতিথি আপ্যায়ন ও উপহারের জন্য জনপ্রিয়',
    ],
    image: '/mangoImage/rani_pochondo.webp',
    badge: 'বিশেষ',
  },
  {
    id: 'langra',
    name: 'ল্যাংড়া আম',
    nameEn: 'Langra',
    tagline: 'ঐতিহ্যবাহী স্বাদ',
    price: 80,
    origin: 'রাজশাহী',
    description: [
      'বিশেষ ঘ্রাণ ও ইউনিক স্বাদের জন্য বিখ্যাত',
      'হালকা সবুজ রঙ থাকলেও ভেতরে পাকা ও মিষ্টি',
      'আঁশ কম ও শাঁস ঘন',
      'টক-মিষ্টির দারুণ কম্বিনেশন',
      'আমপ্রেমীদের অন্যতম পছন্দ',
    ],
    image: '/mangoImage/Gopalvog_2.png',
  },
  {
    id: 'amrapali',
    name: 'আম্রপালি আম',
    nameEn: 'Amrapali',
    tagline: 'ছোট কিন্তু অসাধারণ',
    price: 80,
    origin: 'রাজশাহী',
    description: [
      'হাইব্রিড জাতের জনপ্রিয় আম',
      'ছোট থেকে মাঝারি সাইজের',
      'অত্যন্ত মিষ্টি ও গাঢ় কমলা শাঁস',
      'আঁটি ছোট, তাই শাঁস বেশি',
      'দীর্ঘসময় সংরক্ষণ করা যায়',
    ],
    image: '/mangoImage/amrupali.png',
    badge: 'অর্গানিক',
  },
  {
    id: 'fazli',
    name: 'ফজলি আম',
    nameEn: 'Fazli',
    tagline: 'বড় ও রসালো',
    price: 80,
    origin: 'রাজশাহী',
    description: [
      'আকারে বড় ও ওজন বেশি',
      'দেরিতে বাজারে আসে',
      'মিষ্টি ও রসালো',
      'জুস, আমসত্ত্ব ও প্রসেসিংয়ের জন্য আদর্শ',
      'একটি আমেই পুরো পরিবার খেতে পারে',
    ],
    image: '/mangoImage/Himsagor_2.png',
    badge: 'ফ্যামিলি প্যাক',
  },
]

export default function ProductSection({ cart, updateCart }: ProductSectionProps) {
  return (
    <section id="products" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="eyebrow mb-4 ">
              <span className="w-8 h-px bg-primary" />
              <h2 className='font-medium'>
              আমাদের সংগ্রহ

              </h2>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              মৌসুমের <span className=" text-primary">সেরা</span> আম
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-foreground/65 text-base sm:text-lg mb-3">
              রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই — প্রতিটি আমে আছে খাঁটি স্বাদ, ঘ্রাণ ও রাজশাহীর ঐতিহ্যের ছোঁয়া।
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              সর্বনিম্ন ১০ কেজি অর্ডার · ৳৮০/কেজি
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MANGO_VARIETIES.map((mango) => {
            const cartItem = cart.get(mango.id)
            const quantity = cartItem?.quantity || 0

            return (
              <ProductCard
                key={mango.id}
                variety={mango}
                quantity={quantity}
                onUpdateQuantity={(qty) => updateCart(mango.id, qty, mango.price)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
