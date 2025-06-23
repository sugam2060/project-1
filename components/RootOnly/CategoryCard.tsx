"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryImage {
  id: string;
  imageUrl: string;
}

interface CardProps {
  categoriesData: {
    category: string;
    images: CategoryImage[];
  };
  className?: string;
}

const ImageTitleCard: React.FC<CardProps> = ({ categoriesData, className }) => {
  const href = `/products?category=${encodeURIComponent(
    categoriesData.category
  )}`;
  const imageUrl = categoriesData.images[0]?.imageUrl;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      href={href}
      aria-label={`Browse products in category ${categoriesData.category}`}
      className="focus:outline-none"
    >
      <motion.div
        initial={{ scale: 1, borderColor: "rgba(0,0,0,0.1)" }}
        whileHover={{
          scale: 1.03,
          borderColor: "rgba(0,0,0,0.15)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
        whileFocus={{
          scale: 1.03,
          borderColor: "rgba(0,0,0,0.2)",
          boxShadow: "0 0 0 3px rgba(0,0,0,0.12)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative block w-full h-[300px] overflow-hidden rounded-md cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
          className
        )}
        tabIndex={0}
      >
        {/* Image with blur placeholder */}
        {imageUrl ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
            )}
            <Image
              src={imageUrl}
              alt={categoriesData.category}
              fill
              className={cn(
                "object-cover transition-transform duration-300 ease-in-out",
                isLoading ? "opacity-0" : "opacity-100",
                "group-hover:scale-105"
              )}
              onLoad={() => setIsLoading(false)}
              placeholder="blur"
              blurDataURL="/images/placeholder.png" // optional
              sizes="(max-width: 640px) 100vw, 300px"
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xl select-none">
            No Image
          </div>
        )}

        {/* Semi-transparent white stripe with centered title */}
        <div className="absolute top-1/2 left-0 w-full h-[50px] -translate-y-1/2 bg-white/80 dark:bg-black/60 flex items-center justify-center">
          <span className="text-black dark:text-white font-semibold text-lg tracking-wider capitalize select-none">
            {categoriesData.category}
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default ImageTitleCard;
