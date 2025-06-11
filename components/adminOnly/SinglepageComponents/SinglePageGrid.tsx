'use client'

import { useTransition } from 'react'
import ImageArray from './ImageArray'
import ProductContentComponent from './ProductContentEditableForm'
import { fetchSingleProduct } from '@/actions/productActions/FetchBySlug'
import { updateProduct } from '@/actions/productActions/UpdateProduct'
import {
  productUpdateSchema,
  ProductFieldFetchsSchema,
} from '@/schemas/ProductUploadSchema'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Product = z.infer<typeof ProductFieldFetchsSchema>
type FormData = z.infer<typeof productUpdateSchema>

const getDefaults = (p: Product | null): FormData => ({
  id: p?.id || '',
  name: p?.name || '',
  description: p?.description || '',
  price: p?.price?.toString() || '',
  category: p?.category || '',
  discount: p?.discount?.toString() || '',
  image: [],
  imageUrls:
    p?.images?.map((i) => ({ id: i.id, imageUrl: i.imageUrl })) || [],
  slug: p?.slug || '',
  stock: p?.stock?.toString() || '',
  brand: p?.brand || '',
})

const SinglePageGrid = ({ slug }: { slug: string }) => {
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: getDefaults(null),
  })
  const { reset } = form
  const queryClient = useQueryClient()

  /* fetch product */
  useQuery({
    queryKey: ['fetch-editable-singlepage', slug],
    queryFn: async () => {
      const product = await fetchSingleProduct(slug)
      reset(getDefaults(product as Product))
      return product
    },
    staleTime: 2 * 60 * 1000,
  })

  /* submit updated product */
  const submit = form.handleSubmit((data) => {
    startTransition(async () => {
      await updateProduct(data)
      queryClient.invalidateQueries({
        queryKey: ['fetch-editable-singlepage', slug],
      })
      toast.success('Product updated successfully')
    })
  })

  return (
    <FormProvider {...form}>
      {/* floating action button (FAB) */}
      <Button
        disabled={isPending}
        onClick={submit}
        className="
          fixed z-50 flex gap-2
          right-4 bottom-4
          md:bottom-auto md:top-24 md:right-8
          bg-blue-500/90 text-black hover:bg-green-600 hover:text-white"
      >
        Update
        {isPending && <Loader2 className="animate-spin" />}
      </Button>

      {/* main content area */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2">
          <ImageArray />
          <ProductContentComponent />
        </div>
      </div>
    </FormProvider>
  )
}

export default SinglePageGrid
