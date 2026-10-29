"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Loader2, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور قصيرة جداً"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginForm() {
  const router = useRouter();
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
        setError("بيانات الدخول غير صحيحة");
        return;
      }
      const verify = await fetch("/api/auth/session");
      const session = await verify.json().catch(() => null);
      if ((session?.user?.role ?? "") !== "admin") {
        setError("هذا الحساب ليس حساب إدارة");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-sm p-8">
        <div className="text-center mb-6">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep text-gold">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="font-extrabold text-ink text-xl">دخول الإدارة</h1>
          <p className="text-stone-500 text-xs mt-1">هذه المنطقة مخصصة لمدير المكتبة فقط</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>البريد الإلكتروني</Label>
            <Input type="email" dir="ltr" placeholder="admin@ghaith.dz" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>كلمة المرور</Label>
            <Input type="password" dir="ltr" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {error && (
            <p className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs p-3">
              <ShieldAlert className="h-4 w-4" />
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
            {isSubmitting ? "جارِ الدخول..." : "دخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
