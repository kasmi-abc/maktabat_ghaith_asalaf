import type { Metadata } from "next";
import TrackClient from "@/components/track-client";

export const metadata: Metadata = {
  title: "تتبع طلبك",
  description: "تتبع حالة طلبك من مكتبة غيث السلف برقم الطلب.",
};

export default function TrackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full bg-brand/10 text-brand px-4 py-1.5 text-xs font-extrabold">
          خدمة التتبع
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-3">تتبع طلبك</h1>
        <p className="text-stone-500 mt-2 max-w-md mx-auto text-sm md:text-base">
          أدخل رقم الطلب (مثال: GA-2026-00001) لمعرفة حالته الحالية.
        </p>
      </div>
      <TrackClient />
    </div>
  );
}
