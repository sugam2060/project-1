import { cn } from '@/lib/utils'
import ProductsCard from './ProductsCard'
import { fetchProducts } from '@/actions/productActions/fetchData'

const ProductGrid = async ({ className, number }: { className?: string, number?: number }) => {
  const products = await fetchProducts({ number: number as number, page: 1 })

  const formattedProducts = products.map(product => ({
    ...product,
    price: product.price.toString(),
    stock: product.stock.toString(),
    discount: product.discount != null ? product.discount.toString() : '0',
  }))

  return (
    <div className={cn("mx-2", className)}>
      {formattedProducts.map((product) => (
        <ProductsCard key={product.id} products={product} />
      ))}
    </div>
  )
}

export default ProductGrid
