// 'use client'
// import { fetchCategories } from '@/actions/productActions/FetchCategories'
// import useCategoriesStore from '@/store/categoryStore'
// import Link from 'next/link'
// import React, { useEffect } from 'react'

// const FooterCategories = () => {
//     const categoriesData = useCategoriesStore((state) => state.categories)
//     const setCategories = useCategoriesStore((state) => state.setCategories)

//     useEffect(() => {
//         const loadCategories = async () => {
//             const FooterCategory = await fetchCategories(); // Should return Array<{ category: string }>
//             if (FooterCategory) {
//                 setCategories(FooterCategory);
//             }
//         };

//         loadCategories();
//     }, [setCategories]);

//     return (
//         <div className='flex flex-col gap-3'>
//             {categoriesData.map((item) => (
//                 <Link className='text-gray-600 hover:text-[#151515] text-sm font-medium hoverEffect' href={`/products?category=${item.category}`} key={item.category}>
//                     {item.category}
//                 </Link>
//             ))}
//         </div>
//     )
// }

// export default FooterCategories