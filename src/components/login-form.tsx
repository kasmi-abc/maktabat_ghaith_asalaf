"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { LogIn, Loader2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        setError("بيانات الدخول غير صحيحة, حاول مجدداً.");
      } else if (res?.ok) {
        window.location.href = "/";
      }
    } catch {
      setError("تعذر الاتصال بالخادم, حاول لاحقاً.");
    }
  };

  return (
    <div className="bg-white rounded-4xl border border-stone-100 shadow-card p-8">
      <div className="text-center mb-6">
        <Image
          src="/logo.jpg"
          alt="مكتبة غيث السلف"
          width={64}
          height={64}
          className="rounded-full border-2 border-gold/60 mx-auto mb-3"
        />
        <h1 className="text-xl font-extrabold text-ink">تسجيل الدخول</h1>
        <p className="text-stone-500 text-sm mt-1">أدخل بياناتك للوصول إلى حسابك</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label>البريد الإلكتروني</Label>
          <Input type="email" placeholder="example@mail.com" dir="ltr" {...register("email")} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>كلمة المرور</Label>
          <Input type="password" placeholder="••••••••" dir="ltr" {...register("password")} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs p-3 text-center">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          {isSubmitting ? "جارِ الدخول..." : "تسجيل الدخول"}
        </Button>

        <p className="text-center text-xs text-stone-500">
          لا تملك حساباً؟{" "}
          <Link href="/login" className="text-brand font-bold hover:underline">
            إنشاء حساب قريباً
          </Link>
        </p>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          كلمات المرور مشفرة بـ bcrypt وجلسات آمنة عبر Auth.js.
        </p>
      </form>
    </div>
  );
}
