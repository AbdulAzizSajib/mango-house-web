import Image from 'next/image'
import { Sprout, Hand, ShieldCheck, Package } from 'lucide-react'

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden card-elevated img-zoom">
              <Image
                src="https://images.unsplash.com/photo-1591375275624-c4cf57072647?auto=format&fit=crop&w=1200&q=85"
                alt="আম বাগান"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Floating secondary image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 w-48 aspect-square rounded-2xl overflow-hidden border-4 border-background card-elevated">
              <Image
                src="https://images.unsplash.com/photo-1623930154280-cf346e4d09b2?auto=format&fit=crop&w=400&q=85"
                alt="চাষি"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>

            {/* Year badge */}
            <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground rounded-2xl px-5 py-3 card-elevated">
              <p className="font-display text-3xl font-medium leading-none">২০২৫</p>
              <p className="text-[15px] uppercase tracking-wider font-medium mt-1">প্রতিষ্ঠিত</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="eyebrow mb-4">
              <span className="w-8 h-px bg-primary" />
              আমাদের গল্প
            </div>

         <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6">
  রাজশাহীর <span className="text-primary">খাঁটি আম</span>, বাগান থেকে সরাসরি আপনার ঘরে
</h2>

<p className="text-foreground/70 text-base sm:text-lg leading-relaxed mb-5">
  ২০২৫ সাল থেকে আমরা রাজশাহীর সেরা আম বাগান থেকে হাতে বাছাই করা তাজা ও প্রাকৃতিক আম সরাসরি আপনার কাছে পৌঁছে দিচ্ছি। কোনো মধ্যস্বত্বভোগী নয় — বাগান থেকে সরাসরি আপনার হাতে।
</p>

<p className="text-foreground/70 text-base leading-relaxed mb-8">
  প্রতিটি আম <span className="font-medium text-foreground">কার্বাইড ও ফরমালিনমুক্ত</span>, প্রাকৃতিকভাবে পাকানো এবং নিরাপদ। আমাদের লক্ষ্য — আপনার পরিবারের জন্য খাঁটি স্বাদের নিরাপদ আম নিশ্চিত করা।
</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Sprout, title: 'নিজস্ব বাগান', desc: 'সরাসরি সোর্সিং' },
                { Icon: Hand, title: 'হাতে বাছাই', desc: 'প্রতিটি আম' },
                { Icon: ShieldCheck, title: 'রাসায়নিকমুক্ত', desc: 'প্রাকৃতিক প্রক্রিয়া' },
                { Icon: Package, title: 'যত্নে প্যাকিং', desc: 'নিরাপদ ডেলিভারি' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
