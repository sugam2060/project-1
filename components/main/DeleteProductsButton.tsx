import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { z } from 'zod';
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema';

interface DeleteProductsButtonProps {
  product: z.infer<typeof ProductFieldFetchsSchema>;
  className?: string;
}

const DeleteProductsButton = ({product,className}: DeleteProductsButtonProps) => {
  return (
    <Button className={cn('',className)}>
        {JSON.stringify(product)}
    </Button>
  )
}

export default DeleteProductsButton