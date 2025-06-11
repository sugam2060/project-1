'use client'

import React, { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import {  productUpdateSchema } from '@/schemas/ProductUploadSchema'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchRawCategories } from '@/actions/productActions/FetchCategories'

type productUpdateType = z.infer<typeof productUpdateSchema>


interface Props {
  form: UseFormReturn<productUpdateType> 
  isPending: boolean
}

interface Categories {
  id: string,
  title:string
}

const CategoryChoosing = ({ form, isPending }: Props) => {
  const [categories, setCategories] = React.useState<Array<Categories>>([])
  useEffect(() => {
    const fetchcategories = async () => {
      const categories = await fetchRawCategories()
      if(categories){
        setCategories(categories)
      }
    }
    fetchcategories()
  },[])

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            disabled={isPending}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ScrollArea className="h-48 w-full">
                {categories.map((item, idx) => (
                  <SelectItem
                    key={idx}
                    value={item.title}
                    className="capitalize"
                  >
                    {item.title}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CategoryChoosing
