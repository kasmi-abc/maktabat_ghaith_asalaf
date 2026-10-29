import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";

const orderSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().regex(/^0[5-7][0-9]{8}$/),
  wilaya: z.string().min(1),
  city: z.string().min(2),
  address: z.string().min(5),
  notes: z.string().optional(),
  gift: z.boolean().optional(),
  giftMessage: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        qty: z.number().int().min(1).max(99),
        price: z.number().int().min(0),
      })
    )
    .min(1),
  subtotal: z.number().int().min(0),
  deliveryFee: z.number().int().min(0),
  total: z.number().int().min(0),
});

function makeReference(orderId: number) {
  const y = new Date().getFullYear();
  return `GA-${y}-${String(orderId).padStart(5, "0")}`;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = orderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "حقول الطلب غير صالحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    if (process.env.DATABASE_URL) {
      const { magaz, orders } = await import("@/db/index");
      const db = magaz();
      const reference = `GA-TMP-${Date.now()}`;
      const inserted = await db
        .insert(orders)
        .values({
          reference,
          fullName: data.fullName,
          phone: data.phone,
          wilaya: data.wilaya,
          city: data.city,
          address: data.address,
          notes: data.notes,
          gift: data.gift ?? false,
          giftMessage: data.giftMessage,
          items: data.items,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          total: data.total,
          status: "pending",
        })
        .returning({ id: orders.id });
      const orderId = inserted[0].id;
      const finalRef = makeReference(orderId);
      await db.update(orders).set({ reference: finalRef }).where(eq(orders.id, orderId));
      return NextResponse.json({ ok: true, reference: finalRef, id: orderId });
    }

    return NextResponse.json({
      ok: true,
      reference: makeReference(Math.floor(Math.random() * 99999) + 1),
      persisted: false,
    });
  } catch (error) {
    console.error("orders POST failed", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إرسال الطلب" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ error: "رقم الطلب مطلوب" }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const { magaz, orders } = await import("@/db/index");
      const db = magaz();
      const rows = await db
        .select()
        .from(orders)
        .where(eq(orders.reference, reference.trim().toUpperCase()))
        .orderBy(desc(orders.id))
        .limit(1);
      if (!rows[0]) {
        return NextResponse.json({ error: "لا يوجد طلب بهذا الرقم" }, { status: 404 });
      }
      const o = rows[0];
      return NextResponse.json({
        reference: o.reference,
        fullName: o.fullName,
        wilaya: o.wilaya,
        city: o.city,
        total: o.total,
        status: o.status,
        gift: o.gift,
        createdAt: o.createdAt,
      });
    }

    return NextResponse.json(
      { error: "التتبع عبر قاعدة البيانات غير مفعل حالياً" },
      { status: 503 }
    );
  } catch (error) {
    console.error("orders GET failed", error);
    return NextResponse.json({ error: "حدث خطأ أثناء التتبع" }, { status: 500 });
  }
}
