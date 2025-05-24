'use client'
import { rootHeaderData,AdminHeaderData } from '@/constant'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


interface props {
  className?:string
  HeaderData: typeof rootHeaderData | typeof AdminHeaderData
}


const HeaderMenu = ({className,HeaderData}: props) => {
  const pathname = usePathname()
  return (
    <div className='hidden md:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold text-[#151515]/80'>
      {HeaderData.map((item) =>( 
        <Link href={item.href} key={item.title} className={`hover:text-[#151515] hoverEffect relative group ${pathname === item.href && 'text-[#151515]'}`}>
            {item.title}
            <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-[#151515] hoverEffect group-hover:w-1/2 group-hover:left-0 ${pathname === item.href && 'w-1/2 left-0'}`}/>
            <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-[#151515] hoverEffect group-hover:w-1/2 group-hover:right-0 ${pathname === item.href && 'w-1/2 right-0'}`}/>
        </Link>
      ))}
    </div>
  )
}

export default HeaderMenu