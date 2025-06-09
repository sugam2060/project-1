'use server'
import { getPrivateKeyEmailHTML } from "@/data/privateKeySendEmailHTML";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import { privateKeySchema } from "@/schemas/PrivateKeySchema";

interface props {
    name: string,
    email: string,
    private_key: string
}
export const sendInviteToEmployee = async ({ name, email, private_key }: props) => {
    const validate = privateKeySchema.safeParse({ name, email, private_key })
    if (!validate) return { error: 'Invalid Fields' }

    try {
        const isUserExist = await db.user.findUnique({
            where: {
                email: email
            }
        })
        if (isUserExist) return { error: 'User already exist' }


        await db.adminBuffer.create({
            data: {
                fullname: name,
                email: email,
                private_key: private_key
            }
        })


        const cred = {
            to: email,
            subject: 'Private Key to create new Account',
            html: getPrivateKeyEmailHTML({
                fullName: name,
                privateKey: private_key,
                loginUrl: `${process.env.NEXTAPP_URI}/auth/register`
            }),
            text: 'Private key for Account creation'
        }
        await sendMail(cred)
        return { success: 'Private key has been sent to the user' }
    } catch (error) {
        console.log('Error sending private key', error)
        return { error: 'some thing went wrong' }
    }
}