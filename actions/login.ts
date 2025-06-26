"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/zod-schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "invalid fields" };
  }
  const { email, password } = validateFields.data;

  // CHECKS THE USER IN THE DB TO BE SURE THEIR EMAIL IS VERIFIED
  // THIS ONLY RUNS FOR USERS TRYING TO SIGN IN WITH CREDENTIALS
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "User doesn't exist" };
  }
  if (!existingUser.password) {
    return { error: "Please sign in with Google/GitHub" };
  }

  // GENERATE VERIFICATION TOKEN AND SEND TOKEN VIA MAIL IF EMAIL IS NOT VERIFIED
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser?.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent" };
  }

  // ALLOW SIGN IN IF USER EMAIL IS VERIFIED OR SIGNS IN WITH OAUTH PROVIDERS
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "login successful" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "sign in error" };
      }
    }
    throw error;
  }
};
