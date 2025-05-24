import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getAdminByEmail } from "./actions/usersActions/getAdminByEmail"
 
export const { handlers:{GET,POST}, signIn, signOut, auth } = NextAuth({
     ...authConfig,
    session:{
        strategy:'jwt',
        maxAge:5 * 24 * 60 * 60, // 5 days in seconds
    },
    callbacks:{
        async session({token,session}){
            if(token && session.user){
                session.user.role = token.role as 'USER' | 'ADMIN'
                session.user.fullname = token.fullname as string
            }
            return session
        },
        async jwt({token,user,account}){

            if(account && user){
                if(account.provider === 'google'){
                    return {
                        ...token,
                        role:'USER'
                    }
                }

                if(account.provider === 'credentials'){
                    return {
                        ...token,
                        role:'ADMIN',
                        fullname:user.fullname 
                    }
                }

            }
            return token
        },
        async signIn({user,account}){
            if(account?.provider !== 'credentials'){
                if(user){
                    const userExist = await db.account.findFirst({
                        where:{
                            email:user.email
                        }
                    })
                    if(userExist){
                        return true
                    }else{
                        await db.account.create({
                            data:{
                                email:user.email,
                                name:user.name,
                                image:user.image,
                                provider:account?.provider
                            }
                        })
                    }
                }
                return true
            }

            const existingUser = await getAdminByEmail(user.email as string)

            if(!existingUser?.emailVerified) return false 

            return true
            
        }
    },
    pages:{
        // signIn:'/auth/login',
    },
    // adapter:PrismaAdapter(db),
    secret:process.env.AUTH_SECRET
})