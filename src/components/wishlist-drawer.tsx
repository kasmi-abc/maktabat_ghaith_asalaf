"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useWishlist } from "@/lib/wishlist-context";
import { formatDZD } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wishes, toggle } = useWishlist();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-[61] shadow-2xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <h3 className="font-extrabold text-brand-dark flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-brand" />
                المفضلة
                {wishes.length > 0 && <span className="text-gold-dark text-sm">({wishes.length})</span>}
              </h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-stone-100" aria-label="إغلاق">
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {wishes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-stone-500">
                  <Heart className="h-14 w-14 text-stone-300" />
                  <p className="font-bold">قائمتك بالمفضلة فارغة حالياً</p>
                  <Button asChild variant="gold" size="sm" onClick={onClose}>
                    <Link href="/books">تصفح الكتب</Link>
                  </Button>
                </div>
              ) : (
                wishes.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-stone-200 p-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={88}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/book/${item.id}`}
                        onClick={onClose}
                        className="font-bold text-sm text-ink line-clamp-2 hover:text-brand"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-extrabold text-brand text-sm">{formatDZD(item.price)}</span>
                        <button
                          onClick={() => toggle(item.id)}
                          className="rounded-md p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50"
                          aria-label="إزالة من المفضلة"
                        >
                          <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {wishes.length > 0 && (
              <div className="border-t border-stone-200 px-5 py-4 bg-sand">
                <Button asChild className="w-full" size="lg" onClick={onClose}>
                  <Link href="/books">إضافة المزيد من الكتب</Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
