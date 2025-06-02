'use client'
import { cn } from '@/lib/utils'
import ProductsCard from './ProductsCard'
import { fetchProducts } from '@/actions/productActions/fetchData'
import { useEffect, useState, useCallback } from 'react'
import ProductLoadingSkeleton from './ProductLoadingSkeleton'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import z from 'zod'
import { fetchByCategory } from '@/actions/productActions/FetchByCategory'
import ProductFilter from './ProductFilter'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'

type productType = z.infer<typeof ProductFieldFetchsSchema>

interface ProductGridProps {
  className?: string;
  number?: number;
  categories: Array<{ category: string }>;
}

const ProductGrid = ({ className, number, categories }: ProductGridProps) => {
  const [allProducts, setAllProducts] = useState<productType[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { ref, inView } = useInView()

  // Reset and fetch initial data when category changes
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setAllProducts([]); // Clear existing products
      setPageLoaded(1);
      
      try {
        const { products, totalPage } = categoryFilter !== 'All' 
          ? await fetchByCategory({ number: number as number, page: 1, category: categoryFilter }) 
          : await fetchProducts({ number: number as number, page: 1 });
        
        setAllProducts(products || []);
        setTotalPage(totalPage || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setTotalPage(0);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInitialData();
  }, [categoryFilter, number])

  // Load more products
  const loadMorePages = useCallback(async () => {
    if (isLoadingMore || pageLoaded >= totalPage) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = pageLoaded + 1;
      
      let result;
      if (categoryFilter !== 'All') {
        result = await fetchByCategory({ 
          number: number as number, 
          page: nextPage, 
          category: categoryFilter 
        });
      } else {
        result = await fetchProducts({ 
          number: number as number, 
          page: nextPage 
        });
      }
      
      if (result?.products) {
        setAllProducts((prev) => [...prev, ...result.products]);
        setPageLoaded(nextPage);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [number, pageLoaded, totalPage, categoryFilter, isLoadingMore]);

  // Trigger load more when in view
  useEffect(() => {
    if (inView && !isLoadingMore && pageLoaded < totalPage && !isLoading) {
      loadMorePages();
    }
  }, [inView, loadMorePages, isLoadingMore, pageLoaded, totalPage, isLoading]);

  const safeProducts = allProducts.map((product) => ({
    ...product,
    discount: product.discount ? product.discount : 0
  }))

  return (
    <div className='mb-3'>
      <div className='flex gap-5 mb-4'>
        <ProductFilter 
          categories={categories} 
          categoryFilter={categoryFilter} 
          setCategoryFilter={setCategoryFilter} 
        />
      </div>
      
      {isLoading ? (
        <ProductLoadingSkeleton length={number as number} className={className} />
      ) : (
        <>
          {/* Single grid container for all products */}
          <div className={cn("mx-2 mb-3", className)}>
            {safeProducts.map((product) => (
              <ProductsCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Load more trigger and loading indicator */}
          {totalPage > pageLoaded && (
            <div ref={ref} className='flex justify-center items-center p-4'>
              <Loader2 className='w-6 h-6 mx-auto mt-10 mb-2 animate-spin' />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductGrid