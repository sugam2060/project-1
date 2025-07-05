'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInteriorImagesByCategory } from "@/actions/ManagesMisc/InteriorPageMgmt";

interface Category {
  id: string;
  name: string;
}

interface MobileCategoryFilterProps {
  categories: Category[];
  defaultCategoryId: string;
}

// Category Gallery Component for mobile
const CategoryGallery = ({ categoryId }: { categoryId: string }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const images = await getInteriorImagesByCategory(categoryId);
        setImages(images || []);
      } catch (err) {
        setError('Failed to load images');
        console.error("Failed to load images for category:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchImages();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full aspect-square rounded-lg bg-zinc-200 animate-pulse shadow-inner"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Failed to load images.</p>
        <p className="text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">No images available for this category yet.</p>
        <p className="text-sm text-gray-500">Please check back later for new projects.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {images.map((src: string, idx: number) => (
        <div
          key={idx}
          className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300"
        >
          <Image
            src={src}
            alt={`Interior project ${idx + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
};

export const MobileCategoryFilter: React.FC<MobileCategoryFilterProps> = ({ 
  categories, 
  defaultCategoryId
}) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategoryId);
  const [open, setOpen] = useState(false);

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'Select Category';

  return (
    <div className="md:hidden space-y-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategoryName}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-[200px] overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  selectedCategory === category.id && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <CategoryGallery categoryId={selectedCategory} />
    </div>
  );
}; 