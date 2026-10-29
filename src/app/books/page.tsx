import type { Metadata } from "next";
import BooksClient from "@/components/books-client";
import { BOOKS, CATEGORIES } from "@/lib/books";

export const metadata: Metadata = {
  title: "جميع الكتب",
  description: "تصفح جميع كتب مكتبة غيث السلف في العقيدة والسيرة والتفسير والحديث وغيرها.",
};

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full bg-brand/10 text-brand px-4 py-1.5 text-xs font-extrabold">
          المكتبة الكاملة
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-3">
          جميع الكتب ({BOOKS.length})
        </h1>
        <p className="text-stone-500 mt-2 max-w-xl mx-auto text-sm md:text-base leading-7">
          استعمل البحث والفلاتر للوصول سريعاً إلى الكتاب الذي تريده من {CATEGORIES.length} أقسام.
        </p>
      </div>
      <BooksClient books={BOOKS} />
    </div>
  );
}
