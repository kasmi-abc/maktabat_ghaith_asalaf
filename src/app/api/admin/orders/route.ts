import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

const patchSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["pending", "confirmed", "shipped", "cancelled"]),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return null;
  }
  return session;
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "قاعدة البيانات غير مفمكلة" }, { status: 503 });
    }
    const { magaz, orders } = await import("@/db/index");
    const db = magaz();
    await db
      .update(orders)
      .set({ status: parsed.data.status })
      .where(eq(orders.id, parsed.data.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin orders PATCH failed", error);
    return NextResponse.json({ error: "خطأ في التحديث" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "معرف غير صالح" }, { status: 400 });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "قاعدة البيانات غير مفمكلة" }, { status: 503 });
    }
    const { magaz, orders } = await import("@/db/index");
    const db = magaz();
    await db.delete(orders).where(eq(orders.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin orders DELETE failed", error);
    return NextResponse.json({ error: "خطأ في الحذف" }, { status: 500 });
  }
}
