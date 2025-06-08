'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ImageViewProps {
    images?: Array<{
        id: string,
        imageUrl: string
    }>
}

const ImageView = ({ images }: ImageViewProps) => {
    const [active, setActive] = useState(0)

    return (
        <div className="w-full flex flex-col items-center px-2">
            <AnimatePresence mode="wait">
                <motion.div
                    key={images![active].id}
                    className='w-full max-w-2xl min-h-[300px] max-h-[300px] sm:min-h-[350px] sm:max-h-[350px] md:min-h-[400px] md:max-h-[400px] lg:min-h-[500px] lg:max-h-[500px] border-2 border-gray-300 rounded-lg overflow-hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Image
                        src={new URL(images![active].imageUrl).href}
                        width={500}
                        height={600}
                        alt="product"
                        className='w-full h-full object-cover max-w-2xl min-h-[300px] max-h-[300px] sm:min-h-[350px] sm:max-h-[350px] md:min-h-[400px] md:max-h-[400px] lg:min-h-[500px] lg:max-h-[500px]'
                    />
                </motion.div>
            </AnimatePresence>

            <div className='w-full max-w-2xl mt-3 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2'>
                {images?.map((image, idx) => (
                    <motion.div
                        key={image.id + '-' + idx}
                        onClick={() => setActive(idx)}
                        className={`cursor-pointer border-2 ${active === idx ? 'border-blue-500' : 'border-gray-300'} rounded-lg overflow-hidden aspect-square`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image
                            src={new URL(image.imageUrl).href}
                            width={100}
                            height={100}
                            alt={`product thumbnail ${idx}`}
                            className='w-full h-full object-cover'
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default ImageView
