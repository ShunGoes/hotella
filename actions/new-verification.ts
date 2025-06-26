"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {

    // SEARCH THE TOKEN TABLE FOR A MATCH
  const existingToken = await getVerificationTokenByToken(token);
  
  if (!existingToken) {
    return { error: " Cannot verify your email" };
  }

//   CHECK IF THE TOKEN HAS EXPIRED
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

//   CHECK IF THE TOKEN EXIST FOR A REGISTERED USER
  const existingEmail = await getUserByEmail(existingToken.email);

  if (!existingEmail) {
    return { error: "User could not be found" };
  }
  
//   UPDATE THE EMAILVERIFIED FIELD IN THE USER TABLE
  await db.user.update({
    where: { email: existingToken.email },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

//   DELETE THE TOKEN AFTER SUCCESFUL LOGIN
  await db.verificatontoken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email Verified" };
};
