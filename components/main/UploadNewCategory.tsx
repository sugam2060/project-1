'use client'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CardContent, CardFooter } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { categorySchema } from '@/schemas/categorySchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadCategory } from '@/actions/productActions/UploadCategory'


const UploadNewCategory = () => {
    const [formSuccess, setFormSuccess] = React.useState<string>('')
    const [formError, setFormError] = React.useState<string>('')
    const [isPending, setTransition] = useTransition()

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            title: '',
        }
    })

    const onSubmit = form.handleSubmit(async (data) => {
  // you will only get here if Zod passes
  try {
    setFormError('')
    setFormSuccess('')
    setTransition(async () => {
      uploadCategory(data.title).then((res) => {
        setFormError(res?.error || '')
        setFormSuccess(res?.success || '')
      })
      setFormSuccess('Category created 🎉')
      form.reset()
    })
  } catch (e) {
    setFormError('Something went wrong')
    console.log(e)
  }
})


    return (
        <Form {...form}>
            <form onSubmit={onSubmit}>
                <CardContent className='space-y-4'>
                    {/* name */}
                    <FormField control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-semibold mt-2'>CategoryTitle</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder='category title' {...field} className='font-semibold' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
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

export default UploadNewCategory