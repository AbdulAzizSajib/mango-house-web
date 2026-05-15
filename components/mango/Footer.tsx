import {
  Leaf,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* ── CTA strip ── */}
        <div className="bg-background/5 border border-background/10 rounded-2xl p-6 sm:p-8 mb-14 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-2xl sm:text-3xl font-medium mb-1">
              এই মৌসুমে <span className="text-primary">৮০০</span> পরিবারের কাছে
              যাবে। <span className="text-background/80">আপনি কি একজন?</span>
            </h3>
            <p className="text-background/60 text-sm mt-1">
              হোয়াটসঅ্যাপে সরাসরি মেসেজ করুন — তাৎক্ষণিক রেসপন্স
            </p>
          </div>
          {/* FIX: WhatsApp actual logo instead of MessageCircle */}

          <a
            href="https://wa.me/8801708467621"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-medium px-7 py-3.5 rounded-full hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            <img src="/whatsapp.png" alt="" className="w-4 h-4" />
            হোয়াটসঅ্যাপে অর্ডার
          </a>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* FIX: use actual logo image, consistent with Navbar */}
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="Rajshahi Mango"
                className="w-10 h-10 object-contain"
              />
              <div className="leading-tight">
                <p className="font-display text-xl font-medium">
                  Rajshahi Mango
                </p>
                {/* FIX: was "Since 2015" — navbar says 2025, keeping consistent */}
                <p className="text-[10px] text-background/55 tracking-wider uppercase">
                  Since 2025
                </p>
              </div>
            </a>
            <p className="text-background/60 text-sm leading-relaxed">
              বাংলাদেশের বিখ্যাত বাগান থেকে হাতে বাছাই করা তাজা আম — ভালোবাসার
              সাথে আপনার দরজায়।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-medium mb-4 text-xs uppercase tracking-wider text-background/55">
              দ্রুত লিঙ্ক
            </h4>
            <ul className="space-y-2.5 text-sm text-background/65">
              {[
                { href: "#products", label: "আম দেখুন" },
                { href: "#about", label: "আমাদের সম্পর্কে" },
                { href: "#reviews", label: "কাস্টমার রিভিউ" },
                { href: "#faq", label: "FAQ" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="hover:text-background transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-xs uppercase tracking-wider text-background/55">
              যোগাযোগ
            </h4>
            <ul className="space-y-3 text-sm text-background/65">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <a
                  href="tel:+8801708467621"
                  className="hover:text-background transition-colors"
                >
                  +880 17084-67621
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />

                <a
                  href="https://www.rajshahimango.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition-colors break-all"
                >
                  www.rajshahimango.site
                </a>
              </li>
              {/* FIX: added WhatsApp as a contact item too */}
              <li className="flex items-center gap-2.5">
                <img src="/whatsapp.png" alt="" className="w-4 h-4 shrink-0" />
                <a
                  href="https://wa.me/8801708467621"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition-colors"
                >
                  WhatsApp করুন
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium mb-4 text-xs uppercase tracking-wider text-background/55">
              সোশ্যাল মিডিয়া
            </h4>
            <div className="flex gap-2">
              {[
                {
                  Icon: Facebook,
                  href: "https://facebook.com/themango.house",
                  label: "Facebook",
                },
                {
                  Icon: Instagram,
                  href: "https://instagram.com/themango.house",
                  label: "Instagram",
                },
                {
                  Icon: MessageCircle,
                  href: "https://wa.me/8801708467621",
                  label: "WhatsApp",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  // FIX: smooth transition on hover
                  className="w-10 h-10 rounded-xl bg-background/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-background/40 text-xs mt-4 leading-relaxed">
              আমাদের ফলো করুন সর্বশেষ আপডেটের জন্য
            </p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-background/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/45">
          <p>© ২০২৫ Rajshahi Mango। সব অধিকার সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-primary" />
            বাংলাদেশে ভালোবাসা দিয়ে তৈরি
          </p>
        </div>
      </div>
    </footer>
  );
}
