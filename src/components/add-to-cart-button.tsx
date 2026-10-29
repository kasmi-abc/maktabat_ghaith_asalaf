"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { Book } from "@/lib/books";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({ book }: { book: Book }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = book.badge === "نفدت النسخ";

  const handleAdd = () => {
    addItem(book.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex gap-3">
      <Button size="lg" disabled={soldOut} onClick={handleAdd} className="flex-1">
        {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
        {soldOut ? "نفدت النسخ" : added ? "أُضيف إلى السلة" : "أضف إلى السلة"}
      </Button>
    </div>
  );
}
