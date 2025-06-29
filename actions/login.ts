"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendVerificationEmail, sendPasswordResetEmail, sendTwoFactorEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/zod-schemas";
import { AuthError } from "next-auth";
import * as z from "zod";


export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
console.log(values)

  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "invalid fields" };
  }
  const { email, password, code } = validateFields.data;

  // CHECKS THE USER IN THE DB TO BE SURE THEIR EMAIL IS VERIFIED
  // THIS ONLY RUNS FOR USERS TRYING TO SIGN IN WITH CREDENTIALS
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Users doesn't exist" };
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

  if(existingUser.isTwoFactorEnabled && existingUser.email){
    if(code){
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if(!twoFactorToken){
        return {error: "Invalid code"}
      }

      if(twoFactorToken.token !== code){
        
        return {error: "Two Factor Auth codes don't match"}
      }


      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if(hasExpired){
        return {error: "Code has expired"}
      }

      await db.twoFactorToken.delete({
        where: {id: twoFactorToken.id}
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if(existingConfirmation){
        await db.twoFactorConfirmation.delete({
          where: {id: existingConfirmation.id}
        })
      }

      console.log(existingUser.id, )

       await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id
          }
        })
    } else{
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)
  
      return {twoFactor: true}
    }
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
