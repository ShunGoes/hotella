import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { LoginSchema } from "./zod-schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs"

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(c) {
        try {
          const validateFields = LoginSchema.safeParse(c);

          if (validateFields.success) {
            const { email, password } = validateFields.data;

            const user = await getUserByEmail(email);

            if (!user || !user.password) return null;

            const passwordMatch = await bcrypt.compare(password, user.password);

            if(passwordMatch){
              return user;
            }
          }
          return null;
        } catch (error) {
          console.log(error);
          return null
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
