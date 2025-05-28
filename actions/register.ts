"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSChema } from "@/schemas";
import User from "@/models/user";
import conn from "@/lib/db";
import {
  getExistingUser,
  isAdminEMail,
} from "@/lib/queryDatabse";

export const registerAction = async (
  values: z.infer<typeof RegisterSChema>
) => {
  try {
    await conn();
    const validatedFields = RegisterSChema.safeParse(values);
  
    if (!validatedFields.success) {
      console.log("could not validaate fields")
      return { error: "Invalid credentials" };
    }
  
    const { email, name, password } = validatedFields.data;
  
    const hasedPassword = await bcrypt.hash(password, 10);
  
    // check if a user alreaady exist
    const existingUser = await getExistingUser(email);
  
    // CHECK IF THE USER IS AN ADMIN USER
    const role = (await isAdminEMail(email)) ? "admin" : "user";
  
    if (existingUser) {
      console.log("Email already in use. Log in instead");
      return { error: "Email already in use. Log in instead" };
    }
  
    // Create new user
    const newUser = await User.create({
      email,
      name,
      password: hasedPassword,
      role,
      emailVerified: null,
    });

    if(!newUser){
      console.log("unable to create new user")
      return newUser
    }

    console.log(newUser);
    return { success: "User created successfully" };

  } catch (error) {
    console.log("failed to register user", error)
  }

};
