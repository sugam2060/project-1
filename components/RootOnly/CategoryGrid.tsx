import React from 'react'
import { fetchAllCategoryData } from '@/actions/productActions/FetchWholeCategoryData'
import CategoryCard from './CategoryCard'

const CategoryGrid = async () => {
  const categories = await fetchAllCategoryData()
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {categories.map((category) => (
        <CategoryCard categoriesData={category} key={category.category} />
      ))}
    </div>
  )
}


export default CategoryGrid