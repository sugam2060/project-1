'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  categoriesData:{
    category:string,
    images:Array<{id:string,imageUrl:string}>
  }
  className?: string
}

const ImageTitleCard: React.FC<CardProps> = ({ categoriesData, className }) => {
  const href = `/products?category=${encodeURIComponent(categoriesData.category)}`
  const imageUrl = categoriesData.images[0].imageUrl

  return (
    <Link href={href} passHref>
      <div
        className={cn(
          'relative w-full h-[300px] overflow-hidden rounded-md cursor-pointer group',
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={categoriesData.category}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Semi-transparent white stripe with centered title */}
        <div className="absolute top-1/2 left-0 w-full h-[50px] -translate-y-1/2 bg-white/80 flex items-center justify-center">
          <span className="text-black font-semibold text-lg tracking-wider">{categoriesData.category}</span>
        </div>
      </div>
    </Link>
  )
}

export default ImageTitleCard
