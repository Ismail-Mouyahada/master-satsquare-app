import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/db/prisma";

// Define auth options
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password || !credentials?.email) {
          return null;
        }

        const user = await prisma.utilisateur.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (user && await bcrypt.compare(credentials.password, user.mot_de_passe)) {
          return user;
        }

        return null;
      },
    }),
  ],
};
