"use client";

import { ProductFieldFetchsSchema } from "@/schemas/ProductUploadSchema";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import Image from "next/image";
import PriceView from "./PriceView";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import AddToCartButton from "../RootOnly/AddToCartButton";
import DeleteButton from "../adminOnly/DeleteButton";
import { cn } from "@/lib/utils";

interface ProductsCardProps {
  product: z.infer<typeof ProductFieldFetchsSchema>;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  actionsClassName?: string;
  variant?: "vertical" | "horizontal";
  renderActions?: (product: z.infer<typeof ProductFieldFetchsSchema>) => React.ReactNode;
  href?: string; // override default link
  showDescription?: boolean;
  showPrice?: boolean;
  showStockBadge?: boolean;
}


const ProductsCard = ({
  product,
  className,
  imageClassName,
  contentClassName,
  actionsClassName,
  variant = "vertical",
  renderActions,
  href,
  showDescription = true,
  showPrice = true,
  showStockBadge = true,
}: ProductsCardProps) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isOutOfStock = product.stock === 0;
  const hasDiscount = !!product.discount && product.discount > 0;
  const linkHref =
    href ||
    (isAdmin
      ? `/admin/product/${product.slug}`
      : `/products/${product.slug}`);
  const imageUrl =
    product.images && product.images.length > 0
      ? new URL(product.images[0].imageUrl).href
      : null;

  // Default actions: admin = delete, else add to cart
  const defaultActions = isAdmin ? (
    <DeleteButton product={product} />
  ) : (
    <AddToCartButton product={product} className="w-full" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden",
        variant === "horizontal"
          ? "flex flex-row min-h-[180px] max-h-[220px]"
          : "flex flex-col min-h-[320px] max-w-xs",
        className
      )}
      tabIndex={0}
      aria-label={`Product card for ${product.name}`}
    >
      {/* Image Section */}
      <Link
        href={linkHref}
        className={cn(
          "relative block flex-shrink-0 w-full",
          variant === "horizontal" ? "w-40 h-full min-w-[160px]" : "w-full h-48",
          imageClassName
        )}
        tabIndex={-1}
      >
        {imageUrl ? (
          <Image
            priority
            src={imageUrl}
            width={500}
            height={500}
            alt={product.name || "Product image"}
            className={cn(
              "object-cover w-full h-full transition-transform duration-300",
              !isOutOfStock && "group-hover:scale-105",
              variant === "horizontal" ? "rounded-l-lg" : "rounded-t-lg"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 text-2xl">
            No Image
          </div>
        )}
        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
            -{product.discount}%
          </span>
        )}
        {/* Out of stock overlay */}
        {showStockBadge && isOutOfStock && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#151515]/50 flex items-center justify-center z-10">
            <span className="text-white text-base font-semibold">Out of stock</span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div
        className={cn(
          "flex flex-col p-4 bg-zinc-50 flex-1",
          variant === "horizontal" ? "rounded-r-lg" : "rounded-b-lg",
          contentClassName
        )}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-base line-clamp-1" title={product.name}>
            {product.name}
          </h2>
          {showDescription && (
            <p className="text-xs text-zinc-600 line-clamp-2" title={product.description}>
              {product.description}
            </p>
          )}
          {showPrice && (
            <PriceView
              price={product.price}
              discount={product.discount}
              className="text-lg"
            />
          )}
        </div>

        {/* Actions Section */}
        <div className={cn("mt-auto", actionsClassName)}>
          {renderActions ? renderActions(product) : defaultActions}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsCard;
