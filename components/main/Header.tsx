import React from 'react'
import Container from '@/components/main/Container'
import Logo from './Logo'
import MobileMenu from './MobileMenu';
import HeaderMenu from './HeaderMenu';
import Searchbar from './Searchbar';
import CartIcon from './CartIcon';
import Link from 'next/link';
import { auth} from '@/auth';
import DropDown from './DropDown';
import { SessionProvider } from 'next-auth/react';
import { rootHeaderData } from '@/constant';



const Header = async () => {
  const session = await auth()
  return (
    <div className="bg-gray-200 h-20 border-b border-b-gray-200 sticky top-0 z-50">
      <Container className="h-full flex items-center justify-between pr-5">
        <div className='flex items-center gap-2 h-full'>
          <MobileMenu HeaderData={rootHeaderData}/>
          <Logo className='h-12'/>
        </div>
        <HeaderMenu className='hidden md:flex' HeaderData={rootHeaderData} />
        <div className='flex items-center gap-3.5'>
          <Searchbar/>
          <CartIcon/>
          {session ? 
            <SessionProvider>
              <DropDown/>
            </SessionProvider>
          : 
          <Link href={'/auth/login'} className='text-sm font-semibold hover:text-[#151515] hoverEffect text-[#151515]/80'>
              Login
          </Link>}
        </div>
      </Container>
    </div>
  );
};

export default Header