import NextAuth, {
  Session,
  NextAuthConfig,
  User as NextAuthUser,
  Account,
  Profile,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { DefaultJWT, JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { z } from "zod";

import { LoginSchema } from "./schemas";
import User from "./models/user";
import conn from "./lib/db";

export const config: NextAuthConfig = {
  callbacks: {
    async signIn({ user, account }) {
      try {
        // apply to users signing in with Oauth
        if (account?.provider) {
          await conn();
          const existingUser = await User.findOne({ email: user.email });
          // console.log("provider credentials ", account);
          // This runs for Google sign-ins
          if (!existingUser) {
            // Create new user record
            await User.create({
              email: user.email,
              name: user.name,
              role: "user",
              emailVerified: new Date(),
              provider: account?.provider,
            });
          } else {
            user.role = existingUser.role;
            user.emailVerified = existingUser.emailVerified;
            user.provider = account.provider || existingUser.provider;
          }
        } else {
          const existingUser = await User.findOne({ email: user.email });
          if (existingUser && !existingUser.provider) {
            existingUser.provider = "credentials";
            await existingUser.save();
          }
        }
        // console.log("user in signin ", user);
        return true;
      } catch (error) {
        console.log("there is an error in the sign in callback", error);
        return false;
      }
    },

    // >>>>>>>>>>>>> JWT <<<<<<<<<<<<<<<<
    async jwt({
      token,
      user,
      account,
      profile,
      trigger,
      isNewUser,
      session,
    }: {
      token: DefaultJWT;
      user?: NextAuthUser | AdapterUser;
      account?: Account | null;
      profile?: Profile;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: any;
    }): Promise<JWT> {
      console.log("token: ", user);
      if (!token.sub) return token;

      if (user) {
        token.role = user.role;
        token.provider = user.provider;
        token.emailVerified = user.emailVerified;
      }

      return token;
    },

    async session({ token, session }: { token: JWT; session: Session }) {
      console.log("sessionew session ", token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
        session.user.provider = token.provider as string;
      }
      // console.log("user in session ", session.user);
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",

      // signIn function triggers this function
      async authorize(credential) {
        try {
          const validateFields = await LoginSchema.parseAsync(credential);
          const { email, password } = validateFields;

          await conn();
          const user = await User.findOne({ email });
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error("Zod error");
          }
        }
      },
    }),
  ],
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
