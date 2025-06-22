"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ProductsCard from "../main/ProductsCard";
import { Skeleton } from "../ui/skeleton";
import {
  fetchTrendingProducts,
  type FetchTrendingProductsResult,
} from "@/actions/productActions/fetchTrendingProducts";
import type { TrendingProduct } from "@/schemas/TypeSchemas/TrendingSchema";

interface TrendingGridProps {
  limit: number;
}

const TrendingGrid: React.FC<TrendingGridProps> = ({ limit }) => {
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const { ref, inView } = useInView({ threshold: 1.0 });

  const loadProducts = useCallback(async () => {
    if (isPaginating || !hasNextPage) return;

    setIsPaginating(true);
    try {
      const res: FetchTrendingProductsResult = await fetchTrendingProducts({
        limit,
        cursor,
        sortBy: "name",
        sortOrder: "asc",
      });

      if (res?.items?.length) {
        setProducts((prev) => [...prev, ...res.items]);
        setCursor(res.nextCursor);
        setHasNextPage(res.hasNextPage);
      }
    } catch (err) {
      console.error("Error fetching more products:", err);
    } finally {
      setIsPaginating(false);
    }
  }, [cursor, limit, hasNextPage, isPaginating]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await fetchTrendingProducts({
          limit,
          cursor: null,
          sortBy: "name",
          sortOrder: "asc",
        });
        if (res?.items?.length) {
          setProducts(res.items);
          setCursor(res.nextCursor);
          setHasNextPage(res.hasNextPage);
        }
      } catch (err) {
        console.error("Initial fetch failed:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitial();
  }, [limit]);

  useEffect(() => {
    if (inView && !isInitialLoading && !isPaginating && hasNextPage) {
      loadProducts();
    }
  }, [inView, isInitialLoading, isPaginating, hasNextPage, loadProducts]);

  if (isInitialLoading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex gap-4 py-2 px-2">
          {Array.from({ length: limit }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[260px] max-w-[300px] h-[360px] rounded-lg bg-white shadow-sm border border-zinc-200 flex flex-col overflow-hidden"
            >
              {/* Image Skeleton */}
              <Skeleton className="h-40 w-full rounded-t-lg bg-zinc-200" />
              {/* Content Skeleton */}
              <div className="flex-1 px-4 py-4 flex flex-col gap-3">
                <Skeleton className="h-5 w-3/4 bg-zinc-200" />
                <Skeleton className="h-4 w-1/2 bg-zinc-200" />
                <Skeleton className="h-6 w-1/3 mt-2 bg-zinc-200" />
                <Skeleton className="h-10 w-full mt-auto bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Trending Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item, idx) => {
          const isSecondLast = idx === products.length - 2;

          return (
            <div
              key={`${item.id}-${item.product.slug}`}
              ref={isSecondLast ? ref : undefined}
              className="min-h-[100px] mx-auto  max-w-full"
            >
              <ProductsCard
                product={item.product}
                className="rounded-2xl shadow-md h-full"
                imageClassName="rounded-t-2xl h-48 object-cover"
                contentClassName="p-3 rounded-b-2xl bg-white"
              />
            </div>
          );
        })}
      </div>

      {isPaginating && hasNextPage && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading more…</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingGrid;
