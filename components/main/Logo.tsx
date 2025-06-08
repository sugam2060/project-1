import { cn } from '@/lib/utils'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href={'/'}>
      <div className={cn("h-full flex items-center")}>
        <Image src={'/logo.png'} width={100} height={100} alt="logo" className={cn('h-full object-contain', className)}/>
      </div>
    </Link>
  );
};


export default Logo