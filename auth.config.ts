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
          name: user.name,
          email: user.email,
          fullname: user.name,
          role: user.role,
          emailVerified: user.emailVerified ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email ?? null,
          role: account.provider === 'credentials' ? 'ADMIN' : 'USER',
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.role = token.role as 'USER' | 'ADMIN'
        session.user.email = token.email as string ?? null
      }
      return session
    }

  },

  session: {
    strategy: "jwt",
    maxAge: 5 * 24 * 60 * 60, // 5 days
  },
  secret: process.env.AUTH_SECRET,
}

export default authConfig
