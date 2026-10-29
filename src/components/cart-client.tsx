"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Minus, CheckCircle2, ShoppingBag, Gift } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatDZD } from "@/lib/utils";
import { WILAYAS, PHONE, wilayaName as wilayaLabel } from "@/lib/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const deliveryFee = 600;

const schema = z.object({
  fullName: z.string().min(3, "الاسم مطلوب (من 3 أحرف على الأقل)"),
  phone: z
    .string()
    .regex(/^0[5-7][0-9]{8}$/, "رقم هاتف جزائري صحيح مطلوب (مثال: 0555786250)"),
  wilaya: z.string().min(1, "اختر الولاية"),
  city: z.string().min(2, "البلدية مطلوبة"),
  address: z.string().min(5, "العنوان مطلوب للوصول إليك"),
  notes: z.string().optional(),
  giftMessage: z.string().max(500, "النص طويل جداً").optional(),
});

type FormData = z.infer<typeof schema>;

export default function CartClient() {
  const { items, count, subtotal, setQty, removeItem, clear, isHydrated } = useCart();
  const [wilaya, setWilaya] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  const saveOrderLocally = (reference: string) => {
    try {
      const raw = window.localStorage.getItem("ghaith-orders");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        reference,
        date: new Date().toISOString(),
        status: "pending",
        total,
        itemsCount: count,
      });
      window.localStorage.setItem("ghaith-orders", JSON.stringify(list.slice(0, 20)));
    } catch {}
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      gift: isGift,
      giftMessage: isGift ? giftMessage : undefined,
      items: items.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
      subtotal,
      deliveryFee,
      total,
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      const ref = json?.reference ?? `GA-${Date.now()}`;
      saveOrderLocally(ref);
      setDone(ref);
      clear();
      reset();
      setIsGift(false);
      setGiftMessage("");
      setWilaya("");
    } catch {
      const ref = `GA-${Date.now()}`;
      saveOrderLocally(ref);
      setDone(ref);
      clear();
      reset();
      setIsGift(false);
      setGiftMessage("");
      setWilaya("");
    }
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto text-center bg-white rounded-4xl border border-stone-100 shadow-card p-10">
        <CheckCircle2 className="h-16 w-16 text-brand mx-auto mb-5" />
        <h2 className="text-2xl font-extrabold text-ink mb-3">تم استلام طلبك بنجاح</h2>
        <p className="text-stone-600 leading-8 mb-2">
          شكراً لك! سنتصل بك هاتفياً لتأكيد الطلب وتفاصيل التوصيل.
        </p>
        <p className="text-sm text-stone-500 mb-6">
          رقم طلبك الموثق: <span className="font-extrabold text-brand" dir="ltr">{done}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-3">
          <Button asChild>
            <Link href="/books">مواصلة التسوق</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${PHONE}`}>اتصل بنا: {PHONE}</a>
          </Button>
        </div>
        <Link href="/track" className="text-xs font-bold text-brand hover:underline">
          تتبع حالة طلبك من هنا ←
        </Link>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="text-center py-20 text-stone-400 font-bold">جارِ تحميل السلة...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <ShoppingBag className="h-16 w-16 text-stone-300 mx-auto mb-5" />
        <p className="text-stone-600 font-bold text-lg mb-2">سلتك فارغة</p>
        <p className="text-stone-400 text-sm mb-6">أضف بعض الكتب لتبدأ التسوق</p>
        <Button asChild size="lg">
          <Link href="/books">تصفح الكتب</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white rounded-3xl border border-stone-100 shadow-card p-4">
            <Link href={`/book/${item.id}`} className="shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={112}
                className="rounded-xl object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/book/${item.id}`} className="font-extrabold text-sm text-ink line-clamp-2 hover:text-brand">
                {item.title}
              </Link>
              <div className="text-brand font-extrabold text-sm mt-1.5">
                {formatDZD(item.price)} <span className="text-stone-400 text-xs font-normal">/ نسخة</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    className="rounded-lg border border-stone-200 p-1.5 hover:border-brand hover:text-brand"
                    aria-label="تقليل"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center font-extrabold text-sm">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    className="rounded-lg border border-stone-200 p-1.5 hover:border-brand hover:text-brand"
                    aria-label="زيادة"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 mr-1"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-extrabold text-brand-dark">{formatDZD(item.price * item.qty)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl border border-stone-100 shadow-card p-6 space-y-4"
          noValidate
        >
          <h2 className="text-lg font-extrabold text-ink">معلومات التوصيل</h2>

          <div className="space-y-1.5">
            <Label>الاسم الكامل *</Label>
            <Input placeholder="مثال: عبد الله بن محمد" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>رقم الهاتف *</Label>
            <Input
              placeholder="0555786250"
              dir="ltr"
              inputMode="numeric"
              {...register("phone")}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>الولاية *</Label>
            <Select
              value={wilaya}
              onValueChange={(v) => {
                setWilaya(v);
                setValue("wilaya", v, { shouldValidate: true });
              }}
            >
              <SelectTrigger className="w-full">
                {wilaya ? `${wilaya} — ${wilayaLabel(wilaya)}` : "اختر الولاية"}
              </SelectTrigger>
              <SelectContent>
                {WILAYAS.map((w) => (
                  <SelectItem key={w.code} value={w.code}>
                    {w.code} — {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("wilaya")} />
            {errors.wilaya && <p className="text-xs text-red-500">{errors.wilaya.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>البلدية *</Label>
            <Input placeholder="مثال: عين وسارة" {...register("city")} />
            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>العنوان مفصل *</Label>
            <Textarea placeholder="الحي، نقطة تعبئة إشارة، الترقطبات..." {...register("address")} />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <button
            type="button"
            onClick={() => setIsGift((v) => !v)}
            className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${
              isGift
                ? "border-gold bg-gold/10"
                : "border-stone-200 bg-white hover:border-gold/50"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isGift ? "bg-gold text-white" : "bg-gold/15 text-gold-dark"
              }`}
            >
              <Gift className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-extrabold text-ink">
                تغليف الطلب كهدية + بطاقة إهداء
              </span>
              <span className="block text-xs text-stone-500 mt-0.5">
                مجاناً — أضف نصك وسيكتب على بطاقة أنيقة مع الكتب
              </span>
            </span>
            <span
              className={`h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                isGift ? "bg-gold border-gold" : "border-stone-300"
              }`}
            >
              {isGift && <CheckCircle2 className="h-4 w-4 text-white" />}
            </span>
          </button>

          {isGift && (
            <div className="space-y-1.5 rounded-2xl border border-gold/40 bg-gold/5 p-4">
              <Label>نص بطاقة الإهداء *</Label>
              <Textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="مثال: إلى أختي الحبيبة، وفقك الله في طلب العلم..."
                className="bg-white"
                maxLength={500}
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>سيُكتب النص على بطاقة أنيقة ترفق مع الطلب</span>
                <span>{giftMessage.length}/500</span>
              </div>
              {giftMessage.trim().length > 0 && (
                <div className="rounded-xl bg-white border border-gold/30 p-4 mt-2">
                  <p className="text-[11px] font-extrabold text-gold-dark mb-1.5">معاينة البطاقة:</p>
                  <p className="text-sm text-ink leading-7 font-bold whitespace-pre-wrap">
                    {giftMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>ملاحظات (اختياري)</Label>
            <Textarea placeholder="أي معلومة إضافية ترغب في توضيحها..." {...register("notes")} />
          </div>

          <div className="rounded-2xl bg-sand p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">المجموع ({count} نسخة)</span>
              <span className="font-bold">{formatDZD(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">التوصيل</span>
              <span className="font-bold">{formatDZD(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
              <span className="font-extrabold text-ink">الإجمالي</span>
              <span className="font-extrabold text-brand text-lg">{formatDZD(total)}</span>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "جارِ الإرسال..." : "تأكيد الطلب — الدفع عند الاستلام"}
          </Button>
        </form>
      </div>
    </div>
  );
}
