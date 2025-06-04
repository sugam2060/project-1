'use client'
import { cn } from '@/lib/utils'
import ProductsCard from './ProductsCard'
import { fetchProducts, getPriceRange } from '@/actions/productActions/fetchData'
import { useEffect, useState, useCallback, useRef } from 'react'
import ProductLoadingSkeleton from './ProductLoadingSkeleton'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import z from 'zod'
import CategoryFilter from './CategoryFilter'
import PriceFilter from './PriceFilter'
import { useInView } from 'react-intersection-observer'
import { Loader2, SlidersHorizontal } from 'lucide-react'
import { fetchCategories } from '@/actions/productActions/FetchCategories'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type productType = z.infer<typeof ProductFieldFetchsSchema>

interface PriceRange {
  min: number;
  max: number;
}

interface ProductGridProps {
  className?: string;
  limit?: number;
}

const ProductGrid = ({ className, limit }: ProductGridProps) => {
  const [allProducts, setAllProducts] = useState<productType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 10000 });
  const [availablePriceRange, setAvailablePriceRange] = useState<PriceRange>({ min: 0, max: 10000 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [categories, setCategories] = useState<Array<{ category: string }>>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const skipNextFetch = useRef(false); // 👈 Fix flickering

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesResult = await fetchCategories();
        setCategories(categoriesResult || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const fetchAvailablePriceRange = async () => {
      try {
        const range = await getPriceRange(selectedCategories.length > 0 ? selectedCategories : undefined);
        setAvailablePriceRange(range);

        if (priceRange.min < range.min || priceRange.max > range.max) {
          skipNextFetch.current = true; // 👈 Skip next product fetch
          setPriceRange({
            min: range.min,
            max: range.max
          });
        }
      } catch (error) {
        console.error('Error fetching price range:', error);
      }
    };

    fetchAvailablePriceRange();
  }, [selectedCategories]);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      setAllProducts([]);
      setNextCursor(null);
      setHasNextPage(false);

      try {
        const productsResult = await fetchProducts({
          limit: limit as number,
          selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
          priceRange: priceRange.min !== availablePriceRange.min || priceRange.max !== availablePriceRange.max
            ? priceRange
            : undefined
        });

        setAllProducts(productsResult.products || []);
        setNextCursor(productsResult.nextCursor);
        setHasNextPage(productsResult.hasNextPage);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setNextCursor(null);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedCategories, priceRange, limit, availablePriceRange]);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || !nextCursor) return;

    setIsLoadingMore(true);
    try {
      const result = await fetchProducts({
        limit: limit as number,
        cursor: nextCursor,
        selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
        priceRange: priceRange.min !== availablePriceRange.min || priceRange.max !== availablePriceRange.max
          ? priceRange
          : undefined
      });

      if (result?.products) {
        setAllProducts((prev) => [...prev, ...result.products]);
        setNextCursor(result.nextCursor);
        setHasNextPage(result.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [limit, nextCursor, selectedCategories, priceRange, availablePriceRange, isLoadingMore, hasNextPage]);

  useEffect(() => {
    if (inView && !isLoadingMore && hasNextPage && !isLoading) {
      loadMoreProducts();
    }
  }, [inView, loadMoreProducts, isLoadingMore, hasNextPage, isLoading]);

  const handleApplyFilters = useCallback(() => {
    // The useEffects will automatically trigger when filters change
  }, []);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: availablePriceRange.min, max: availablePriceRange.max });
  };

  const safeProducts = allProducts.map((product) => ({
    ...product,
    discount: product.discount ? product.discount : 0
  }));

  const hasActiveFilters = selectedCategories.length > 0 ||
    priceRange.min !== availablePriceRange.min ||
    priceRange.max !== availablePriceRange.max;

  return (
    <div className='mb-3'>
      {/* Filter Section */}
      <div className='space-y-3 mb-4'>
        <div className='flex gap-3 items-center flex-wrap'>
          <div className='flex items-center gap-2'>
            <SlidersHorizontal className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Filters:</span>
          </div>

          <CategoryFilter
            categories={categories}
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
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span>Active filters:</span>
            {selectedCategories.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
              </Badge>
            )}
            {(priceRange.min !== availablePriceRange.min || priceRange.max !== availablePriceRange.max) && (
              <Badge variant="outline" className="text-xs">
                Price: ${priceRange.min} - ${priceRange.max}
              </Badge>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <ProductLoadingSkeleton length={limit as number} className={className} />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {allProducts.length > 0 ? (
              <>
                Showing {allProducts.length} product{allProducts.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' matching your filters'}
              </>
            ) : (
              'No products found'
            )}
          </div>

          <div className={cn("mx-2 mb-3", className)}>
            {safeProducts.length > 0 ? (
              safeProducts.map((product) => (
                <ProductsCard key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">
                  No products found matching your filters.
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="mt-2"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {hasNextPage && (
            <div ref={ref} className='flex justify-center items-center p-4'>
              {isLoadingMore && (
                <Loader2 className='w-6 h-6 mx-auto mt-10 mb-2 animate-spin' />
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
  )
}

export default ProductGrid
