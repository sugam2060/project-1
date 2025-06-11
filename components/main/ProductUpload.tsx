'use client'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { ProductFieldsSchema } from '@/schemas/ProductUploadSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CardContent, CardFooter } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { generateSlug } from '@/lib/generateSlug'
import { uploadProductsRemote } from '@/actions/productActions/uploadProducts'
import { Loader2 } from 'lucide-react'
import ProductCategory from './ProductCategory'
import { useQueryClient } from '@tanstack/react-query'



const ProductUpload = () => {
    const [formSuccess, setFormSuccess] = React.useState<string>('')
    const [formError, setFormError] = React.useState<string>('')
    const [isPending, setTransition] = useTransition()
    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof ProductFieldsSchema>>({
        resolver: zodResolver(ProductFieldsSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '1',
            category: '',
            image: [],
            slug: '',
            stock: '1',
            discount: '0',
            brand: 'Kalika kasta furniture udyog',
        },
    })

    const onSubmit = (data: z.infer<typeof ProductFieldsSchema>) => {
        setFormError('')
        setFormSuccess('')
        setTransition(() => {
            uploadProductsRemote(data).then((res) => {
                queryClient.invalidateQueries({
                    queryKey:['products'],
                    exact:false
                })
                setFormError(res?.error || '')
                setFormSuccess(res?.success || '')
            })
        })
    }

    const slugGenerator = () => {
        const slug = generateSlug(form.getValues('name'), form.getValues('description'));
        form.setValue('slug', slug);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className='space-y-4'>
                    {/* name */}
                    <FormField control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder='product name' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* description */}
                    <FormField control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder='product description' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input min={0} disabled={isPending} type='number' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control}
                        name='discount'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount</FormLabel>
                                <FormControl>
                                    <Input min={0} disabled={isPending} type='number' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ProductCategory form={form} isPending={isPending} />
                    <FormField control={form.control}
                        name='slug'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <div className='flex items-center gap-2'>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder='auto-generated-slug' readOnly {...field} className='font-semibold' />
                                    </FormControl>
                                    <Button type='button' className='bg-gray-300 text-black px-1 hover:bg-gray-400 cursor-pointer' onClick={() => slugGenerator()}>Generate</Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control}
                        name='stock'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>stock</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type='number' placeholder='Stock' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control}
                        name='brand'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder='Stock' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => {
                            const { onChange, onBlur, name, ref } = field;
                            return (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
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
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </CardContent>
                {formError && (<div className='mx-3 py-1 mt-2 rounded-md bg-red-500/90 text-black font-semibold text-center px-2 space-y-1'>{formError}</div>)}
                {formSuccess && (<div className='mx-3 py-1 mt-2 rounded-md bg-green-500/90 text-center font-semibold  px-2'>{formSuccess}</div>)}
                <CardFooter>
                    <Button disabled={isPending} type="submit" className="w-full cursor-pointer my-2 relative">
                        Upload Product
                        {isPending && <Loader2 className='absolute right-8 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin' />}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    )
}

export default ProductUpload