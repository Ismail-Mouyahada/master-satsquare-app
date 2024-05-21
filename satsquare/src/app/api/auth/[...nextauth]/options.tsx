import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/db/connect";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.password || !credentials?.email) {
          return null;
        }

        const user = await prisma.utilisateur.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.mot_de_passe))
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
};