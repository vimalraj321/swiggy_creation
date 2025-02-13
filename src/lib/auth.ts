// "use server";
import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const prisma = new PrismaClient();

          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            return null;
          }
          const users = await prisma.member.findMany();

          console.log(users);

          const user = await prisma.member.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            console.log("User not found or no password");
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            console.log("Password does not match");
            return null;
          }

          return {
            id: user.id,
            email: user.email || "",
            name: user.name || "",
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const {
  auth: middleware,
  handlers: { GET, POST },
} = NextAuth(authOptions);

export { middleware as auth, GET, POST };
