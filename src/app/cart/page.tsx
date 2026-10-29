import type { Metadata } from "next";
import CartClient from "@/components/cart-client";

export const metadata: Metadata = {
  title: "سلة التسوق",
  description: "أتمم طلبك من مكتبة غيث السلف.",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-8 text-center">
        سلة التسوق وإتمام الطلب
      </h1>
      <CartClient />
    </div>
  );
}
