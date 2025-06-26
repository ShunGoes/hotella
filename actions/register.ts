"use server"

import { db } from "@/lib/db"
import { RegisterSChema } from "@/zod-schemas"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"

export  const registerAction = async (values:  z.infer<typeof RegisterSChema>) => {
    const validateFields = RegisterSChema.safeParse(values)

    if(!validateFields.success){
        return {error: "invalid fields"}
    }

    const {email, password, name} = validateFields.data

    const hasedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)
    if(existingUser){
        return {error: "Email already in use"}
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hasedPassword
        }
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)


    return {success: "Confirmation email sent"}
}