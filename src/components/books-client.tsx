"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Book, Category } from "@/lib/books";
import { CATEGORIES } from "@/lib/books";
import BookCard from "@/components/book-card";
import CategoryIcon from "@/components/category-icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BooksClient({
  books,
  initialCategory,
}: {
  books: Book[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(initialCategory ?? "الكل");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc" | "discount">("default");

  const filtered = useMemo(() => {
    let result = books.filter((b) => {
      const matchesQuery =
        !query ||
        b.title.includes(query) ||
        b.author.includes(query) ||
        b.category.includes(query);
      const matchesCategory = category === "الكل" || b.category === category;
      return matchesQuery && matchesCategory;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "discount":
        result = [...result].sort((a, b) => {
          const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
          const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
          return db - da;
        });
        break;
      default:
        result = [...result].sort((a, b) => {
          const an = parseInt(a.id.replace("b", ""), 10) || 0;
          const bn = parseInt(b.id.replace("b", ""), 10) || 0;
          return an - bn;
        });
    }
    return result;
  }, [books, query, category, sort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن كتاب أو مؤلف..."
            className="pr-11 h-12 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-stone-500" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-11 rounded-xl border border-stone-300 bg-white px-3 text-sm font-bold text-ink focus:border-brand focus:outline-none"
            aria-label="ترتيب"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: من الأقل</option>
            <option value="price-desc">السعر: من الأعلى</option>
            <option value="discount">أكبر خصم أولاً</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory("الكل")}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-extrabold border transition-colors",
            category === "الكل"
              ? "bg-brand text-white border-brand"
              : "bg-white text-ink border-stone-200 hover:border-brand hover:text-brand"
          )}
        >
          الكل
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setCategory(cat.name)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold border transition-colors",
              category === cat.name
                ? "bg-brand text-white border-brand"
                : "bg-white text-ink border-stone-200 hover:border-brand hover:text-brand"
            )}
          >
            <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <Search className="h-12 w-12 mx-auto text-stone-300 mb-4" />
          <p className="font-bold mb-2">لا توجد نتائج مطابقة</p>
          <p className="text-sm">جرّب كلمة بحث أخرى أو غيّر القسم</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => { setQuery(""); setCategory("الكل"); }}>
            إعادة ضبط الفلاتر
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-stone-400 mt-10">
        عدد النتائج: {filtered.length} من أصل {books.length}
      </p>
    </div>
  );
}
