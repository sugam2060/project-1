import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "@/schemas/LoginSchema"
import { getAdminByEmail } from "@/actions/usersActions/getAdminByEmail"
import bcrypt from "bcryptjs"

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) return null

        const { email, password } = validated.data
        const user = await getAdminByEmail(email)

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.fullname,
          email: user.email,
          // ✅ These fields must match what's in `next-auth.d.ts`
          fullname: user.fullname,
          role: user.role,
          emailVerified: user.emailVerified ?? null,
        }
      },
    }),
  ],
}

export default authConfig
