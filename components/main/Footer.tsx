import React from 'react'
import Container from '@/components/main/Container'
import FooterTop from './FooterTop'
import SocialMedia from './SocialMedia'
import { quickLinksData } from '@/constant'
import Link from 'next/link'
import FooterCategories from './FooterCategories'

const Footer = async () => {
  return (
    <footer className='bg-white border-t'>
      <Container>
        <FooterTop />
        <div className='py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <h2 className='font-semibold text-xl'>Kalika Kasta Furniture Udgog</h2>
            <p className='text-gray-600 text-sm'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima accusantium consectetur cum esse distinctio in facilis deleniti, doloribus culpa. Aliquid?
            </p>
          </div>
          <div>
            <h3 className='font-semibold text-[#151515] mb-4'>Quick Links</h3>
            <div className='flex flex-col gap-3'>
              {quickLinksData.map((item) => (
                <Link className='text-gray-600 hover:text-[#151515] text-sm font-medium hoverEffect' href={item.href} key={item.title}>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-[#151515] mb-4'>Categories</h3>
            <FooterCategories />
          </div>
          <div>
            <h3 className='font-semibold text-[#151515] mb-3'>Social Media</h3>
            <p className='mb-3 text-base font-normal'>Follow us on social media</p>
            <SocialMedia className='text-[#151515]/60' iconClassName='border-[#151515]/60 hover:border-[#151515] hover:text-[#151515]' tooptipClassName='bg-[#151515] text-white' />
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer