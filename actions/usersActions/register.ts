'use server'

import { registerSchema } from "@/schemas/registerSchema";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { getVerificationEmailHTML } from "@/data/emailVerificationMailHTML";
import { sendMail } from "@/lib/sendMail";

const StageMail = async (email: string) => {
  const verToken = await generateVerificationToken(email)
  const link = `${process.env.NEXTAPP_URI}/verify?token=${verToken.token}`
  const emailHTML = getVerificationEmailHTML(link)
  await sendMail({ to: email, subject: 'Verify your email', html: emailHTML })
  return { success:'Confirmation email sent!' }
}

export const registerNewUser = async (values: z.infer<typeof registerSchema>) => {
  const validated = registerSchema.safeParse(values)
  if (!validated.success) return { error:'Invalid Fields' }

  const { name, email, password, private_key } = validated.data
  const hashed = await bcrypt.hash(password, 10)

  const existingUser = await db.user.findUnique({ where: { email } })
  const key = await db.adminBuffer.findFirst({ where: { email } })

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      if (existingUser.emailVerified) {
        return { error: 'User already exists' }
      } else {
        const message = await StageMail(email)
        return message
      }
    } else {
      if (key?.private_key !== private_key) return { error: 'Invalid Private Key' }

      await db.user.update({
        where: { email },
        data: { name, password: hashed, role: 'ADMIN' }
      })

      await db.adminBuffer.delete({ where: { email, private_key } })

      const message = await StageMail(email)
      return message
    }
  } else {
    try {
      if (key?.private_key !== private_key) return { error: 'Invalid Private Key' }
      await db.user.create({
        data: { name, email, password: hashed, role: 'ADMIN' }
      })

      await db.adminBuffer.delete({ where: { email, private_key } })
      const message = await StageMail(email)
      return message
    } catch (error: any) {
      if (error.code === 'P2002') {
        return { error: 'User already exists' }
      }
      console.error('Registration error:', error)
      return { error: 'Error registering user' }
    }
  }
}
