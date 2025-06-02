import React from 'react'
import { Button } from '../ui/button'
import { z } from 'zod'
import { productUpdateSchema } from '@/schemas/ProductUploadSchema'
import { cn } from '@/lib/utils'

interface UpdateProductButtonProps {
    product:z.infer<typeof productUpdateSchema>
    className?:string
}
const UpdateProductButton = ({product,className}:UpdateProductButtonProps) => {
  return (
    <Button className={cn('',className)}>
        {JSON.stringify(product)}
    </Button>
  )
}

export default UpdateProductButton