"use server"

import * as z from "zod"
import { NewPasswordSchema } from "@/zod-schemas"
import { getPasswordTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token: string | null) => {
    
try {
    console.log("new password reet function called")
    const validatedField = NewPasswordSchema.safeParse(values)

if(!validatedField.success){
    return {error: "Password error"}
}

if(!token){
    return {error: "invalid token"}
}
const {password} = validatedField.data

const existingToken = await getPasswordTokenByToken(token)

if(!existingToken){
    return {error: "Invalid token"}
}
const hasExpired = new Date(existingToken.expires) < new Date()

if(hasExpired){
    return {error: "Token has expired"}
}

const existingUser = await  getUserByEmail(existingToken.email)
console.log("user object is ", existingUser)

if(!existingUser){
    return {error: "Email does not exist"}
}

const hassedPassword = await bcrypt.hash(password, 10)

await db.user.update({
    where: {id: existingUser.id},
    data: {
        password: hassedPassword
    }
})

await db.passwordResetToken.delete({
    where: {id: existingToken.id}
})

return {success: "Password changed successfully"}
} catch (error) {
    console.log("An error occured while resetting your password")
    return {error: "An error occured while resetting your password"}
}
}

export default newPassword