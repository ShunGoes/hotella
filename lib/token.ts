import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

import { getPasswordTokenByEmail } from "@/data/password-reset-token";

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordTokenByEmail(email);


  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

// THIS FUNCTION GENERATES TOKEN
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  // CHECKS IF A TOKEN EXIST FOR THIS EMAIL ADDRESS. IF YES, DELETE IT AND CREATE A NEW ONE
  if (existingToken) {
    await db.verificatontoken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificatontoken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
