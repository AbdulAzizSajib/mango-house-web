import { Star, BadgeCheck, MapPin, Quote } from 'lucide-react'

const REVIEWS = [
  {
    name: 'রাফসান আহমেদ',
    location: 'ঢাকা',
    rating: 5,
    text: 'ভাই আম তো অসাধারণ হইসে 🥭 বাচ্চারা এত পছন্দ করসে যে ২ দিনেই শেষ। কোনো গ্যাস বা ফরমালিন এর গন্ধ নাই, একদম natural taste. পরের সপ্তাহে আবার অর্ডার দিব ইনশাল্লাহ।',
  },
  {
    name: 'সাবরিনা ইসলাম',
    location: 'চট্টগ্রাম',
    rating: 5,
    text: 'হিমসাগর hand a paisi vaiya 🙏 packaging dekhe khub valo legesi, ekta amo nosto hoy nai. on time delivery, recommend korbo sobaike.',
  },
  {
    name: 'মেহেদী হাসান',
    location: 'সিলেট',
    rating: 5,
    text: 'অফিসের colleagues দের gift করসিলাম, সবাই এত প্রশংসা করসে 😍 দাম reasonable, quality dekhei bujha jay khanti maal. thanks vai!',
  },
  {
    name: 'নুসরাত জাহান',
    location: 'রাজশাহী',
    rating: 5,
    text: 'ফজলি আম এত বড় হবে ভাবিনাই! রসে ভরা একদম, পুরো family মিলে খাইসি। অর্ডার process টাও easy ছিল, কোনো ঝামেলা নাই।',
  },
  {
    name: 'তানভীর রহমান',
    location: 'খুলনা',
    rating: 5,
    text: 'ল্যাংড়া আমের ঘ্রাণ পাইয়াই ছোটবেলার কথা মনে পড়ে গেল ভাই 😊 এরকম khanti আম এখনকার বাজারে পাওয়া যায় না। মান্গো হাউস কে ভরসা করা যায়, ১০০%।',
  },
  {
    name: 'ফারিয়া আক্তার',
    location: 'ঢাকা',
    rating: 5,
    text: 'আম্রপালি পেয়ে family খুশি 🥰 customer support টাও mashallah, WhatsApp এ সব update দিয়েছে on time. সব মিলায়ে great experience.',
  },
  {
    name: 'শাকিল হোসেন',
    location: 'নারায়ণগঞ্জ',
    rating: 5,
    text: 'গোপালভোগ vaiya nicely paisi, perfectly pakano. মুখে দিলেই মিলিয়ে যায় 😋 dam o thik ase, quality wise compare করার মতো না।',
  },
  {
    name: 'তাসনিম রহমান',
    location: 'গাজীপুর',
    rating: 5,
    text: 'রানীপছন্দ আম প্রথম খাইলাম এবার, ভাই অসাধারণ! নাম রাখসে যেমন taste o temon. শ্বশুরবাড়িতে gift dilam, ami bhalo paisi 🙌',
  },
  {
    name: 'ইমরান হোসেন',
    location: 'চট্টগ্রাম',
    rating: 5,
    text: 'courier theke pick up korar somoy ektu late hoise but ami pacharar shathe shathe khulei dekhi সব আম একদম fresh 👌 mango house er kaj kintu satti satti vorshajogyo.',
  },
]

export default function Testimonials() {
  return (
    <section id="reviews" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="eyebrow mb-4">
              <span className="w-8 h-px bg-primary" />
              <p className="font-medium text-base">কাস্টমার রিভিউ</p>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight">
              কী বলছেন আমাদের <span className="text-primary">খুশি কাস্টমাররা</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-card rounded-xl px-5 py-4 card-elevated border border-border/40">
            <div>
              <div className="flex items-center gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="font-display text-2xl font-medium text-foreground leading-none">
                ৪.৯ <span className="text-muted-foreground font-sans text-lg">/ ৫</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">১২০০+ যাচাইকৃত রিভিউ</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <article
              key={review.name}
              className="relative bg-card rounded-2xl p-6 card-elevated card-hover border border-border/40"
            >
              <Quote className="absolute top-6 right-6 w-6 h-6 text-primary/15" strokeWidth={2} />

              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-foreground/80 text-sm leading-relaxed mb-6 min-h-24">
                {review.text}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{review.name}</p>
                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3" /> {review.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
