'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'

interface props {
    categories: Array<{ category: string}>,
    setCategoryFilter: (category: string) => void,
    categoryFilter: string
}
const ProductFilter = ({ categories, setCategoryFilter, categoryFilter }: props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-white text-black border border-gray-300 shadow-sm w-1/2 h-8 mb-5 mx-2 
                    hover:bg-gray-100 hover:shadow-md transition-all duration-200 rounded-md text-sm font-medium">
                    {`Filter By Category: ${categoryFilter}`}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-60 rounded-md p-2 bg-white border border-gray-200 shadow-lg"
                align="start"
                sideOffset={5}
            >
                <DropdownMenuLabel className="text-sm font-semibold text-gray-700 text-center mb-1">
                    Select a Category
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-gray-200 h-px" />
                <DropdownMenuItem onClick={() => setCategoryFilter('All')} className="px-3 py-2 text-sm text-gray-800 rounded-md cursor-pointer hover:bg-gray-100 
                                transition-colors duration-150">
                    All
                </DropdownMenuItem>
                <DropdownMenuGroup>
                    {categories.map((category) => (
                        <DropdownMenuItem
                            key={category.category}
                            onClick={() => setCategoryFilter(category.category)}
                            className="px-3 py-2 text-sm text-gray-800 rounded-md cursor-pointer hover:bg-gray-100 
                                transition-colors duration-150"
                        >
                            {category.category}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default ProductFilter