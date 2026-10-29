import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "customer"] }).default("customer").notNull(),
  phone: text("phone"),
  wilaya: text("wilaya"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").unique().notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  wilaya: text("wilaya").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  gift: boolean("gift").notNull().default(false),
  giftMessage: text("gift_message"),
  items: jsonb("items").notNull(),
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  total: integer("total").notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "shipped", "cancelled"],
  })
    .default("pending")
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  bookId: text("book_id").notNull(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(20),
});
