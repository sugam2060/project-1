'use client'
import React from 'react'
import { AdminHeaderData, rootHeaderData } from '@/constant'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import Link from 'next/link'

interface props {
    isOpen: boolean
    onClose: () => void
    HeaderData: typeof rootHeaderData | typeof AdminHeaderData
}
const SideBar = ({ isOpen, onClose,HeaderData}: props) => {
    const sideBarref = useOutsideClick<HTMLDivElement>(onClose)
    return (
        <div className={`fixed inset-y-0 left-0 z-50 bg-[#151515]/50 shadow-xl hoverEffect cursor-auto w-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <motion.div ref={sideBarref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className='min-w-72 max-w-96 bg-[#151515] text-white/70 h-full p-10 border-r border-r-white flex flex-col gap-6'>
                <div className='text-right'>
                    <button className='hover:text-red-500 hoverEffect' onClick={onClose}>
                        <X />
                    </button>
                </div>
                <div className='flex flex-col gap-3.5 text-base font-semibold tracking-wide'>
                    {HeaderData?.map((item) => (
                        <Link onClick={onClose} key={item?.title} href={item.href} className={`hover:text-white hoverEffect w-12`}>{item?.title}
                        </Link>
                    ))}
                </div>
                {/* <SocialMedia className=''/> */}
            </motion.div>
        </div>
    )
}

export default SideBar