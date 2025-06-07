"use client";
import { ProductFieldFetchsSchema } from "@/schemas/ProductUploadSchema";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QuantityButtons from "./QuantityButtons";
import PriceFormatter from "@/components/main/PriceFormater";
import useCartStore from "@/store/store";
import z from "zod";

type Product = z.infer<typeof ProductFieldFetchsSchema>;
interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useCartStore();
  const itemCount = getItemCount(product.id);
  const isOutOfStock = product?.stock === 0;

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={() => {
            addItem(product);
            toast.success(
              `${product?.name?.substring(0, 12)}... added successfully!`
            );
          }}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-transparent text-darkColor shadow-none border border-darkColor/30 font-semibold tracking-wide hover:text-white hoverEffect",
            className
          )}
        >
          Add For Enquiry
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;