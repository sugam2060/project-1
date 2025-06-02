import AdminHeader from '@/components/main/AdminHeader'
import Footer from '@/components/main/Footer'
import React from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <AdminHeader />
            {children}
            <div className='footer-sentinel'>
                <Footer />
            </div>
        </main>
    )
}

export default AdminLayout
