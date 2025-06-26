"use server";

import { ResetSchema } from "@/zod-schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/token";
import * as z from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";

const resetAction = async (values: z.infer<typeof ResetSchema>) => {
  try {
    const validateFields = ResetSchema.safeParse(values);

    if (!validateFields.success) {
      return { error: "invalid fields" };
    }

    const { email } = validateFields.data;
    // console.log(email);

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "User does'nt exist" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return { success: "Reset email sent" };
  } catch (error) {
    console.log("An error occured here", error);
    return { error: "Couldn't reset email" };
  }
};

export default resetAction;
