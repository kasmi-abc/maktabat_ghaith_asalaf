"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Phone, MapPin, BookOpen, Truck, ShieldCheck, Clock } from "lucide-react";
import { CATEGORIES, INSTAGRAM_URL, FACEBOOK_URL, PHONE } from "@/lib/books";
import DesignerCredit from "@/components/designer";

export default function SiteFooter() {
  return (
    <footer className="mt-20 bg-brand-deep text-white">
      <div className="border-b border-white/10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 px-4 py-10 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpg"
                alt="مكتبة غيث السلف"
                width={56}
                height={56}
                className="rounded-full border-2 border-gold/60"
              />
              <div className="leading-tight">
                <div className="font-extrabold text-lg">مكتبة غيث السلف</div>
                <div className="text-[11px] text-gold font-bold tracking-wide">
                  GHAITH AS-SALAF LIBRARY
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-7">
              مكتبة غيث السلف — متجر إلكتروني متخصص في كتب العلم الشرعي على منهاج السلف: العقيدة، السيرة، التفسير، الحديث ومتون طالب العلم, مع توصيل لجميع الولايات ودفع عند الاستلام.
            </p>
            <div className="flex gap-2 mt-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 p-2.5 hover:bg-white/20 transition-colors"
                aria-label="إنستغرام"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/10 p-2.5 hover:bg-white/20 transition-colors"
                aria-label="فيسبوك"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`tel:${PHONE}`}
                className="rounded-xl bg-white/10 p-2.5 hover:bg-white/20 transition-colors"
                aria-label="اتصل بنا"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold mb-4 text-gold">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link></li>
              <li><Link href="/books" className="hover:text-gold transition-colors">جميع الكتب</Link></li>
              <li><Link href="/cart" className="hover:text-gold transition-colors">سلة التسوق</Link></li>
              <li><Link href="/track" className="hover:text-gold transition-colors">تتبع طلبك</Link></li>
              <li><Link href="/#about" className="hover:text-gold transition-colors">من نحن</Link></li>
              <li><Link href="/#contact" className="hover:text-gold transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold mb-4 text-gold">أقسام المكتبة</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.name}>
                  <Link href={`/books?category=${encodeURIComponent(cat.name)}`} className="hover:text-gold transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold mb-4 text-gold">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <a href={`tel:${PHONE}`} dir="ltr" className="hover:text-gold">{PHONE}</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-gold" />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-gold">
                  @maktabat_ghaith_asalaf
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span>عثّة السلف — الجزائر</span>
              </li>
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-white/70">
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 p-2">
                <Truck className="h-4 w-4 text-gold" /> توصيل لكل الولايات
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 p-2">
                <ShieldCheck className="h-4 w-4 text-gold" /> دفع عند الاستلام
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 p-2">
                <BookOpen className="h-4 w-4 text-gold" /> طبعات معتبرة
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 p-2">
                <Clock className="h-4 w-4 text-gold" /> خدمة متواصلة
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} مكتبة غيث السلف</p>
          <DesignerCredit />
        </div>
      </div>
    </footer>
  );
}
