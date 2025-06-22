'use client'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import React from 'react'
import { z } from 'zod'
import { Button } from '../ui/button'

type Product = z.infer<typeof ProductFieldFetchsSchema>

interface props {
  product:Product
}

const DeleteButton = ({product}:props) => {
  console.log(product)
  return (
    <Button className='w-full'>Delete</Button>
  )
}

export default DeleteButton