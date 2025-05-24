import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

export type UserRole = "ADMIN" | "USER"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      fullname: string | null
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    fullname: string | null
    role: UserRole
    emailVerified?: Date | null
    password?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    fullname: string | null
    email: string | null
    role: UserRole
  }
}
