'use client'
import Image from 'next/image'
import React, { useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { uploadAndConvertHomeCaroselImages } from '@/actions/productActions/ManageHomeCarosel'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, } from '../ui/form'
import { CardContent, CardFooter } from '../ui/card'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { getCaroselImages } from '@/actions/productActions/getHomeCarosel'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteHomeCarouselImage } from '@/actions/productActions/removeHomeCaroselImage'

export const caroselSchama = z.object({
    images: z.array(z.instanceof(File)).min(1, { message: 'At least 1 image is required' }).max(5, { message: 'Only 5 images are allowded' }),
})
const HomeCaroselMgmt = () => {
    const [isPending, setTransition] = useTransition()
    const [formError, setFormError] = useState<string>('')
    const [formSuccess, setFormSuccess] = useState<string>('')

    const queryClient = useQueryClient()

  // ✅ Use React Query to fetch carousel images
  const { data: images = [], /*isLoading*/ } = useQuery({
    queryKey: ['home-carousel-images'],
    queryFn: getCaroselImages,
  })

    const form = useForm<z.infer<typeof caroselSchama>>({
        resolver: zodResolver(caroselSchama),
        defaultValues: {
            images: [],
        }
    })

    const onSubmit = form.handleSubmit(async (data) => {
        setFormError('')
        setFormSuccess('')
        setTransition(() => {
            console.log(data)
            uploadAndConvertHomeCaroselImages(data).then((res) => {
                setFormError(res?.error || '')
                setFormSuccess(res?.success || '')
                queryClient.invalidateQueries({queryKey:['home-carousel-images']})
            })
        })
    })

    const removeHomeCaroselImage = async (imageName:string) => {
        console.log(imageName)
        await deleteHomeCarouselImage(imageName)
        queryClient.invalidateQueries({queryKey:['home-carousel-images']})
    }



    return (
        <div className=''>
            <Form {...form}>
                <form onSubmit={onSubmit}>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name='images'
                            render={({ field }) => {
                                const { onChange, onBlur, name, ref } = field
                                return (
                                    <FormItem>
                                        <FormLabel className='font-semibold text-base capitalize'>upload Images</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                multiple
                                                placeholder="Stock"
                                                className="font-semibold"
                                                name={name}
                                                onBlur={onBlur}
                                                onChange={(e) => {
                                                    const files = e.target.files ? Array.from(e.target.files) : [];
                                                    onChange(files);
                                                }}
                                                disabled={isPending}
                                                accept="image/*"
                                                ref={ref}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )
                            }}
                        />
                    </CardContent>
                    {formError && (<div className='mx-3 py-1 mt-2 rounded-md bg-red-500/90 text-black font-semibold text-center px-2 space-y-1'>{formError}</div>)}
                    {formSuccess && (<div className='mx-3 py-1 mt-2 rounded-md bg-green-500/90 text-center font-semibold  px-2'>{formSuccess}</div>)}
                    <CardFooter>
                        <Button disabled={isPending} type="submit" className="w-full cursor-pointer my-2 relative">
                            Upload
                            {isPending && <Loader2 className='absolute right-8 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin' />}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
            <hr className='border-black' />

            {/* Uploaded Image Display area */}
            <div className='max-h-[210px] min-h-[210px] overflow-auto'>
                {images.map((image,idx) => (
                    <div key={idx} className='flex items-center justify-between p-2'>
                        <Image src={image} width={100} height={100} alt='carosel' className='max-h-[50px] object-cover'/>
                        <Button type='button' variant={'destructive'} onClick={() => removeHomeCaroselImage(image)}>Remove</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomeCaroselMgmt