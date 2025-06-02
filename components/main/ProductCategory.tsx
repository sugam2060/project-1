'use client'
import { fetchCategories } from '@/actions/productActions/LoadCategories'
import React, { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { z } from 'zod'
import { ProductFieldsSchema } from '@/schemas/ProductUploadSchema'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'

type productUploadType = z.infer<typeof ProductFieldsSchema>
interface props {
    form: UseFormReturn<productUploadType>,
    isPending: boolean
}

const ProductCategory = ({form,isPending}:props) => {
    const [categories, setCategories] = useState<Array<{ category: string }>>([])

    useEffect(() => {
        const fetchCat = async () => {
            const cat = await fetchCategories()
            if (!cat) return
            setCategories(cat)
        }
        fetchCat()
    }, [])

    return (
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <DropdownMenu>
                        <DropdownMenuTrigger disabled={isPending} asChild>
                            <FormControl>
                                <button
                                    type="button"
                                    className="w-full rounded border px-3 py-2 text-left font-semibold"
                                >
                                    {field.value || 'Select category'}
                                </button>
                            </FormControl>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[220px] p-2">
                            <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="space-y-2"
                            >
                                {categories.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <RadioGroupItem value={item.category} id={item.category} />
                                        <Label htmlFor={item.category} className="capitalize">
                                            {item.category}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default ProductCategory