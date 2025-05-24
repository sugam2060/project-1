'use client'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { registerSchema } from '@/schemas/registerSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '../ui/input'
import { CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { registerNewUser } from '@/actions/usersActions/register'



const RegisterForm = () => {

  const [formError, setError] = useState('')
  const [formSuccess, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      private_key: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setError('')
    setSuccess('')
    startTransition(() => {
      registerNewUser(values).then((data) => {
        setError(data?.error || '')
        setSuccess(data?.success || '')
        form.reset()
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" disabled={isPending} {...field} className='font-semibold' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" disabled={isPending} placeholder="you@example.com" {...field} className='font-semibold' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isPending} placeholder="********" {...field} className='font-semibold' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isPending} placeholder="Re-enter password" {...field} className='font-semibold' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Private key */}
          <FormField
            control={form.control}
            name='private_key'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Private Key</FormLabel>
                <FormControl>
                  <Input placeholder="private key" type='text' disabled={isPending} {...field} className='font-semibold' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        {formError && <div className='bg-red-200 mx-10 flex items-center justify-center mt-2 rounded-md py-1'>
          <p>{formError}</p>
        </div>}
        {formSuccess && <div className='bg-green-200 mx-10 flex items-center justify-center mt-2 rounded-md py-1'>
          <p>{formSuccess}</p>
        </div>}
        <CardFooter className="flex justify-between mt-2">
          <Button disabled={isPending} type="submit" className="w-full cursor-pointer">{isPending ? 'Creating Account': 'Create Account'}</Button>
        </CardFooter>
      </form>
    </Form>
  )
}

export default RegisterForm