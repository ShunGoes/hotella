import crypto from "crypto"
import { v4 as uuidv4 } from "uuid";

import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";


// PASSWORD RESET TOKEN FUNCTION
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

// THIS FUNCTION GENERATES EMAIL VERIFICATION TOKEN
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

// GENERATE TWO FACTOR TOKEN
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(Date.now() + 3600 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken){
    await db.twoFactorToken.delete({
      where: {id: existingToken.id}
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return twoFactorToken
}
