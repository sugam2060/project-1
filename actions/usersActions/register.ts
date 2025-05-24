'use server'
import { registerSchema } from "@/schemas/registerSchema";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getAdminByEmail } from "./getAdminByEmail";
import { generateVerificationToken } from "@/lib/tokens";
import { getVerificationEmailHTML } from "@/data/emailVerificationMailHTML";
import { sendMail } from "@/lib/sendMail";

export const registerNewUser = async (values: z.infer<typeof registerSchema>) => {
    const validated = registerSchema.safeParse(values)
    if (!validated.success) {
        return { error: 'Invalid Fields' }
    }

    const { name, email, password,private_key } = validated.data

    const existingUser = await getAdminByEmail(email)

    if (existingUser && existingUser.emailVerified) {
        return { error: 'User already exists' }
    }

    const adminBuffer = await db.adminBuffer.findFirst({
        where: {
            email:email
        }
    })

    if(adminBuffer?.private_key !== private_key){
        return { error: 'Invalid private key' }
    }else{
        await db.adminBuffer.delete({
            where:{
                private_key:private_key
            }
        })
    }

    const verificationToken = await generateVerificationToken(email)

    if (existingUser && !existingUser.emailVerified) {
        const link = `${process.env.NEXTAPP_URI}/verify?token=${verificationToken.token}`
        const html = getVerificationEmailHTML(link)
        const mailStatus = await sendMail({ to: email, subject: 'Verify your email', html })
        if(!mailStatus.success){
            return {error:mailStatus.error}
        }
        return { success: 'Confirmation email sent!' }
    }

    const hashed = await bcrypt.hash(password, 10)
    try {
        const newUser = await db.user.create({
            data: {
                fullname: name,
                email: email,
                password: hashed,
            }
        })

        const link = `${process.env.NEXTAPP_URI}/verify?token=${verificationToken.token}`
        const html = getVerificationEmailHTML(link)
        const mailStatus = await sendMail({ to: email, subject: 'Verify your email', html })
        if(!mailStatus.success){
            return {error:mailStatus.error}
        }
        return { success: 'Confirmation email sent!' }
    } catch (error) {
        console.log('register Error: ', error)
        return { error: 'Something went wrong' }
    }

}