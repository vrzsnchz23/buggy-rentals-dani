import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.adminUser.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/en/dashboard/login",
    error: "/en/dashboard/login",
  },
  // JWT for credentials (admin), database for OAuth (customers)
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.email) {
        const admin = await db.adminUser.findUnique({ where: { email: user.email } });
        token.isAdmin = !!admin;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin = token.isAdmin;
        (session.user as any).id = token.userId ?? token.sub;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Link existing bookings by email when user first signs in
        if (user?.email && user?.id) {
          await db.booking.updateMany({
            where: { guestEmail: user.email, userId: null },
            data: { userId: user.id },
          }).catch(() => {});
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
