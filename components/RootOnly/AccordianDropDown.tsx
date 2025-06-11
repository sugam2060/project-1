import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ProductFieldFetchsSchema } from "@/schemas/ProductUploadSchema"
import React from 'react'
import { z } from "zod"

type Product = z.infer<typeof ProductFieldFetchsSchema>

interface Props {
  product: Product
}

const AccordianDropDown = ({product}:Props) => {
  return (
    <Accordion type='single' collapsible className="w-full mt-0 mb-0 border-t-1" defaultValue='item-1'>
      <AccordionItem value="item-1">
        <AccordionTrigger className="w-full font-bold text-base">{product.name} :Characteristics</AccordionTrigger>
        <AccordionContent className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Brand</p>
            <p className="font-semibold">{product.brand}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Category</p>
            <p className="font-semibold">{product.category}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Stock</p>
            <p className="font-semibold">{product.stock}</p>
          </div>
          <div></div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default AccordianDropDown