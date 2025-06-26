import { db } from "@/lib/db";

export const  getPasswordTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {token}
        })
        return passwordResetToken
    }
     catch (error) {
        console.log("there was an error finding token associated with this passwprd")
        return null
    }
}

export const  getPasswordTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: {email}
        })
        return passwordResetToken
    }
     catch (error) {
        return null
    }
}