"use client";

import { cn } from "@/lib/utils";
import ProductsCard from "./ProductsCard";
import {
  fetchProducts,
  getPriceRange,
} from "@/actions/productActions/fetchData";
import { useEffect, useState, useCallback } from "react";
import ProductLoadingSkeleton from "./ProductLoadingSkeleton";
import { ProductFieldFetchsSchema } from "@/schemas/ProductUploadSchema";
import z from "zod";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import { useInView } from "react-intersection-observer";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useQuery,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";

type productType = z.infer<typeof ProductFieldFetchsSchema>;

interface PriceRange {
  min: number;
  max: number;
}

interface ProductGridProps {
  className?: string;
  limit?: number;
  filter?: string;
}

type ProductsResult = Awaited<ReturnType<typeof fetchProducts>>;
type PageParam = string | undefined;
type ProductsQueryKey = [
  "products",
  { limit: number; selectedCategories: string[]; priceRange: PriceRange }
];

export default function ProductGrid({
  className,
  limit = 12,
  filter,
}: ProductGridProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filter ? [filter] : []
  );
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 10000,
  });

  const {
    data: availablePriceRange = { min: 0, max: 10000 },
    isFetching: isFetchingPriceRange,
  } = useQuery({
    queryKey: ["priceRange", selectedCategories.sort().join(",")],
    queryFn: () =>
      getPriceRange(selectedCategories.length ? selectedCategories : undefined),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (
      priceRange.min < availablePriceRange.min ||
      priceRange.max > availablePriceRange.max
    ) {
      setPriceRange({
        min: availablePriceRange.min,
        max: availablePriceRange.max,
      });
    }
  }, [availablePriceRange, priceRange.min, priceRange.max]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      ProductsResult,
      Error,
      InfiniteData<ProductsResult, PageParam>,
      ProductsQueryKey,
      PageParam
    >({
      queryKey: ["products", { limit, selectedCategories, priceRange }],
      initialPageParam: undefined,
      enabled: !isFetchingPriceRange,
      queryFn: ({ pageParam }) =>
        fetchProducts({
          limit,
          cursor: pageParam,
          selectedCategories: selectedCategories.length
            ? selectedCategories
            : undefined,
          priceRange:
            priceRange.min !== availablePriceRange.min ||
            priceRange.max !== availablePriceRange.max
              ? priceRange
              : undefined,
        }),
      getNextPageParam: (last) => last.nextCursor ?? undefined,
    });

  const allProducts: productType[] =
    data?.pages.flatMap((page: ProductsResult) => page.products) ?? [];

  const safeProducts = allProducts.map((p) => ({
    ...p,
    discount: p.discount ?? 0,
  }));

  const { ref, inView } = useInView({ threshold: 1, rootMargin: "100px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleApplyFilters = useCallback(() => {}, []);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({
      min: availablePriceRange.min,
      max: availablePriceRange.max,
    });
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange.min !== availablePriceRange.min ||
    priceRange.max !== availablePriceRange.max;

  return (
    <div className="mb-3">
      {/* Filters */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onApplyFilter={handleApplyFilters}
          />

          <PriceFilter
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={availablePriceRange.min}
            maxPrice={availablePriceRange.max}
            onApplyFilter={handleApplyFilters}
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Active filters:</span>
            {selectedCategories.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedCategories.length}{" "}
                {selectedCategories.length === 1 ? "category" : "categories"}
              </Badge>
            )}
            {(priceRange.min !== availablePriceRange.min ||
              priceRange.max !== availablePriceRange.max) && (
              <Badge variant="outline" className="text-xs">
                Price: ${priceRange.min}-${priceRange.max}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* List or Skeleton */}
      {isLoading ? (
        <ProductLoadingSkeleton length={limit} className={className} />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {allProducts.length > 0 ? (
              <>
                Showing {allProducts.length} product
                {allProducts.length !== 1 && "s"}
                {hasActiveFilters && " matching your filters"}
              </>
            ) : (
              ""
            )}
          </div>

          <div className={cn("mx-2 mb-3", className)}>
            {safeProducts.length > 0 ? (
              safeProducts.map((p) => (
                <div key={p.id} className="flex justify-center mb-4">
                  <ProductsCard
                    product={p}
                    className="transition-transform duration-300 hover:scale-[1.025] hover:shadow-xl border-0 shadow-md bg-gradient-to-br from-white via-zinc-50 to-zinc-100 min-h-[400px] h-[420px]"
                    imageClassName="bg-gradient-to-tr from-zinc-200 via-zinc-100 to-white h-56"
                    contentClassName="bg-white/80 backdrop-blur-sm rounded-b-lg"
                  />
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center min-h-[300px] text-center">
                <p className="text-muted-foreground text-base sm:text-lg font-medium">
                  {hasActiveFilters
                    ? "No products found matching your filters."
                    : "No products available at the moment."}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="mt-4"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* infinite loader */}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center items-center p-4">
              {isFetchingNextPage && (
                <Loader2 className="w-6 h-6 mx-auto mt-10 mb-2 animate-spin" />
              )}
            </div>
          )}

          {!hasNextPage && allProducts.length > 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              You&apos;ve reached the end of the catalog
            </div>
          )}
        </>
      )}
    </div>
  );
}
