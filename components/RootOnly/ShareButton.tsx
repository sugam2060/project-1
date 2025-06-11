'use client'
import { Share2 } from 'lucide-react'
import React from 'react'
import { toast } from 'react-hot-toast'

const ShareButton = () => {

    const copyClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard')
    }

    return (
        <div className='flex min-h-[50px]  items-center gap-2 hover:text-red-500 hoverEffect' onClick={() => copyClipboard()}>
            <Share2 className='w-4 h-4' />
            <p className='font-semibold'>Share</p>
        </div>
    )
}

export default ShareButton