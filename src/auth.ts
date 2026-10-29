import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        if (!process.env.DATABASE_URL) {
          const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
          const adminPassword = process.env.ADMIN_PASSWORD ?? "";
          if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
            return {
              id: "admin-env",
              name: process.env.ADMIN_NAME ?? "المدير",
              email: adminEmail,
              image: null,
              role: "admin",
            } as { id: string; name: string; email: string; image: null; role: string };
          }
          return null;
        }

        try {
          const { magaz, users } = await import("@/db/index");
          const { eq } = await import("drizzle-orm");
          const db = magaz();
          const rows = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
          const user = rows[0];
          if (!user) return null;
          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: null,
            role: user.role,
          } as { id: string; name: string; email: string; image: null; role: string };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
