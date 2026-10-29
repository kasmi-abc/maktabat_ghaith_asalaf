"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Menu, X, Phone, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { PHONE } from "@/lib/books";
import { formatDZD } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/cart-drawer";
import WishlistDrawer from "@/components/wishlist-drawer";
import { useWishlist } from "@/lib/wishlist-context";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/books", label: "الكتب" },
  { href: "/books?category=العقيدة", label: "العقيدة" },
  { href: "/books?category=السيرة", label: "السيرة" },
  { href: "/#categories", label: "الأقسام" },
  { href: "/#about", label: "من نحن" },
  { href: "/#contact", label: "اتصل بنا" },
  { href: "/track", label: "تتبع طلبك" },
];

export default function SiteHeader() {
  const { count, subtotal, items } = useCart();
  const { count: wishCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <>
      <div className="bg-brand-deep text-white text-xs md:text-sm py-1.5 px-4 text-center">
        توصيل لجميع الولايات • الدفع عند الاستلام • للطلب والاستفسار: {PHONE}
      </div>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-brand/10 shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.jpg"
              alt="مكتبة غيث السلف"
              width={52}
              height={52}
              className="rounded-full border-2 border-gold/60 shadow-sm"
              priority
            />
            <div className="leading-tight">
              <div className="font-extrabold text-brand-dark text-base sm:text-lg">مكتبة غيث السلف</div>
              <div className="text-[10px] sm:text-[11px] text-gold-dark font-bold tracking-wide">
                GHAITH AS-SALAF LIBRARY
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-bold text-ink hover:text-brand hover:bg-brand/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <a href={`tel:${PHONE}`} className="gap-1.5">
                <Phone className="h-4 w-4" />
                <span dir="ltr">{PHONE}</span>
              </a>
            </Button>

            <button
              onClick={() => setWishlistOpen(true)}
              className="relative rounded-xl bg-brand text-white p-2.5 hover:bg-brand-dark transition-colors"
              aria-label="المفضلة"
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-gold text-brand-deep text-[11px] font-extrabold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-xl bg-brand text-white p-2.5 hover:bg-brand-dark transition-colors"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -left-1.5 bg-gold text-brand-deep text-[11px] font-extrabold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden rounded-xl border border-brand/20 p-2.5 text-brand"
              aria-label="القائمة"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t border-brand/10 bg-white px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-ink hover:text-brand hover:bg-brand/5"
              >
                {link.label}
              </Link>
            ))}
            {items.length > 0 && (
              <div className="pt-2 pb-1 text-xs font-bold text-brand">
                سلتك: {count} عنصر — {formatDZD(subtotal)}
              </div>
            )}
          </nav>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </>
  );
}
