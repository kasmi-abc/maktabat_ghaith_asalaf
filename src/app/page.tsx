import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, Truck, ShieldCheck, Star, Phone, Instagram,
  Facebook, MapPin, SearchCheck, Quote,
} from "lucide-react";
import HeroCarousel from "@/components/hero-carousel";
import BookCard from "@/components/book-card";
import Reveal from "@/components/reveal";
import NewsletterForm from "@/components/newsletter-form";
import SectionTitle from "@/components/section-title";
import CategoryIcon from "@/components/category-icon";
import {
  BOOKS, CATEGORIES, FEATURED_IDS, getBook, DISCOUNTED, INSTAGRAM_URL, FACEBOOK_URL, PHONE,
} from "@/lib/books";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const newBooks = [...BOOKS].slice(-4);
  const featured = FEATURED_IDS.map(getBook).filter(Boolean).slice(0, 8);
  const offers = DISCOUNTED.map(getBook).filter(Boolean).slice(0, 3);

  return (
    <>
      <HeroCarousel />

      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, title: "+3800 كتاب", sub: "متنوع بين العلوم الشرعية" },
            { icon: Truck, title: "توصيل لكل الولايات", sub: "سريع وموثوق لجميع الجهات" },
            { icon: ShieldCheck, title: "الدفع عند الاستلام", sub: "عند استلام طلبك بكل أريحية" },
            { icon: SearchCheck, title: "طبعات معتبرة محققة", sub: "من دور النشر الموثوقة" },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="flex items-center gap-3 rounded-2xl bg-white border border-stone-100 shadow-card p-4 h-full">
                <span className="shrink-0 rounded-2xl bg-brand/10 p-3 text-brand">
                  <s.icon className="h-6 w-6" />
                </span>
                <div className="leading-tight">
                  <div className="font-extrabold text-ink text-sm md:text-base">{s.title}</div>
                  <div className="text-stone-500 text-xs mt-1">{s.sub}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="categories" className="container mx-auto px-4 py-16 scroll-mt-24">
        <SectionTitle
          badge="الأقسام"
          title="تصفّح الأقسام على راحتك"
          subtitle="مختارات دقيقة من كتب العلم الشرعي النافع."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mt-10">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.06}>
              <Link
                href={`/books?category=${encodeURIComponent(cat.name)}`}
                className="group block h-full rounded-3xl bg-white border border-stone-100 shadow-card hover:shadow-lift hover:-translate-y-1 transition-all p-5 text-center"
              >
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white group-hover:scale-110 transition-all">
                  <CategoryIcon name={cat.icon} className="h-7 w-7" />
                </span>
                <h3 className="font-extrabold text-ink group-hover:text-brand transition-colors">{cat.name}</h3>
                <p className="text-stone-500 text-xs mt-2 leading-6">{cat.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-deep py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <span className="text-gold text-sm font-extrabold tracking-wide">وصل حديثاً</span>
            <h2 className="text-white text-2xl md:text-3xl font-extrabold mt-2">أحدث ما وصل لنا</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {newBooks.map((book, i) => (
              <Reveal key={book.id} delay={i * 0.07}>
                <BookCard book={book} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <SectionTitle badge="عروض خاصة" title="كتب الأسبوع المميزة" subtitle="خيارات نرصح بها لطلاب العلم والعائلات." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
          {featured.map((book, i) => book && (
            <Reveal key={book.id} delay={i * 0.06}>
              <BookCard book={book} />
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" variant="outline">
            <Link href="/books">عرض جميع الكتب</Link>
          </Button>
        </div>
      </section>

      <section id="about" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="relative rounded-4xl overflow-hidden shadow-lift aspect-[4/3]">
              <Image src="/books/b01.jpg" alt="مكتبة غيث السلف" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-deep/90 to-transparent p-6 text-white">
                <p className="font-extrabold text-lg">من رحاب المكتبة — كتب العلم الشرعي النافع</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <span className="text-gold-dark text-sm font-extrabold tracking-wide">من نحن؟</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-2 mb-5 leading-snug">
              مكتبة غيث السلف — رفوف من العلم النافع
            </h2>
            <p className="text-stone-600 leading-8 mb-4">
              نوفرف كتب العقيدة والسيرة والتفسير والحديث ومتون طالب العلم بطبعات
              حديثة معتبرة, مع توصيل سريع لجميع الولايات ودفع عند الاستلام.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "طبعات دقيقة محققة من دور النشر الموثوقة.",
                "أقسام مرتبة يسهل الوصول بها لما تبحث عنه.",
                "أسعار عادلة مع عروض وخصومات دائمة التجديد.",
                "خدمة عملاء عبر الهاتف وإنستغرام وفيسبوك.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-stone-700">
                  <span className="mt-1 rounded-full bg-brand/10 p-1">
                    <Star className="h-3.5 w-3.5 text-brand fill-brand" />
                  </span>
                  <span className="text-sm leading-7">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/books">تصفح الكتب الآن</Link>
              </Button>
              <Button asChild variant="gold">
                <a href={`tel:${PHONE}`}>
                  <Phone className="h-4 w-4" />
                  اتصل بنا
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {offers.length > 0 && (
        <section className="bg-brand-deep py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <span className="text-gold text-sm font-extrabold tracking-wide">عروض وخصومات</span>
              <h2 className="text-white text-2xl md:text-3xl font-extrabold mt-2">كتب بأسعار مخفضة</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {offers.map((book, i) => book && (
                <Reveal key={book.id} delay={i * 0.08}>
                  <BookCard book={book} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <SectionTitle badge="آراء طلابنا" title="ماذا قالوا معنا؟" subtitle="تجارب حقيقية من طلاب العلم وزوار المكتبة." />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            { name: "أحمد ب.", city: "سطيف", text: "طلبت رياض الصالحين ونزهة المتقين ووصلت بطبعات ممتازة وسرعة في التوصيل." },
            { name: "محمد ز.", city: "الجزائر", text: "أسعار سليمة وطبعات نافعة مع تعامل محترم, أنصح بها بقوة." },
            { name: "عبد الرحمن ك.", city: "البليدة", text: "اهتمام بنوعية الكتب قبل الشحن وسرعة في الرد على الاستفسارات, شكراً مكتبة غيث السلف." },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white border border-stone-100 shadow-card p-6">
                <Quote className="h-7 w-7 text-gold/50 mb-3" />
                <p className="text-stone-600 text-sm leading-7 mb-4">{t.text}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-gold fill-gold" />
                  ))}
                </div>
                <div className="font-extrabold text-ink text-sm">{t.name}</div>
                <div className="text-stone-400 text-xs">{t.city}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="container mx-auto px-4 pb-16 scroll-mt-24">
        <div className="rounded-4xl bg-gradient-to-l from-brand-dark to-brand-deep text-white p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">للتواصل والاستفسار عن الطلبات</h2>
              <p className="text-white/80 leading-8 text-sm md:text-base mb-6">
                نرد عليك بسرعة لاستفساراتك حول توفر الكتب والطبعات والأسعار
                وتفاصيل التوصيل مع الدفع عند الاستلام.
              </p>
              <div className="space-y-3">
                <a href={`tel:${PHONE}`} className="flex items-center gap-3 text-sm font-bold hover:text-gold transition-colors">
                  <span className="rounded-xl bg-white/10 p-2.5"><Phone className="h-5 w-5 text-gold" /></span>
                  <span dir="ltr">{PHONE}</span>
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold hover:text-gold transition-colors">
                  <span className="rounded-xl bg-white/10 p-2.5"><Instagram className="h-5 w-5 text-gold" /></span>
                  <span dir="ltr">@maktabat_ghaith_asalaf</span>
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-bold hover:text-gold transition-colors">
                  <span className="rounded-xl bg-white/10 p-2.5"><Facebook className="h-5 w-5 text-gold" /></span>
                  <span>صفحة المكتبة على فاسبوكم</span>
                </a>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className="rounded-xl bg-white/10 p-2.5"><MapPin className="h-5 w-5 text-gold" /></span>
                  <span>عثّة السلف — الجزائر</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 md:p-8 border border-white/15">
              <h3 className="font-extrabold text-lg mb-2 text-gold">اشترك في نشرتنا البريدية</h3>
              <p className="text-white/75 text-sm mb-5 leading-7">
                تصلك أحدث إصدارات المكتبة وأقوى العروض والخصومات أولاً بأول.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
