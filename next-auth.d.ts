import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

export type UserRole = "ADMIN" | "USER"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      image: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    role: UserRole
    image: string | null
    emailVerified?: Date | null
    password?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    image:string | null
    email: string | null
    role: UserRole
  }
}
