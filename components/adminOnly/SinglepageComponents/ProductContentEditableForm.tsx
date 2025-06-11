'use client'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { productUpdateSchema } from '@/schemas/ProductUploadSchema'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ProductCategory from '@/components/adminOnly/SinglepageComponents/CategoryChoosing'
import { generateSlug } from '@/lib/generateSlug'
import Container from '@/components/main/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

type FormData = z.infer<typeof productUpdateSchema>

const ProductContentComponent = () => {
  const form = useFormContext<FormData>()
  const { getValues, setValue, handleSubmit } = form

  const onSubmit = (data: FormData) => {
    Object.entries(data).forEach(([key, val]) => {
      setValue(key as keyof FormData, val, { shouldDirty: true })
    })
  }

  const makeSlug = () => {
    const slug = generateSlug(getValues('name'), getValues('description'))
    setValue('slug', slug, { shouldDirty: true })
  }

  return (
    <Container className="max-w-3xl mx-auto py-6">
      <Card className="shadow-md border border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Update Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Price in ₹" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount */}
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0 - 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <ProductCategory form={form} isPending={false} />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                      <Button type="button" variant="secondary" onClick={makeSlug}>
                        Generate
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Available quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Samsung, Nike" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ProductContentComponent
