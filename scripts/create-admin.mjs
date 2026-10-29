import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const loadEnv = () => {
  try {
    const raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
};
loadEnv();

const [name, email, password] = process.argv.slice(2);
if (!name || !email || !password) {
  console.log('Usage: npm run admin:create -- "Full Name" "email@example.com" "password"');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL is not set in .env");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Error: password must be at least 8 characters");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const hash = await bcrypt.hash(password, 12);

try {
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${email.toLowerCase()}, ${hash}, 'admin')
    ON CONFLICT (email)
    DO UPDATE SET name = ${name}, password_hash = ${hash}, role = 'admin'
  `;
  console.log(`Admin created/updated: ${email}`);
} catch (err) {
  console.error("Failed:", err.message);
  console.error("Run `npm run db:push` first to create the tables.");
  process.exit(1);
}
