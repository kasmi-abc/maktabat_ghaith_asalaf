"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL } from "@/lib/books";

const schema = z.object({
  email: z.string().email("أدخل بريداً إلكترونياً صحيحاً"),
});

type FormData = z.infer<typeof schema>;

export default function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 500));
    setDone(true);
    reset();
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-gold-light font-bold text-sm py-3 justify-center">
        <CheckCircle2 className="h-5 w-5" />
        تم تسجيلك بنجاح, ستصلك أحدث إصدارات المكتبة وتخفيضاتها أول بامتياز.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
      <div className="flex-1">
        <Input
          type="email"
          placeholder="بريدك الإلكتروني"
          {...register("email")}
          className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-gold focus:ring-gold/30"
        />
        {errors.email && <p className="mt-1 text-xs text-red-300 text-right">{errors.email.message}</p>}
      </div>
      <Button type="submit" variant="gold" disabled={isSubmitting} className="gap-2">
        <Send className="h-4 w-4" />
        {isSubmitting ? "جارِ الإرسال..." : "اشترك"}
      </Button>
    </form>
  );
}
