import HomeCaroselMgmt from '@/components/adminOnly/HomeCaroselMgmt'
import PrivateKeyDiv from '@/components/adminOnly/PrivateKeyDiv'
import Container from '@/components/main/Container'
import React from 'react'
import ManageLocations from '@/components/adminOnly/ManageLocations'
import AdminRevocation from '@/components/adminOnly/AdminRevocation'
import RecentInteriorProjectsMgmt from '@/components/adminOnly/RecentInteriorProjectsMgmt'

const MiscPage = () => {
  return (
    <Container>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-10 p-3'>
        {/* ---------------------------------------- Private_Key Generator ---------------------------------------- */}
        <div className='border-2 rounded-lg py-5 space-y-4'>
            <h3 className='text-center font-semibold text-2xl'>Send Private Key To User</h3>
            <PrivateKeyDiv/>
        </div>
        {/* ---------------------------------------- Employee delete/create  ---------------------------------------- */}
        <div>
          <AdminRevocation/>
        </div>
        {/* ---------------------------------------- Manage Home carosel Images  ---------------------------------------- */}
        <div className='border-2 rounded-lg pt-5 px-2'>
          <HomeCaroselMgmt/>
        </div>
        {/* ---------------------------------------- Manage Locations  ---------------------------------------- */}
        <ManageLocations/>
        <div className='border-2 rounded-lg pt-5 px-2'>
        {/* Recent Interior Projects Image Upload Component */}
        <RecentInteriorProjectsMgmt />
        </div>
      </div>
    </Container>
  )
}

export default MiscPage