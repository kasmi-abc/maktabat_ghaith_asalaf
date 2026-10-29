import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Truck, ShieldCheck, Crown } from "lucide-react";
import BookCard from "@/components/book-card";
import AddToCartButton from "@/components/add-to-cart-button";
import { BOOKS, getBook, CATEGORIES } from "@/lib/books";
import { formatDZD, discountPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "كتاب غير موجود" };
  return {
    title: book.title,
    description: book.description,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const related = BOOKS.filter(
    (b) => b.category === book.category && b.id !== book.id
  ).slice(0, 4);
  const discount = discountPercent(book.price, book.oldPrice);

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand">الرئيسية</Link>
        <span>/</span>
        <Link href="/books" className="hover:text-brand">الكتب</Link>
        <span>/</span>
        <Link
          href={`/books?category=${encodeURIComponent(book.category)}`}
          className="hover:text-brand"
        >
          {book.category}
        </Link>
        <span>/</span>
        <span className="text-ink font-bold line-clamp-1 max-w-60">{book.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative rounded-4xl bg-white border border-stone-100 shadow-card aspect-[3/4] overflow-hidden">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 rounded-full bg-red-600 text-white px-3 py-1.5 text-xs font-extrabold shadow">
              خصم {discount}%
            </span>
          )}
        </div>

        <div>
          <span className="inline-block rounded-full bg-gold/15 text-gold-dark px-4 py-1.5 text-xs font-extrabold mb-3">
            {book.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink leading-relaxed mb-2">
            {book.title}
          </h1>
          <p className="text-stone-500 mb-5">{book.author}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-brand">{formatDZD(book.price)}</span>
            {book.oldPrice && (
              <span className="text-stone-400 line-through text-lg">
                {formatDZD(book.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-stone-600 leading-8 mb-6">{book.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-stone-100 p-3">
              <BookOpen className="h-5 w-5 text-brand" />
              <div>
                <div className="font-bold text-ink">{book.pages ? `${book.pages} صفحة` : "—"}</div>
                <div className="text-xs text-stone-400">الصفحات</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white border border-stone-100 p-3">
              <Crown className="h-5 w-5 text-brand" />
              <div>
                <div className="font-bold text-ink">{book.id.toUpperCase()}</div>
                <div className="text-xs text-stone-400">رمز الطبعة</div>
              </div>
            </div>
          </div>

          {book.badge && (
            <span className="inline-block mb-8 rounded-full bg-brand/10 text-brand px-4 py-1.5 text-xs font-extrabold">
              {book.badge}
            </span>
          )}

          <AddToCartButton book={book} />

          <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-brand/5 p-3 text-stone-600">
              <Truck className="h-4 w-4 text-brand" /> توصيل لجميع الولايات
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-brand/5 p-3 text-stone-600">
              <ShieldCheck className="h-4 w-4 text-brand" /> الدفع عند الاستلام
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-extrabold text-ink mb-6">
            من قسم {book.category}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href={`/books?category=${encodeURIComponent(book.category)}`}>
                تصفح كل كتب هذا القسم
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
