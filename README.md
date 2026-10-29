# Maktabat Ghaith As-Salaf - Website

Official Arabic RTL website for the library (مكتبة غيث السلف) — serif Arabic identity, gold/ink palette, fully static-friendly and deploys to Vercel.

## Stack
- **Next.js 15 (App Router) + TypeScript** — Server Components, SSG book pages, SEO metadata.
- **Tailwind CSS** — custom RTL design (brand/gold/ink/sand tokens).
- **Framer Motion** — hero carousel and reveal animations.
- **React Hook Form + Zod** — checkout and login validation.
- **Drizzle ORM + PostgreSQL (Neon)** — schema in `src/db/schema.ts` (users, orders, orderItems, products).
- **Auth.js (NextAuth v5 beta)** — credentials provider, bcrypt hashing, admin/customer roles.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (49 pages)
npm start            # serve production build
```

## Environment

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://...neon.tech/ghaith_asalaf?sslmode=require"
AUTH_SECRET="long-random-string"
AUTH_TRUST_HOST=true
ADMIN_EMAIL="admin@ghaith.dz"       # fallback admin login when no DATABASE_URL
ADMIN_PASSWORD="min-8-chars"
```

- Without `DATABASE_URL` the site still works: orders are acknowledged (demo mode) and the admin panel shows demo data; tracking works from the visitor's browser via localStorage.
- With `DATABASE_URL`: run `npm run db:push` to create tables, then orders persist and tracking queries the database.

## Admin panel

- `/admin` — dashboard (overview stats, orders management with status updates/delete, products list, settings). Requires an admin-role session; redirects to `/admin/login` otherwise.
- Create a real admin once the database is connected:

```bash
npm run admin:create -- "Full Name" "email@example.com" "password"
```

## Order tracking

- `/track` — visitors enter their order reference (e.g. `GA-2026-00001`) and see a status timeline (pending → confirmed → shipped / cancelled).
- Placed orders are saved to the browser (`localStorage`, key `ghaith-orders`) and offered as quick-search chips.

## Directory structure

```
src/
  app/            # pages: /, /books, /book/[slug], /cart, /login, /track, /admin + api/orders, api/admin/orders, api/auth
  components/     # header, footer (DESIGNED BY K.Haithem), carousel, books, cart, admin, forms...
  db/             # drizzle schema + neon client
  lib/            # books data (37 products), categories, wilayas (58), cart context, utils
public/
  logo.jpg        # site logo
  books/          # product images (from the كتب folder, optimized ~1200px)
```

## Store info
- Phone: 0555786250
- Instagram: @maktabat_ghaith_asalaf
- Facebook: page id 61579025134277

---
DESIGNED BY **K.Haithem** — https://www.instagram.com/abdelkader_haith/
