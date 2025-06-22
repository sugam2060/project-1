'use client'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import React, { useTransition } from 'react'
import { z } from 'zod'
import { Button } from '../ui/button'
import { deleteProduct } from '@/actions/productActions/DeleteProducts'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
type Product = z.infer<typeof ProductFieldFetchsSchema>

interface props {
  product:Product
}

const DeleteButton = ({product}:props) => {
  const queries = useQueryClient()
  const [isPending,setTransition] = useTransition()

  const handleDelete  = () => {
    setTransition(()=>{
      deleteProduct(product.id).then(async ()=>{
        await queries.invalidateQueries({queryKey:['products']})
      })
    })
  }

  return (
    <Button className='w-full' onClick={handleDelete}>
      <span>Delete</span>
      {isPending && <Loader2 className='animate-spin'/>}
    </Button>
  )
}

export default DeleteButton