import {v4 as uuidv4} from 'uuid'
import {getVerificationTokenByEmail} from "@/data/getVerificationToken"
import { db } from './db'

export const generateVerificationToken = async (email:string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour
    
    const existingTokens = await getVerificationTokenByEmail(email)
    if(existingTokens) {
        await db.verificationToken.delete({
            where:{
                id: existingTokens.id
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data:{
            email,
            token,
            expires
        }
    })
    return verificationToken
}