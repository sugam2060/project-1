import { cn } from '@/lib/utils'
import React from 'react'

interface props {
    amount: number|undefined
    className?: string
}
const PriceFormater = ({amount,className}:props) => {
    const fotmatedPrice = new Number(amount).toLocaleString('en-US', {style: 'currency', currency: 'NPR',minimumFractionDigits:2})
  return (
    <span className={cn('text-sm font-semibold text-[#151515]',className)}>
        {fotmatedPrice}
    </span>
  )
}

export default PriceFormater 