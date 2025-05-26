'use client'
import React, { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { CheckCircle, Mail } from "lucide-react"
import { Button } from '../ui/button'
import { loginSchema } from '@/schemas/LoginSchema'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { login } from '@/actions/usersActions/login'
import { FaExclamationTriangle } from 'react-icons/fa'
import Link from 'next/link'

const EmailLogin = ({ emailDialogOpen, setEmailDialogOpen }: { emailDialogOpen: boolean, setEmailDialogOpen: (x: boolean) => void }) => {

  const [formError, setError] = useState('')
  const [formSuccess, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (value: z.infer<typeof loginSchema>) => {
    setError('')
    setSuccess('')
    startTransition(() => {
      login(value).then((data) => {
        setError(data?.error || '')
        setSuccess(data?.success || '')
      })
    })
  }

  return (
    <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Login as Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">Admin Login</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">Sign in to access the admin dashboard</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="form-checkbox" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => {
                  setEmailDialogOpen(false);
                  // Trigger forgot password modal or route
                }}
              >
                Forgot password?
              </button>
            </div>

            {formError && (
              <div className="bg-destructive/15 p-2 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                <FaExclamationTriangle className="h-4 w-4" />
                <p>{formError}</p>
              </div>
            )}
            {formSuccess && (
              <div className="bg-green-400/80 p-2 rounded-md flex items-center gap-x-2 text-sm text-black">
                <CheckCircle className="h-4 w-4" />
                <p>{formSuccess}</p>
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="text-sm text-center mt-4">
          Don&apos;t have an account?
          <Link href={'/auth/register'}>
            <button
              type="button"
              className="text-primary hover:underline"
            >
              Create one
            </button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default EmailLogin