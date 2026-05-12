import { Leaf, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* CTA strip */}
        <div className="bg-background/5 border border-background/10 rounded-2xl p-6 sm:p-8 mb-14 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-2xl sm:text-3xl font-medium mb-1">
              এখনই অর্ডার করতে চান?
            </h3>
            <p className="text-background/70 text-sm">
              হোয়াটসঅ্যাপে সরাসরি মেসেজ করুন — তাৎক্ষণিক রেসপন্স
            </p>
          </div>
          <a
            href="https://wa.me/8801700000000?text=হ্যালো%20ম্যাঙ্গো%20হাউস"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-7 py-3.5 rounded-full hover:bg-primary/90 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            হোয়াটসঅ্যাপে অর্ডার
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="font-display text-xl font-medium">ম্যাঙ্গো হাউস</p>
                <p className="text-[10px] text-background/60 tracking-wider uppercase">Since 2015</p>
              </div>
            </div>
            <p className="text-background/65 text-sm leading-relaxed">
              বাংলাদেশের বিখ্যাত বাগান থেকে হাতে বাছাই করা তাজা আম — ভালোবাসার সাথে আপনার দরজায়।
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-background/90">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2.5 text-sm text-background/65">
              <li><a href="#products" className="hover:text-background">আম দেখুন</a></li>
              <li><a href="#about" className="hover:text-background">আমাদের সম্পর্কে</a></li>
              <li><a href="#reviews" className="hover:text-background">কাস্টমার রিভিউ</a></li>
              <li><a href="#faq" className="hover:text-background">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-background/90">যোগাযোগ</h4>
            <ul className="space-y-3 text-sm text-background/65">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="tel:+8801782521705" className="hover:text-background">০১৭৮২-৫২১৭০৫</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <a href="mailto:hello@mangohouse.bd" className="hover:text-background">hello@mangohouse.bd</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>মেরুল বাড্ডা, ঢাকা ১২১২</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-background/90">সোশ্যাল</h4>
            <div className="flex gap-2.5">
              {[
                { Icon: Facebook, href: 'https://facebook.com/themango.house', label: 'Facebook' },
                { Icon: Instagram, href: 'https://instagram.com/themango.house', label: 'Instagram' },
                { Icon: MessageCircle, href: 'https://wa.me/8801782521705', label: 'WhatsApp' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center"
                  title={label}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/55">
          <p>© ২০২৫ ম্যাঙ্গো হাউস। সব অধিকার সংরক্ষিত।</p>
          <p>বাংলাদেশে ভালোবাসা দিয়ে তৈরি</p>
        </div>
      </div>
    </footer>
  )
}
