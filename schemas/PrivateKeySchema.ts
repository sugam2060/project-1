import {z} from 'zod'

export const privateKeySchema = z.object({
    name:z.string().min(1,{message:'This field is required'}),
    email:z.string().email({message:'Enter a valid email'}),
    private_key:z.string().min(1,{message:'This field is required'})
})