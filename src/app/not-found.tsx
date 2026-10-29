import Link from "next/link";
import { BookX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <BookX className="h-20 w-20 text-stone-300 mx-auto mb-6" />
      <h1 className="text-3xl font-extrabold text-ink mb-3">404 — الصفحة غير موجودة</h1>
      <p className="text-stone-500 mb-8">
        الصفحة أو الكتاب الذي تبحث عنه غير متوفر في المكتبة حالياً.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">العودة للرئيسية</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/books">تصفح الكتب</Link>
        </Button>
      </div>
    </div>
  );
}
