"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import conn from "@/lib/db";
import { signIn } from "@/auth";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  try {
    await conn();
    const validatedFields = await LoginSchema.parseAsync(values);
    
    const { email, password } = validatedFields;
    
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    return {success: "Login Successful"}
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Invalid details" };
      }
    }

    if (error instanceof z.ZodError) {
      console.log("Zod Error");
      return { error: "Invalid credentials" };
    }

    console.log(error)
  }
};
