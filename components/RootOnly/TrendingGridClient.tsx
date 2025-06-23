'use client';

import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ProductsCard from "../main/ProductsCard";
import {
  fetchTrendingProducts,
  type FetchTrendingProductsResult,
} from "@/actions/productActions/fetchTrendingProducts";
import type { TrendingProduct } from "@/schemas/TypeSchemas/TrendingSchema";

interface TrendingGridClientProps {
  initialProducts: TrendingProduct[];
  initialNextCursor: string | null;
  limit: number;
}

const TrendingGridClient: React.FC<TrendingGridClientProps> = ({
  initialProducts,
  initialNextCursor,
  limit,
}) => {
  const [products, setProducts] = useState<TrendingProduct[]>(initialProducts);
  const [isPaginating, setIsPaginating] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(!!initialNextCursor);
  const [cursor, setCursor] = useState<string | null>(initialNextCursor);

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
    if (inView && !isPaginating && hasNextPage) {
      loadProducts();
    }
  }, [inView, isPaginating, hasNextPage, loadProducts]);

  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Trending Products
      </h2>

      <div className="grid mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item, idx) => {
          const isSecondLast = idx === products.length - 2;

          return (
            <div
              key={`${item.id}-${item.product.slug}`}
              ref={isSecondLast ? ref : undefined}
              className="w-full h-[360px]"
            >
              <ProductsCard
                product={item.product}
                className="rounded-2xl shadow-md h-full w-full flex flex-col"
                imageClassName="rounded-t-2xl h-48 object-cover w-full"
                contentClassName="p-3 rounded-b-2xl bg-white flex-1"
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

export default TrendingGridClient; 