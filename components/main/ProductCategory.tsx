'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { ProductFieldsSchema } from '@/schemas/ProductUploadSchema'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { ScrollArea } from '../ui/scroll-area'
import useCategoriesStore from '@/store/categoryStore'

type productUploadType = z.infer<typeof ProductFieldsSchema>

interface Props {
  form: UseFormReturn<productUploadType>
  isPending: boolean
}

const ProductCategory = ({ form, isPending }: Props) => {
  const categories = useCategoriesStore((state) => state.categories)


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
                    value={item.category}
                    className="capitalize"
                  >
                    {item.category}
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

export default ProductCategory
