"use server"

import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.verificatontoken.findFirst({
            where: {email}
        })

        return verificationToken
    } catch (error) {
        return null
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificatontoken.findUnique({
            where: {token}
        })

        return verificationToken
    } catch (error) {
        console.log(error)
        return null
    }
}