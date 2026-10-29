"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import type { Book } from "@/lib/books";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatDZD, discountPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  "جديد": "bg-emerald-600 text-white",
  "الأكثر طلباً": "bg-brand text-white",
  "عرض خاص": "bg-gold text-brand-deep",
  "نفدت النسخ": "bg-stone-500 text-white",
};

export default function BookCard({ book }: { book: Book }) {
  const { addItem } = useCart();
  const { isWished, toggle } = useWishlist();
  const discount = discountPercent(book.price, book.oldPrice);
  const soldOut = book.badge === "نفدت النسخ";

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-100 shadow-card hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
      <Link href={`/book/${book.id}`} className="relative block aspect-[3/4] overflow-hidden bg-sand">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {book.badge && (
          <span className={cn("absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow", badgeStyles[book.badge])}>
            {book.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-red-600 text-white px-2.5 py-1 text-[11px] font-extrabold shadow">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 pt-2">
        <span className="text-[11px] font-bold text-gold-dark mb-1">{book.category}</span>
        <Link
          href={`/book/${book.id}`}
          className="font-extrabold text-ink text-sm leading-6 line-clamp-2 min-h-12 hover:text-brand transition-colors"
        >
          {book.title}
        </Link>
        <span className="text-xs text-stone-500 mt-0.5">{book.author}</span>

        <div className="mt-3 mb-3 flex items-baseline gap-2">
          <span className="font-extrabold text-brand text-lg">
            {formatDZD(book.price)}
          </span>
          {book.oldPrice && (
            <span className="text-xs text-stone-400 line-through">
              {formatDZD(book.oldPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-center gap-2">
          <button
            onClick={() => addItem(book.id)}
            disabled={soldOut}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand text-white text-sm font-extrabold py-2.5 hover:bg-brand-dark active:scale-[0.98] transition-all disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            {soldOut ? "نفدت النسخ" : "أضف إلى السلة"}
          </button>
          <button
            onClick={() => toggle(book.id)}
            disabled={soldOut}
            aria-label={isWished(book.id) ? "إزال من المفضلة" : "أضف للمفضلة"}
            className={cn(
              "shrink-0 rounded-xl border p-2.5 transition-all active:scale-[0.98]",
              isWished(book.id) ? "bg-gold/15 border-gold text-gold-dark" : "border-stone-200 text-stone-500 hover:border-brand hover:text-brand"
            )}
          >
            <Heart className={cn("h-4 w-4", isWished(book.id) && "fill-gold-dark")} />
          </button>
        </div>
      </div>
    </div>
  );
}
