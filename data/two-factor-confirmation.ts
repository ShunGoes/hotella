import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (id: string) => {
    try {
        const twoFactorTokenConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {userId: id}
        })
        return twoFactorTokenConfirmation
    } catch (error) {
        console.log("Two factor token not found", error)
        return null
    }
}


