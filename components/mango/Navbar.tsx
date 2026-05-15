"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

const NAV_LINKS = [
  { href: "/#products", label: "আমাদের আম" },
  { href: "/#reviews", label: "রিভিউ" },
  { href: "/#care-guide", label: "যত্নের টিপস" },
  { href: "/#faq", label: "FAQ" },
];

const PHONE_DISPLAY = "+880 17825-21705";
const PHONE_TEL = "+880 17825-21705";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { totalKg, total, cart } = useCartStore();

  const hasItems = cart.size > 0;
  const kg = totalKg();
  const amount = total();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img
            className="w-10 sm:w-12"
            src="/logo.png"
            alt="Rajshahi Mango logo"
          />
          <div className="leading-tight">
            <p className="font-display text-base sm:text-xl font-medium text-foreground">
              Rajshahi Mango
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground tracking-wider uppercase">
              Since 2025
            </p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/75">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop: WhatsApp + phone */}
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors"
          >
            <img className="w-5 h-5" src="/whatsapp.png" alt="WhatsApp" />
            <span className="font-mono text-sm tracking-tight text-foreground/80 hover:text-foreground">
              {PHONE_DISPLAY}
            </span>
          </a>

          {/* Cart button */}
          {hasItems && (
            <button
              onClick={() => router.push("/checkout")}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] hover:scale-[1.02] transition-all shadow-sm"
            >
              <div className="relative shrink-0">
                <ShoppingCart className="w-4 h-4" />
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary-foreground text-primary text-[10px] font-bold flex items-center justify-center leading-none">
                  {cart.size}
                </span>
              </div>
              <span className="w-px h-5 bg-primary-foreground/20" />
              <div className="flex  items-start leading-tight">
                <span className="text-sm font-medium  tracking-wide uppercase">
                  {kg} কেজি
                </span>
                <span className="w-px mx-2 h-5 bg-primary-foreground/20" />
                <span className="text-sm font-bold font-mono tracking-tight">
                  {amount.toLocaleString()} টাকা
                </span>
              </div>
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors"
            aria-label="মেনু"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
            >
              {l.label}
            </a>
          ))}

          {/* Mobile: WhatsApp call */}
          <a
            href={`tel:${PHONE_TEL}`}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors border-t border-border/40 mt-1 pt-4"
          >
            <img className="w-5 h-5" src="/whatsapp.png" alt="" />
            {PHONE_DISPLAY}
          </a>
        </nav>
      )}
    </header>
  );
}
