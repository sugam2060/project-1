import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ProductLoadingSkeleton = () => {
    const array = Array.from({ length: 8 }, (_, index) => index + 1);
    return (
        <>
            {array.map((_, idx) => (
                <div
                    key={idx}
                    className="bg-black/10 w-full h-96 rounded-md flex flex-col gap-2"
                >
                    <Skeleton className="h-76 bg-gray-400 rounded-br-none rounded-bl-none" />
                    <Skeleton className="h-5 mx-2 bg-gray-400" />
                    <Skeleton className="h-10 mx-2 bg-gray-400" />
                </div>
            ))}
        </>
    );
};


export default ProductLoadingSkeleton