'use client'
import { fetchCategories } from '@/actions/productActions/LoadCategories'
import React, { useEffect, useState } from 'react'
import {ControllerRenderProps} from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { z } from 'zod'
import { ProductFieldsSchema } from '@/schemas/ProductUploadSchema'

type productUploadType = z.infer<typeof ProductFieldsSchema>
interface props {
    field:ControllerRenderProps<productUploadType,'category'>
}

const ProductCategory = ({field}:props) => {
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
    )
}

export default ProductCategory