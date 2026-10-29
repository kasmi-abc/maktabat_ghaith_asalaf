import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import AdminClient from "@/components/admin/admin-client";
import { BOOKS } from "@/lib/books";
import { orders as ordersSchema } from "@/db/schema";

type SchemaOrder = typeof ordersSchema.$inferSelect;

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if ((session.user as { role?: string }).role !== "admin") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 p-8 text-center mt-10">
        <h2 className="font-extrabold text-red-600 text-lg mb-2">غير مصرح بالدخول</h2>
        <p className="text-stone-500 text-sm">
          حسابك الحالي لا يملك صلاحية الإدارة.
        </p>
      </div>
    );
  }

  let orders: SchemaOrder[] = [];
  let dbReady = false;
  try {
    if (process.env.DATABASE_URL) {
      const { magaz, orders: ordersTable } = await import("@/db/index");
      const db = magaz();
      orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.id)).limit(200);
      dbReady = true;
    }
  } catch (e) {
    console.error("admin fetch orders failed", e);
  }

  return (
    <AdminClient
      adminName={session.user.name ?? "المدير"}
      initialOrders={JSON.parse(JSON.stringify(orders))}
      products={BOOKS.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        price: b.price,
        image: b.image,
        badge: b.badge,
      }))}
      dbReady={dbReady}
    />
  );
}
