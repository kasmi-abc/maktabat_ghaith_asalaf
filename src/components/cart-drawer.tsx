"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, Plus, Minus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatDZD } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, count, subtotal, removeItem, setQty } = useCart();

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
                <ShoppingBag className="h-5 w-5" />
                سلة التسوق
                {count > 0 && <span className="text-gold-dark text-sm">({count})</span>}
              </h3>
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-stone-100" aria-label="إغلاق">
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-stone-500">
                  <ShoppingBag className="h-14 w-14 text-stone-300" />
                  <p className="font-bold">سلتك فارغة حالياً</p>
                  <Button asChild variant="gold" size="sm" onClick={onClose}>
                    <Link href="/books">تصفح الكتب</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
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
                        <span className="font-extrabold text-brand text-sm">
                          {formatDZD(item.price * item.qty)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="rounded-md border border-stone-200 p-1 hover:border-brand hover:text-brand"
                            aria-label="تقليل"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="rounded-md border border-stone-200 p-1 hover:border-brand hover:text-brand"
                            aria-label="زيادة"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-md p-1 text-red-400 hover:text-red-600 hover:bg-red-50"
                            aria-label="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-stone-200 px-5 py-4 space-y-3 bg-sand">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600 font-bold">المجموع الفرعي</span>
                  <span className="font-extrabold text-brand-dark">{formatDZD(subtotal)}</span>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href="/cart" onClick={onClose}>
                    إتمام الطلب
                  </Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
