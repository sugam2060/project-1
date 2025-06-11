'use client'
import { Loader2, Search, SearchIcon, X } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { fetchSearch } from '@/actions/productActions/fetchedSearch'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import { z } from 'zod'
import AddToCartButton from '../RootOnly/AddToCartButton'
import PriceView from './PriceView'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Product = z.infer<typeof ProductFieldFetchsSchema>

const Searchbar = () => {
  const [search, setSearch] = React.useState('')
  const [products, setProducts] = React.useState<Array<Product>>([])
  const [loading, setLoading] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)

  const pathname = usePathname()

  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([])
      return
    }
    setLoading(true)
    try {

      const response = await fetchSearch(search)
      if (!response) {
        setProducts([])
        return
      }
      setProducts(response)

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts()
    }, 700)
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [search, fetchProducts])


  return (
    <Dialog open={showSearch} onOpenChange={() => setShowSearch(!showSearch)}>
      <DialogTrigger onClick={() => setShowSearch(!showSearch)}>
        <Search className='w-5 h-5 hover:text-[#151515] hoverEffect' />
      </DialogTrigger>
      <DialogContent className='min-w-[70vw] min-h-[90vh] max-h-[90vh] flex flex-col overflow-hidden'>
        <DialogHeader>
          <DialogTitle>
            Product Searchbar
          </DialogTitle>
          <form className='relative' onSubmit={(e) => e.preventDefault()}>
            <Input placeholder='Search your product here...' className='flex-1 rounded-md py-5' value={search} onChange={(e) => setSearch(e.target.value)} />

            {search && <X onClick={() => setSearch('')} className='w-4 h-4 absolute top-3 right-11 hover:text-red-600 hoverEffect' />}

            <button type='submit' className={`absolute top-0 right-0 w-10 h-full flex items-center justify-center rounded-tr-md rounded-br-md hover:bg-[#151515] hover:text-white hoverEffect ${search ? 'bg-[#151515] text-white' : 'bg-[#151515]/10'}`} >
              <SearchIcon className='w-5 h-5' />
            </button>
          </form>
        </DialogHeader>
        <div className='w-full h-full overflow-y-scroll border border-[#151515]/20 rounded-md'>
          <div>
            {loading ? (
              <p className='flex items-center px-6 py-10 justify-center gap-1 text-center font-semibold text-blue-500'><Loader2 className='w-5 h-5 animate-spin' />Searching on progress</p>
            ) :
              products.length ?
                (
                  products?.map((product: Product) => (
                    <div key={product.id} className='bg-white overflow-hidden border-b last:border-b-0'>
                      <div className='flex flex-col md:flex-row justify-center items-center p-1'>
                        <Link href={pathname.startsWith("/admin") ? `/admin/product/${product.slug}` : `/products/${product.slug}`} className='h-50 w-[90%] md:h-24 md:w-24 flex-shrink-0 border-[#151515]/20 rounded-md overflow-hidden group' onClick={() => setShowSearch(false)}>
                          {product?.images && (
                            <Image src={new URL(product.images[0].imageUrl).href} alt='productProfile' width={200} height={200} className='object-cover w-full h-full group-hover:scale-110 hoverEffect' />
                          )}
                        </Link>
                        <div className='flex-grow px-4 py-2'>
                          <Link href={pathname.startsWith("/admin") ? `/admin/product/${product.slug}` : `/products/${product.slug}`} onClick={() => setShowSearch(false)}>
                            <h3 className='text-sm md:text-lg font-semibold text-gray-800 line-clamp-1'>
                              {product?.name}
                            </h3>
                            <p className='text-sm text-gray-600 line-clamp-1'>{product.description}</p>
                          </Link>
                          <PriceView price={product.price} discount={product?.discount} className='md:text-lg' />
                        </div>
                        <div className='max-md:w-full max-md:px-2'>
                          <AddToCartButton product={product} className='' />
                        </div>
                      </div>
                    </div>
                  ))
                ) : <div className='text-center py-10 font-semibold tracking-wide'>
                  {search && !loading ? (<p className='text-red-600 font-semibold'>Nothing matches your search</p>) : (<p className='text-green-600 flex items-center justify-center gap-1'><SearchIcon className='w-5 h-5' />Search and explore your products</p>)}
                </div>

            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Searchbar