'use client'
import React, { useState, useTransition } from 'react'
import { Input } from '../ui/input'
import { privateKeySchema } from '@/schemas/PrivateKeySchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormMessage, FormItem, FormLabel, FormControl } from '../ui/form'
import { CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { generatePrivateKey } from '@/lib/generatePrivateKey'
import {sendInviteToEmployee} from '@/actions/usersActions/sendInvite'
import { Loader2 } from 'lucide-react'

const PrivateKeyDiv = () => {
    const [isPending, setTransition] = useTransition()
    const [formError, setFormError] = useState<string>('')
    const [formSuccess, setFormSuccess] = useState<string>('')

    const form = useForm<z.infer<typeof privateKeySchema>>({
        resolver: zodResolver(privateKeySchema),
        defaultValues: {
            name: '',
            email: '',
            private_key: ''
        }
    })


    const onSubmit = form.handleSubmit(async (data) => {
        setFormError('')
        setFormSuccess('')
        setTransition(() => {
            sendInviteToEmployee(data).then((res) => {
                setFormError(res?.error || '')
                setFormSuccess(res?.success || '')
            })
        })
    })


    const generateKey = () => {
        const key = generatePrivateKey()
        form.setValue('private_key', key)
    }

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-2'>
                <CardContent className='space-y-2'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold mt-2'>Fullname</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder='Full name' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold mt-2'>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder='Email' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='private_key'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold mt-2'>Private_Key</FormLabel>
                                <div className='flex items-center gap-2'>
                                    <FormControl>
                                    <Input disabled={isPending} placeholder='Private_key' readOnly {...field} className='font-semibold' />
                                </FormControl>
                                <Button type='button' onClick={generateKey}>Generate Key</Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                {formError && (<div className='mx-3 py-1 mt-2 rounded-md bg-red-500/90 text-black font-semibold text-center px-2 space-y-1'>{formError}</div>)}
                {formSuccess && (<div className='mx-3 py-1 mt-2 rounded-md bg-green-500/90 text-center font-semibold  px-2'>{formSuccess}</div>)}
                <CardFooter>
                    <Button disabled={isPending} type="submit" className="w-full cursor-pointer my-2 relative">
                        Create
                        {isPending && <Loader2 className='absolute right-8 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin' />}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    )
}

export default PrivateKeyDiv