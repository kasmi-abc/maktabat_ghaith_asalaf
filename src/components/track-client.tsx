"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch, Truck, PackageCheck, XCircle, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wilayaName } from "@/lib/books";
import { formatDZD } from "@/lib/utils";

type TrackedOrder = {
  reference: string;
  date?: string;
  status: string;
  total?: number;
  itemsCount?: number;
  wilaya?: string;
  city?: string;
  fullName?: string;
  local?: boolean;
};

const STEPS = [
  { key: "pending", label: "قيد المراجعة", icon: Package },
  { key: "confirmed", label: "تم التأكيد", icon: PackageCheck },
  { key: "shipped", label: "في الطريق إليك", icon: Truck },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد — قيد التحضير",
  shipped: "تم الشحن",
  cancelled: "ملغى",
};

function StatusTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-600">
        <XCircle className="h-6 w-6" />
        <span className="font-extrabold text-sm">تم إلغاء هذا الطلب — اتصل بنا للاستفسار</span>
      </div>
    );
  }
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center justify-between gap-0">
      {STEPS.map((step, i) => {
        const active = i <= current;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                  active
                    ? "bg-brand border-brand text-white"
                    : "bg-white border-stone-200 text-stone-300"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </span>
              <span
                className={`text-[11px] font-extrabold whitespace-nowrap ${
                  active ? "text-brand" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-1 flex-1 rounded-full mx-2 mb-5 ${
                  i < current ? "bg-brand" : "bg-stone-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackClient() {
  const [reference, setReference] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [recent, setRecent] = useState<TrackedOrder[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ghaith-orders");
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const search = async (refArg?: string) => {
    const ref = (refArg ?? reference).trim();
    if (!ref) return;
    setSearching(true);
    setError(null);
    setOrder(null);

    const local = recent.find((o) => o.reference.toLowerCase() === ref.toLowerCase());

    try {
      const res = await fetch(`/api/orders?reference=${encodeURIComponent(ref)}`);
      if (res.ok) {
        const json = await res.json();
        setOrder({ ...json, local: false });
      } else if (local) {
        setOrder(local);
      } else {
        const json = await res.json().catch(() => null);
        setError(json?.error ?? "لا يوجد طلب بهذا الرقم");
      }
    } catch {
      if (local) setOrder(local);
      else setError("تعذر الاتصال, حاول لاحقاً");
    }
    setSearching(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        className="flex gap-2"
      >
        <Input
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="GA-2026-00001"
          dir="ltr"
          className="h-13 text-center font-extrabold tracking-wider bg-white"
        />
        <Button type="submit" size="lg" disabled={searching} className="shrink-0 gap-2">
          {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : <PackageSearch className="h-5 w-5" />}
          تتبع
        </Button>
      </form>

      {recent.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {recent.slice(0, 4).map((o) => (
            <button
              key={o.reference}
              onClick={() => {
                setReference(o.reference);
                search(o.reference);
              }}
              dir="ltr"
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-600 hover:border-brand hover:text-brand transition-colors"
            >
              {o.reference}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 text-red-600 p-4 text-sm font-bold text-center">
          {error}
        </div>
      )}

      {order && (
        <div className="mt-8 bg-white rounded-4xl border border-stone-100 shadow-card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-stone-100">
            <div>
              <div className="text-xs text-stone-400 mb-1">رقم الطلب</div>
              <div className="font-extrabold text-ink text-lg" dir="ltr">{order.reference}</div>
            </div>
            <span className="rounded-full bg-brand/10 text-brand px-4 py-1.5 text-xs font-extrabold">
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <StatusTimeline status={order.status} />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-sm">
            {order.fullName && (
              <div className="rounded-xl bg-sand p-3">
                <div className="text-xs text-stone-400 mb-0.5">الاسم</div>
                <div className="font-bold text-ink">{order.fullName}</div>
              </div>
            )}
            {(order.wilaya || order.city) && (
              <div className="rounded-xl bg-sand p-3">
                <div className="text-xs text-stone-400 mb-0.5">الموقع</div>
                <div className="font-bold text-ink">
                  {order.wilaya && wilayaName(order.wilaya)} {order.city ? `— ${order.city}` : ""}
                </div>
              </div>
            )}
            {order.total != null && (
              <div className="rounded-xl bg-sand p-3">
                <div className="text-xs text-stone-400 mb-0.5">الإجمالي</div>
                <div className="font-bold text-brand">{formatDZD(order.total)}</div>
              </div>
            )}
            {order.itemsCount != null && (
              <div className="rounded-xl bg-sand p-3">
                <div className="text-xs text-stone-400 mb-0.5">عدد النسخ</div>
                <div className="font-bold text-ink">{order.itemsCount}</div>
              </div>
            )}
            {order.date && (
              <div className="rounded-xl bg-sand p-3">
                <div className="text-xs text-stone-400 mb-0.5">تاريخ الطلب</div>
                <div className="font-bold text-ink">
                  {new Date(order.date).toLocaleDateString("ar-DZ")}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-stone-400 mt-8">
        فاقد رقم الطلب؟{" "}
        <Link href="/#contact" className="text-brand font-bold hover:underline">
          اتصل بنا
        </Link>{" "}
        وسنساعدك في تتبعه.
      </p>
    </div>
  );
}
