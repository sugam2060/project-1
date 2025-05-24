'use server'
import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/getVerificationToken";
import { generateVerificationToken } from "@/lib/tokens";

export const verifyEmail = async (token: string) => {
    const verificationToken = await getVerificationTokenByToken(token)

    if (!verificationToken) return {error:'Invalid token'}

    if(verificationToken.expires < new Date()) {
        const newToken = generateVerificationToken(verificationToken.email)
        //send newToken to user email as link like http://localhost:3000/verify?token=${newToken.token}
        return {success:'Your link has been expired. We have sent you a new link' }
    }

    if (verificationToken.token !== token) return {error:'Invalid token'}

    try {
        await db.verificationToken.delete({
            where:{
                token
            }
        })
        await db.user.update({
            where: { email: verificationToken.email },
            data: {
                emailVerified: new Date()
            }
        })
        return {success:'Email verified!'}
    } 
    catch (error) {
        return {error:'Error verifying email'}
    }
}