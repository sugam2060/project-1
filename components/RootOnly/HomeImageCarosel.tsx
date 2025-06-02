'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const HomeImageCarosel = () => {
  const images = Array.from({ length: 5 }, (_, i) => `/carosel/${i + 1}.jpg`);
  const [index, setIndex] = useState(0);

  // Auto-increment index every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (i: number) => setIndex(i);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] 3xl:h-[700px] overflow-hidden shadow-md">
      {/* Image Slide Wrapper */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              src={images[index]}
              alt={`carousel-${index}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay gradient (optional for readability or style) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10 pointer-events-none" />

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`
              w-2 h-2 3xl:w-4 3xl:h-4 rounded-full 
              transition-all duration-300 border border-white/30
              ${i === index ? 'bg-white scale-125 shadow-lg' : 'bg-white/40'}
            `}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeImageCarosel;
