'use server'
import bcrypt from "bcryptjs"

export const compare = async (password:string,userPassword:string) => {
    return await bcrypt.compare(password,userPassword)
}