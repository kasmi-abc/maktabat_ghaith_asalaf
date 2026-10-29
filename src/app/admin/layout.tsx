import { signOut } from "@/auth";
import { LogOut, Bell } from "lucide-react";

export const metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand" dir="rtl">
      <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur border-b border-stone-200/70">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="leading-tight text-right">
              <div className="font-extrabold text-ink text-base">مكتبة غيث السلف</div>
              <div className="text-[10px] text-stone-400 font-bold tracking-wide">
                GHAITH AS-SALAF ADMIN
              </div>
            </div>
            <span className="flex h-10 w-10 rounded-xl bg-brand-deep text-gold items-center justify-center font-extrabold">
              غ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="relative h-10 w-10 rounded-full bg-white border border-stone-200 items-center justify-center hidden sm:flex"
              aria-label="التنبيهات"
            >
              <Bell className="h-[18px] w-[18px] text-stone-500" />
              <span className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center font-extrabold text-sm">
              م
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="h-10 w-10 rounded-full bg-white border border-stone-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors"
                aria-label="خروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 pb-10">{children}</main>
    </div>
  );
}
