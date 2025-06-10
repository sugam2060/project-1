import {z} from 'zod'


export const caroselSchama = z.object({
    images: z.array(z.instanceof(File)).min(1, { message: 'At least 1 image is required' }).max(5, { message: 'Only 5 images are allowded' }),
})