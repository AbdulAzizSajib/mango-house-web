import { Users, TreePine, MapPin, Star } from 'lucide-react'

const STATS = [
  { Icon: Users, value: '৫০০০+', label: 'খুশি কাস্টমার' },
  { Icon: TreePine, value: '১০+', label: 'বছরের অভিজ্ঞতা' },
  { Icon: MapPin, value: '৬৪', label: 'জেলায় ডেলিভারি' },
  { Icon: Star, value: '৪.৯', label: 'গড় রেটিং' },
]

export default function StatsBar() {
  return (
    <section className="border-y border-border/40 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {STATS.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold leading-none">{value}</p>
                <p className="text-xs sm:text-sm text-background/65 mt-1.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
