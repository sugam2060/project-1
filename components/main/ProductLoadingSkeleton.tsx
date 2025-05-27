import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils';

const ProductLoadingSkeleton = ({length,className}:{length:number,className?:string}) => {
    const array = Array.from({ length }, (_, index) => index + 1);
    return (
        <div className={cn('',className)}>
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
        </div>
    );
};


export default ProductLoadingSkeleton