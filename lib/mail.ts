"use server"

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


// THIS FUNCTION USES RESEND TO SEND OUT EMAIL TO ASSOCIATED EMAILS
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm Your Email",
      html: `<p> Click <a href="${confirmLink}"> here </a> to verify your email </p>`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
};

// SEND PASSWORD RESET EMAIL
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Passwprd",
      html: `<p> Click <a href="${resetLink}"> here </a> to reset your password </p>`,
    });

    console.log("reset password email sent successfullly")
  } catch (error) {
    console.error("Failed to send password reset link:", error);
    throw error;
  }
};

// SEND TWO FACTOR CODE
export const sendTwoFactorEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Two Factor Authentication Code",
      html: `<p> Here is your 2FA code: <strong>${token}</strong> </p>`,
    });
  } catch (error) {
    console.error("Failed to send 2FA code:", error);
    throw error;
  }

}
