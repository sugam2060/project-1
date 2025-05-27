import React from 'react'
import PriceFormater from './PriceFormater'
import { cn } from '@/lib/utils'
interface Props {
    price: number|undefined
    discount: number|undefined,
    className?: string
}
const PriceView = ({price, discount,className}:Props) => {
  return (
        <div className='flex items-center gap-2'>
            <PriceFormater amount={price} className={className}/>
            {price && discount && <PriceFormater amount={price + (discount*price)/100} className={cn('line-through font-mediumtext-zinc-500')}/>}
        </div>
  )
}

export default PriceView