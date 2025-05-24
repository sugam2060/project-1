import { cn } from '@/lib/utils'
import Link from 'next/link';
import React from 'react'

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href={'/'}>
      <div className={cn("h-full flex items-center")}>
        <img
          src="/logo.png"
          alt="logo"
          className={cn('h-full object-contain', className)}
        />
      </div>
    </Link>
  );
};


export default Logo