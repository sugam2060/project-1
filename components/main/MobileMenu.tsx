'use client'
import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideBar from './SideBar'
import { AdminHeaderData, rootHeaderData } from '@/constant'

const MobileMenu = ({HeaderData}:{HeaderData: typeof AdminHeaderData | typeof rootHeaderData}) => {
    const [open,setOpen] = useState(false)
    return (
        <>
            <button onClick={() => setOpen(!open)}>
                <AlignLeft className='w-8 h-8 pl-2  hover:text-[#151515] hoverEffect md:hidden'/>
            </button>
            <div className='md:hidden'>
                <SideBar HeaderData={HeaderData} isOpen={open} onClose={() => setOpen(false)}/>
            </div>
        </>
    )
}

export default MobileMenu