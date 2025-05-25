import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "@/lib/db"
import { getAdminByEmail } from "./actions/usersActions/getAdminByEmail"
import { PrismaAdapter } from '@auth/prisma-adapter'
import {Adapter} from 'next-auth/adapters'

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: <Adapter> PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 5 * 24 * 60 * 60, // 5 days
    },
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account,email }) {
            if (account?.provider !== 'credentials') {

                if (!user.email) {
                    return false
                }

                // Find existing user by email
                const existingUser = await db.user.findUnique({
                    where: { email: user.email }
                })



                if (existingUser) {

                    await db.account.upsert({
                        where: {
                            provider_providerAccountId: {
                                provider: account?.provider as string,
                                providerAccountId: account?.providerAccountId as string,
                            }
                        },
                        update: {
                            userId: existingUser.id,
                            access_token: account?.access_token ?? null,
                            refresh_token: account?.refresh_token ?? null,
                            // ...other fields
                        },
                        create: {
                            userId: existingUser.id,
                            provider: account?.provider as string, // <-- Add this line!
                            providerAccountId: account?.providerAccountId as string,
                            type: account?.type as string,
                            access_token: account?.access_token ?? null,
                            refresh_token: account?.refresh_token ?? null,
                            // ...other fields
                        }
                    })
                    return true
                }

                //if new user then let them sign up
                return true
            }

            // Credentials login: check emailVerified
            const existingUser = await getAdminByEmail(user.email as string)
            if (!existingUser?.emailVerified && existingUser?.role === 'ADMIN') return false

            return true
        }

    },
})
