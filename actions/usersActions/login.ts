'use server'
import { signIn } from "@/auth";
import { loginSchema } from "@/schemas/LoginSchema";
import { AuthError } from "next-auth";
import {z} from "zod";
import { getAdminByEmail } from "./getAdminByEmail";
import { generateVerificationToken } from "@/lib/tokens";
import {getVerificationEmailHTML} from '@/data/emailVerificationMailHTML'
import { sendMail } from "@/lib/sendMail";

export const login = async (data: z.infer<typeof loginSchema>) => {
    const validated = loginSchema.safeParse(data)
    if (!validated.success) {
        return {error:'Invalid Fields'}
    }

    const {email,password} = validated.data

    const existingUser = await getAdminByEmail(email)  // Fetch the user by email

    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error:'User does not exist'}
    }

    if(!existingUser.emailVerified ){
        const verificationToken =  await generateVerificationToken(email)
        const link = `${process.env.NEXTAPP_URI}/verify?token=${verificationToken.token}`
        const html = getVerificationEmailHTML(link)
        const mailStatus = await sendMail({to:email,subject:'Verify your email',html})
        if(!mailStatus.success){
            return {error:mailStatus.error}
        }
        return {success:'Confirmation email sent!'}
    }
    try {
        await signIn('credentials',
            {
                email,
                password,
                redirectTo:'/admin'
            }
        )
        return {success:''}
    } catch (error) {
        if(error instanceof AuthError){
           switch(error.name){
            case 'CredentialsSignin':
                return {error: 'Invalid credentials'}
                break
            default:
                return {error: 'Something went wrong'}
           }
        }
        throw error
   }
};
