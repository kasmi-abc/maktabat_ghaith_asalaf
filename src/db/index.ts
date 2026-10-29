import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(databaseUrl);

export function magaz() {
  if (!databaseUrl) {
    throw new Error("magaz: DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export type MagazDB = ReturnType<typeof magaz>;

export const users = schema.users;
export const orders = schema.orders;
export const orderItems = schema.orderItems;
export const products = schema.products;
