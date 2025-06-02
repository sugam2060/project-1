'use client'
import { AnimatePresence,motion } from 'motion/react'
import Image from 'next/image'
import React, { useState } from 'react'

interface imageViewProp {
    id:string,
    imageUrl:string
}

const ImageView = ({images}:{images:imageViewProp[]}) => {
    const [active,setActive] = useState(images[0])
  return (
    <div className='w-full md:w-1/2 space-y-2 md:space-y-4'>
        <AnimatePresence mode='wait'>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} key={active.id} className='w-full h-80 md:max-h-[350px] md:min-h-[250px] border border-[#151515]/10 rounded-md group overflow-hidden'>
                <Image src={active.imageUrl} width={700} height={700} alt="product" className='w-full h-80 md:max-h-[350px] md:min-h-[250px] object-cover 2xl:object-contain  group-hover:scale-110 hoverEffect rounded-md' priority={true}/>
            </motion.div>
        </AnimatePresence>
        <div className='grid grid-cols-3 md:grid-cols-5 gap-2 h-20 md:h-28'>
            {images.map((image) => (
                <button key={image.id} className={`w-full border rounded-md overflow-hidden ${active.id === image.id ? 'ring-1 ring-[#151515]':''}`} onClick={() => setActive(image)}>
                    <Image src={image.imageUrl} width={100} height={100} alt='sub product' className='w-full h-auto object-contain'/>
                </button>
            ))}
        </div>
    </div>
  )
}

export default ImageView